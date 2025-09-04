import { createContext, useContext, useMemo, useState } from 'react';

function decodeBase64UrlPayload(token: string): any | null {
    const part = token.split('.')[1]; if (!part) return null;
    let s = part.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4; if (pad) s += '='.repeat(4 - pad);
    try { return JSON.parse(atob(s)); } catch { return null; }
}

type Role = 'ADMIN' | 'USER' | null;
type AuthState = {
    token: string | null;
    role: Role;
    authed: boolean;
    login: (t: string) => void;
    logout: () => void;
};

const Ctx = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

    const role: Role = useMemo(() => {
        if (!token) return null;
        const p = decodeBase64UrlPayload(token);
        let r: any = p?.role ?? (Array.isArray(p?.roles) ? p.roles[0] : null);
        if (typeof r === 'string') {
            if (r.startsWith('ROLE_')) r = r.substring(5);
            r = r.toUpperCase(); // kisbetűs token esetére
        }
        return r === 'ADMIN' || r === 'USER' ? r : null;
    }, [token]);

    const login = (t: string) => {           // ← itt írjuk azonnal
        setToken(t);
        localStorage.setItem('token', t);
    };
    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    const value = useMemo(() => ({
        token, role, authed: !!token, login, logout
    }), [token, role]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}

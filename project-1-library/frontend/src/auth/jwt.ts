function decodeBase64Url(s: string): string {
    // JWT payload Base64URL -> Base64
    s = s.replace(/-/g, '+').replace(/_/g, '/');
    const pad = s.length % 4;
    if (pad) s += '='.repeat(4 - pad);
    return atob(s);
}

export function getToken(): string | null {
    return localStorage.getItem('token');
}

export function getTokenPayload(): any | null {
    const t = getToken();
    if (!t) return null;
    const parts = t.split('.');
    if (parts.length < 2) return null;
    try {
        return JSON.parse(decodeBase64Url(parts[1]));
    } catch {
        return null;
    }
}

export function getRole(): 'ADMIN' | 'USER' | null {
    const p = getTokenPayload();
    if (!p) return null;

    // token claim neve lehet 'role' vagy 'roles'
    let role: any = p.role ?? (Array.isArray(p.roles) ? p.roles[0] : null);

    // normalizálás: ROLE_ADMIN -> ADMIN
    if (typeof role === 'string' && role.startsWith('ROLE_')) {
        role = role.substring(5);
    }
    return role === 'ADMIN' || role === 'USER' ? role : null;
}

export function isLoggedIn(): boolean {
    return !!getToken();
}

export function logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import {useAuth} from "../auth/AuthContext.tsx";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
    const { role } = useAuth();
    return role === 'USER' || role === 'ADMIN' ? children : <Navigate to="/login" replace />;
}


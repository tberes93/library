import { Navigate } from 'react-router-dom';
import type { JSX } from 'react';
import {useAuth} from "../auth/AuthContext.tsx";

export default function AdminRoute({ children }: { children: JSX.Element }) {
    const { role } = useAuth();
    return role === 'ADMIN' ? children : <Navigate to="/" replace />;}


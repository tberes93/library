import { useForm } from 'react-hook-form';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';
import {useAuth} from "../auth/AuthContext.tsx";

type Form = { email: string; password: string };

export default function Login(){
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>();
    const nav = useNavigate();
    const { login } = useAuth();

    return (
        <form className="max-w-sm mx-auto card" onSubmit={handleSubmit(async v => {
            const res = await api.post('/api/auth/login', v);
            login(res.data.accessToken);
            nav('/');
        })}>
            <div className="card-p space-y-4">
                <header>
                    <h1 className="text-2xl font-bold">Belépés</h1>
                    <p className="help">Jelentkezz be a további funkciók eléréséhez.</p>
                </header>
                <div>
                    <label className="label">Email</label>
                    <input className="input"
                           placeholder="pl. te@pelda.hu" {...register('email', {required: 'Email kötelező'})} />
                    {errors.email && <p className="error">{errors.email.message}</p>}
                </div>
                <div>
                    <label className="label">Jelszó</label>
                    <input className="input" type="password"
                           placeholder="••••••••" {...register('password', {required: 'Jelszó kötelező'})} />
                    {errors.password && <p className="error">{errors.password.message}</p>}
                </div>
                <button className="btn btn-primary w-full"
                        disabled={isSubmitting}>{isSubmitting ? 'Beléptetés…' : 'Belépés'}</button>
            </div>
        </form>
    );
}


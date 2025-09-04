import { useForm } from 'react-hook-form';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

type Form = { email: string; password: string };

export default function Registration(){
    const { register, handleSubmit } = useForm<Form>();
    const nav = useNavigate();

    return (
        <form className="max-w-sm mx-auto p-6 space-y-3" onSubmit={handleSubmit(async v => {
            const res = await api.post('/api/auth/register', v);
            localStorage.setItem('token', res.data.accessToken);
            nav('/login');
        })}>
            <h1 className="text-2xl font-bold mb-4">Regisztrálás</h1>
            <input className="input" placeholder="Email" {...register('email')} />
            <input className="input" type="password" placeholder="Jelszó" {...register('password')} />
            <button className="btn">Regisztrálás</button>
        </form>
    );
}


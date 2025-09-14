import { useForm } from 'react-hook-form';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

type Form = { email: string; password: string };

export default function Registration() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>();
    const nav = useNavigate();

    return (
        <form
            className="max-w-sm mx-auto p-6 space-y-3"
            onSubmit={handleSubmit(async v => {
                try {
                    const res = await api.post('/api/auth/register', v);
                    // itt a backend most csak CREATED-et ad vissza, nem tokent -> ehhez igazítani kell
                    // pl. nav('/login');
                    nav('/login');
                } catch (e: any) {
                    if (e?.response?.status === 409) {
                        alert('Ez az e-mail cím már regisztrálva van.');
                    } else {
                        alert('Hiba történt.');
                    }
                }
            })}
        >
            <h1 className="text-2xl font-bold mb-4">Regisztrálás</h1>

            {/* Email */}
            <input
                className="input"
                placeholder="Email"
                {...register('email', {
                    required: 'Email megadása kötelező',
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Érvénytelen e-mail formátum',
                    }
                })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}

            {/* Jelszó */}
            <input
                className="input"
                type="password"
                placeholder="Jelszó"
                {...register('password', {
                    required: 'Jelszó megadása kötelező',
                    minLength: { value: 8, message: 'Legalább 8 karakter legyen' },
                    pattern: {
                        value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/,
                        message: 'A jelszónak tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert'
                    }
                })}
            />
            {errors.password && <p className="error">{errors.password.message}</p>}

            <button className="btn w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Folyamatban…' : 'Regisztrálás'}
            </button>
        </form>
    );
}

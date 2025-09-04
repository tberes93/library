import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../api';

type Book = { id:string; title:string; writer:string; type:string; description:string };
type Form = { bookId:string; start:string; end:string };

export default function NewBorrow(){
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<Form>();
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => { api.get('/api/books').then(b=>setBooks(b.data)); }, []);

    return (
        <form className="max-w-lg mx-auto card" onSubmit={handleSubmit(async v => {
            try {
                await api.post('/api/borrows', {bookId: v.bookId, start: new Date(v.start), end: new Date(v.end)});
                alert('Kölcsönzés rögzítve');
                reset();
            } catch (e: any) {
                if (e?.response?.status === 409) alert('Az adott időszakban a könyv ki van kölcsönözve! Válassz másik olvasmányt.');
                else alert('Hiba történt.');
            }
        })}>
            <div className="card-p space-y-4">
                <header className="space-y-1">
                    <h1 className="text-2xl font-bold">Kölcsönzés</h1>
                    <p className="help">Válassz könyvet és idősávot.</p>
                </header>
                <div>
                    <label className="label">Könyv</label>
                    <select className="input" {...register('bookId', {required: 'Válassz a könyvek közül!'})}>
                        <option value="">Válassz…</option>
                        {books.map(b => <option key={b.id} value={b.id}>{b.type} – {b.title}</option>)}
                    </select>
                    {errors.bookId && <p className="error">{errors.bookId.message}</p>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                        <label className="label">Kezdet</label>
                        <input className="input"
                               type="datetime-local" {...register('start', {required: 'Add meg a kezdő időpontot'})} />
                        {errors.start && <p className="error">{errors.start.message}</p>}
                    </div>
                    <div>
                        <label className="label">Vége</label>
                        <input className="input"
                               type="datetime-local" {...register('end', {required: 'Add meg a záró időpontot'})} />
                        {errors.end && <p className="error">{errors.end.message}</p>}
                    </div>
                </div>
                <button className="btn btn-primary w-full"
                        disabled={isSubmitting}>{isSubmitting ? 'Mentés…' : 'Kölcsönzés'}</button>
            </div>
        </form>
    );
}


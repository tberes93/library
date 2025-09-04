import { useEffect, useState } from 'react';
import { api } from '../api';

type Book = { id: string; title: string; writer: string; type: string; description?: string };

export default function BookList() {
    const [data, setData] = useState<Book[]>([]);
    useEffect(() => {
        api.get('/api/books').then(b => setData(b.data));
    }, []);
    return (
        <section className="space-y-4">
            <header className="flex items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Kölcsönözhető könyvek</h1>
                    <p className="text-sm text-gray-600">Válassz a jelenleg elérhető olvasmányaink közül!</p>
                </div>
            </header>


            <div className="grid grid-auto-fit gap-4">
                {data.map(b => (
                    <article key={b.id} className="card">
                        <div className="card-p space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold">{b.title}</h2>
                                {b.description && <span className="badge">{b.type}</span>}
                            </div>
                            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                <div>
                                    <dt className="text-gray-500">Író</dt>
                                    <dd className="font-medium">{b.writer}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500">Leírás</dt>
                                    <dd className="font-medium">{b.description}</dd>
                                </div>
                            </dl>
                        </div>
                    </article>
                ))}
            </div>


            {data.length === 0 && (
                <div className="card"><div className="card-p text-sm text-gray-600">A nyilvántartás szerint a könyvtár üres.</div></div>
            )}
        </section>
    );
}

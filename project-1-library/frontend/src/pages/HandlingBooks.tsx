import { useEffect, useState } from 'react';
import { api } from '../api';
import {Edit3, PlusCircle, Save, Trash2} from "lucide-react";

type Book = { id?:string; title:string; writer:string; type:string; description?:string };

export default function HandlingBooks(){
    const [items, setItems] = useState<Book[]>([]);
    const [form, setForm] = useState<Book>({ title:'', writer: '', type:'', description:'' });

    const load = async()=> setItems((await api.get('/api/books')).data);
    useEffect(()=>{ load(); },[]);

    const save = async()=>{
        if (form.id) await api.put(`/api/books/${form.id}`, form);
        else await api.post('/api/books', form);
        setForm({ title:'', writer:'', type:'', description:'' });
        await load();
    };

    const edit = (b:Book)=> setForm(b);
    const del = async(id?:string)=>{ if(!id) return; await api.delete(`/api/books/${id}`); await load(); };

    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-2xl font-bold">Könyvek kezelése</h1>
                <p className="help">Hozzáadás, módosítás, törlés.</p>
            </header>


            <div className="card">
                <div className="card-p grid gap-4 md:grid-cols-4">
                    <div>
                        <label className="label">Cím</label>
                        <input className="input" placeholder="Cím" value={form.title}
                               onChange={e => setForm({...form, title: e.target.value})}/>
                    </div>
                    <div>
                        <label className="label">Író</label>
                        <input className="input" placeholder="Író" value={form.writer}
                               onChange={e => setForm({...form, writer: e.target.value})}/>
                    </div>
                    <div>
                        <label className="label">Típus</label>
                        <input className="input" placeholder="Típus" value={form.type}
                               onChange={e => setForm({...form, type: e.target.value})}/>
                    </div>
                    <div>
                        <label className="label">Leírás</label>
                        <input className="input" placeholder="Rövid összefoglaló"
                               value={form.description ?? ''}
                               onChange={e => setForm({...form, description: e.target.value})}/>
                    </div>
                    <div className="md:col-span-4">
                        <button className="btn btn-primary"
                                onClick={save}>{form.id ? (<><Save className="size-4" /> Mentés</>) : (<><PlusCircle className="size-4" />Könyv hozzáadása</>)}</button>
                    </div>
                </div>
            </div>


            {/* Lista */}
            <div className="card">
                <div className="card-p">
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="text-gray-600">
                            <tr>
                                <th className="py-2 pr-4">Cím</th>
                                <th className="py-2 pr-4">Író</th>
                                <th className="py-2 pr-4">Típus</th>
                                <th className="py-2 pr-4">Leírás</th>
                                <th className="py-2 pr-4 w-40">Műveletek</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {items.map(c => (
                                <tr key={c.id} className="align-middle">
                                    <td className="py-3 pr-4 font-medium">{c.title}</td>
                                    <td className="py-3 pr-4">{c.writer}</td>
                                    <td className="py-3 pr-4">{c.type ?? '-'}</td>
                                    <td className="py-3 pr-4">{c.description}</td>
                                    <td className="py-3 pr-4">
                                        <div className="flex gap-2">
                                            <button className="btn btn-ghost" onClick={() => edit(c)}><Edit3 className="size-4" />Szerkeszt</button>
                                            <button className="btn btn-ghost" onClick={() => del(c.id)}><Trash2 className="size-4" />Törlés</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>


                    {/* Mobile kártyák */}
                    <ul className="md:hidden space-y-3">
                        {items.map(c => (
                            <li key={c.id} className="card">
                                <div className="card-p space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-base font-semibold">{c.title}</h3>
                                        {c.description && <span className="badge">{c.type}</span>}
                                    </div>
                                    <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                        <div>
                                            <dt className="text-gray-500">Író</dt>
                                            <dd className="font-medium">{c.writer}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-gray-500">Leírás</dt>
                                            <dd className="font-medium">{c.description}</dd>
                                        </div>
                                    </dl>
                                    <div className="flex gap-2">
                                        <button className="btn btn-ghost flex-1" onClick={() => edit(c)}> <Edit3 className="size-4" />Szerkeszt
                                        </button>
                                        <button className="btn btn-ghost flex-1" onClick={() => del(c.id)}><Trash2 className="size-4" />Törlés
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

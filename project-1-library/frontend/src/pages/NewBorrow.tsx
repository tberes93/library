import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../api';

type Book = { id: string; title: string; writer: string; type: string; description?: string };
type Form = { bookId: string; start: string; end: string };
type Borrow = { id: string; bookId: string; start: string; end: string; status?: string };

function toDate(v?: string | Date | null) {
    if (!v) return null;
    return v instanceof Date ? v : new Date(v);
}
function sameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isDayWithinInterval(day: Date, start: Date, end: Date) {
    // nap szintű jelölés: ha a nap bármely része fedésben van az intervallummal
    const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0, 0);
    const dayEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59, 999);
    return (start <= dayEnd) && (end >= dayStart);
}
function intervalsOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    return aStart < bEnd && bStart < aEnd; // fél-nyílt/nyílt intervallumokra is jó
}
function fmt(dt: Date) {
    return dt.toLocaleString();
}

export default function NewBorrow() {
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<Form>();
    const [books, setBooks] = useState<Book[]>([]);
    const [borrows, setBorrows] = useState<Borrow[]>([]);
    const [monthAnchor, setMonthAnchor] = useState<Date>(() => {
        const d = new Date();
        d.setDate(1);
        return d;
    });

    const watchBookId = watch('bookId');
    const watchStart = toDate(watch('start'));
    const watchEnd = toDate(watch('end'));

    // Könyvlista betöltése
    useEffect(() => {
        api.get('/api/books').then(b => setBooks(b.data));
    }, []);

    // Foglalások betöltése a kiválasztott könyvhöz
    useEffect(() => {
        if (!watchBookId) { setBorrows([]); return; }
        (async () => {
            // ⤵ ha nálad query paramos, cseréld: `/api/borrows?bookId=${watchBookId}`
            const res = await api.get(`/api/borrows/book/${watchBookId}`);
            setBorrows(res.data as Borrow[]);
        })();
    }, [watchBookId]);

    // Client-side ütközés-ellenőrzés az űrlap értékei alapján
    const overlapsNow = useMemo(() => {
        if (!watchStart || !watchEnd || watchEnd <= watchStart) return false;
        return borrows.some(b => {
            const s = toDate(b.start)!; const e = toDate(b.end)!;
            return intervalsOverlap(watchStart, watchEnd, s, e);
        });
    }, [watchStart, watchEnd, borrows]);

    // Naptár rács (6 hét / 42 cella) a monthAnchor hónaphoz
    const calendarDays = useMemo(() => {
        const year = monthAnchor.getFullYear();
        const month = monthAnchor.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const firstWeekday = (firstDayOfMonth.getDay() + 6) % 7; // hétfő=0
        const start = new Date(year, month, 1 - firstWeekday);

        const cells: { date: Date; booked: boolean }[] = [];
        for (let i = 0; i < 42; i++) {
            const d = new Date(start);
            d.setDate(start.getDate() + i);
            const booked = borrows.some(b => {
                const s = toDate(b.start)!; const e = toDate(b.end)!;
                return isDayWithinInterval(d, s, e);
            });
            cells.push({ date: d, booked });
        }
        return cells;
    }, [monthAnchor, borrows]);

    const onSubmit = handleSubmit(async v => {
        try {
            const payload = { bookId: v.bookId, start: new Date(v.start), end: new Date(v.end) };
            await api.post('/api/borrows', payload);
            alert('Kölcsönzés rögzítve');
            reset({ bookId: v.bookId, start: '', end: '' });
        } catch (e: any) {
            if (e?.response?.status === 409) alert('Az adott időszakban a könyv ki van kölcsönözve! Válassz másik idősávot.');
            else alert('Hiba történt.');
        }
    });

    const monthLabel = useMemo(() => {
        return monthAnchor.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    }, [monthAnchor]);

    return (
        <div className="max-w-5xl mx-auto grid gap-6 lg:grid-cols-2">
            {/* Űrlap */}
            <form className="card order-2 lg:order-none" onSubmit={onSubmit}>
                <div className="card-p space-y-4">
                    <header className="space-y-1">
                        <h1 className="text-2xl font-bold">Kölcsönzés</h1>
                        <p className="help">Válassz könyvet és idősávot. A naptár a már lefoglalt napokat jelöli.</p>
                    </header>

                    <div>
                        <label className="label">Könyv</label>
                        <select className="input" {...register('bookId', { required: 'Válassz a könyvek közül!' })}
                                onChange={e => {
                                    // hónap ugrik az első foglalás hónapjára, ha van
                                    const id = e.target.value;
                                    const first = borrows.find(b => b.bookId === id);
                                    if (first) setMonthAnchor(new Date(first.start));
                                }}>
                            <option value="">Válassz…</option>
                            {books.map(b => <option key={b.id} value={b.id}>{b.type} – {b.title}</option>)}
                        </select>
                        {errors.bookId && <p className="error">{errors.bookId.message}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="label">Kezdet</label>
                            <input className="input" type="datetime-local"
                                   {...register('start', { required: 'Add meg a kezdő időpontot' })} />
                            {errors.start && <p className="error">{errors.start.message}</p>}
                        </div>
                        <div>
                            <label className="label">Vége</label>
                            <input className="input" type="datetime-local"
                                   {...register('end', { required: 'Add meg a záró időpontot' })} />
                            {errors.end && <p className="error">{errors.end.message}</p>}
                        </div>
                    </div>

                    {watchStart && watchEnd && watchEnd <= watchStart && (
                        <p className="text-sm text-red-600">A záró időpontnak későbbinek kell lennie, mint a kezdő.</p>
                    )}
                    {overlapsNow && (
                        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                            A megadott idősáv ütközik egy meglévő foglalással. Válassz másik idősávot!
                        </div>
                    )}

                    <button className="btn btn-primary w-full"
                            disabled={isSubmitting || overlapsNow || !watchBookId}>
                        {isSubmitting ? 'Mentés…' : 'Kölcsönzés'}
                    </button>
                </div>
            </form>

            {/* Naptár + foglaláslista */}
            <section className="card">
                <div className="card-p space-y-4">
                    <header className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Foglalási naptár</h2>
                            <p className="help">A kiválasztott könyvhöz tartozó már rögzített foglalások.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button type="button" className="btn btn-ghost"
                                    onClick={() => setMonthAnchor(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}>
                                ‹ Előző
                            </button>
                            <div className="px-2 font-medium">{monthLabel}</div>
                            <button type="button" className="btn btn-ghost"
                                    onClick={() => setMonthAnchor(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}>
                                Következő ›
                            </button>
                        </div>
                    </header>

                    {/* Jelmagyarázat */}
                    <div className="flex items-center gap-4 text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></span> Foglalt nap(ok)
            </span>
                        <span className="inline-flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded bg-white border border-gray-300"></span> Szabad nap
            </span>
                    </div>

                    {/* Havi rács */}
                    <div className="grid grid-cols-7 text-xs text-gray-600">
                        {['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V'].map(d => (
                            <div key={d} className="px-2 py-1 font-medium">{d}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map(({ date, booked }, idx) => {
                            const isOtherMonth = date.getMonth() !== monthAnchor.getMonth();
                            return (
                                <div key={idx}
                                     className={[
                                         'min-h-12 p-2 rounded border',
                                         booked ? 'bg-emerald-100 border-emerald-300' : 'bg-white border-gray-200',
                                         isOtherMonth ? 'opacity-50' : ''
                                     ].join(' ')}>
                                    <div className="text-xs font-medium">{date.getDate()}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Foglalások listája */}
                    <div className="space-y-2">
                        <h3 className="font-medium">Lefoglalt idősávok</h3>
                        {borrows.length === 0 && <p className="text-sm text-gray-600">Ehhez a könyvhöz még nincs foglalás.</p>}
                        <ul className="space-y-2">
                            {borrows
                                .slice()
                                .sort((a, b) => +new Date(a.start) - +new Date(b.start))
                                .map(b => {
                                    const s = toDate(b.start)!; const e = toDate(b.end)!;
                                    return (
                                        <li key={b.id} className="text-sm flex items-center gap-2">
                                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                                            <span>{fmt(s)} → {fmt(e)}</span>
                                            {b.status && <span className="ml-auto text-gray-500">({b.status})</span>}
                                        </li>
                                    );
                                })}
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    );
}

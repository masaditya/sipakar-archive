import { useMemo, useState } from 'react';

export default function FollupCalculator() {
    const [form, setForm] = useState({
        entri: 0, // K59
        belumDitindaklanjuti: 0, // K60
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: Number(e.target.value || 0),
        });
    };

    const { entri, belumDitindaklanjuti } = form;

    const telahDitindaklanjuti = useMemo(() => entri - belumDitindaklanjuti, [entri, belumDitindaklanjuti]);

    const percent = useMemo(() => {
        if (entri === 0) return 0;
        return ((telahDitindaklanjuti / entri) * 100).toFixed(2);
    }, [telahDitindaklanjuti, entri]);

    return (
        <div className="space-y-4 rounded-xl border bg-white p-5">
            <h2 className="text-lg font-bold">Kalkulator Naskah Telah Ditindaklanjuti</h2>

            <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col">
                    <label>JUMLAH "ENTRI" NASKAH DINAS </label>
                    <input type="number" name="entri" value={form.entri} onChange={handleChange} className="rounded border px-3 py-2" />
                </div>
                <div className="flex flex-col">
                    <label>JUMLAH NASKAH "BELUM DITINDAKLANJUTI" </label>
                    <input
                        type="number"
                        name="belumDitindaklanjuti"
                        value={form.belumDitindaklanjuti}
                        onChange={handleChange}
                        className="rounded border px-3 py-2"
                    />
                </div>
            </div>
            <hr />

            <div>
                <div>
                    Jumlah Telah Ditindaklanjuti: <b>{telahDitindaklanjuti}</b>
                </div>
                <div>
                    Persentase: <b>{percent}%</b>
                </div>
            </div>
        </div>
    );
}

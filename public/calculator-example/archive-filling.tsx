import { useMemo, useState } from 'react';

export default function ArchiveFilingCalculator() {
    const [form, setForm] = useState({
        naskahKeluar: 0, // K157
        naskahMasuk: 0, // L158
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: Number(e.target.value || 0),
        });
    };

    const { naskahKeluar, naskahMasuk } = form;

    const rataRata = useMemo(() => {
        const inputs = [naskahKeluar, naskahMasuk];
        const count = inputs.length;
        const sum = inputs.reduce((a, b) => a + b, 0);
        return count === 0 ? 0 : (sum / count).toFixed(2);
    }, [naskahKeluar, naskahMasuk]);

    return (
        <div className="space-y-4 rounded-xl border bg-white p-5">
            <h2 className="text-lg font-bold">Kalkulator Rata-rata Persentase Pemberkasan Arsip Aktif</h2>

            <div className="grid grid-cols-1 gap-3">
                <div className="flex flex-col">
                    <label>Persentase Naskah Keluar yang Sudah Diberkaskan</label>
                    <input type="number" name="naskahKeluar" value={form.naskahKeluar} onChange={handleChange} className="rounded border px-3 py-2" />
                </div>

                <div className="flex flex-col">
                    <label>Persentase Naskah Masuk yang Sudah Diberkaskan </label>
                    <input type="number" name="naskahMasuk" value={form.naskahMasuk} onChange={handleChange} className="rounded border px-3 py-2" />
                </div>
            </div>

            <hr />

            <div>
                <div>
                    Rata-rata Persentase: <b>{rataRata}%</b>
                </div>
            </div>
        </div>
    );
}

import { useMemo, useState } from 'react';

export default function SignedSentCalculator() {
    const [form, setForm] = useState({
        entri: 0,
        belumDikirim: 0,
        ditolak: 0,
        diperbaiki: 0,
        belumDitandatangani: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: Number(e.target.value || 0),
        });
    };

    const { entri, belumDikirim, ditolak, diperbaiki, belumDitandatangani } = form;

    // SUM(K43:K45)
    const sumInvalid = ditolak + diperbaiki + belumDitandatangani;

    // Total valid K41 - SUM(K43:K45)
    const totalValid = entri - sumInvalid;

    // Rumus K46 = (K41 - SUM) - (K42 - SUM)
    const dikirim = useMemo(() => {
        return entri - sumInvalid - (belumDikirim - sumInvalid);
    }, [entri, belumDikirim, sumInvalid]);

    // Persentase final
    const percent = useMemo(() => {
        if (!totalValid || totalValid === 0) return 0;
        return ((dikirim / totalValid) * 100).toFixed(2);
    }, [dikirim, totalValid]);

    return (
        <div className="space-y-4 rounded-xl border bg-white p-5">
            <h2 className="text-lg font-bold">Kalkulator Persentase Naskah</h2>

            {/* INPUT FORM */}
            <div className="grid grid-cols-1 gap-3">
                {[
                    { name: 'entri', label: 'JUMLAH "ENTRI" NASKAH DINAS PADA MENU "TANDATANGAN NASKAH"	' },
                    { name: 'belumDikirim', label: 'JUMLAH NASKAH DINAS "BELUM DIKIRIM" PADA DASHBOARD BAGIAN "TANDATANGAN NASKAH"	' },
                    { name: 'ditolak', label: 'JUMLAH NASKAH DINAS "DITOLAK" PADA DASHBOARD BAGIAN "TANDATANGAN NASKAH"	' },
                    { name: 'diperbaiki', label: 'JUMLAH NASKAH DINAS "DIPERBAIKI" PADA DASHBOARD BAGIAN "TANDATANGAN NASKAH"	' },
                    { name: 'belumDitandatangani', label: 'JUMLAH NASKAH DINAS "BELUM DITANDATANGANI" PADA DASHBOARD BAGIAN "TANDATANGAN NASKAH"	' },
                ].map((item) => (
                    <div key={item.name} className="flex flex-col">
                        <label className="text-sm font-medium">{item.label}</label>
                        <input
                            type="number"
                            name={item.name}
                            value={form[item.name as keyof typeof form]}
                            onChange={handleChange}
                            className="rounded border px-3 py-2"
                        />
                    </div>
                ))}
            </div>

            <hr />

            {/* OUTPUT */}
            <div className="space-y-2">
                <div>
                    JUMLAH NASKAH TELAH DITANDATANGANI DAN DIKIRIM : <b>{dikirim}</b>
                </div>
                <div className="pt-3 text-xl font-semibold">
                    Persentase: <span>{percent}%</span>
                </div>
            </div>
        </div>
    );
}

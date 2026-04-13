import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Percent, Hash, AlertCircle, Info, ChevronRight, CalculatorIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export enum AuditCalculator {
    SIGNED_AND_SENT = 'SIGNED_AND_SENT', // Kalkulator naskah telah ditandatangani dan dikirim
    FOLLOWED_UP = 'FOLLOWED_UP', // Kalkulator naskah telah ditindaklanjuti
    ARCHIVE_FILING = 'ARCHIVE_FILING', // rata-rata persentase pemberkasan
    ACCESS_AVAILABILITY = 'ACCESS_AVAILABILITY', // Unit Kearsipan menjamin ketersediaan akses arsip
    INACTIVE_LIST_COMPLIANCE = 'INACTIVE_LIST_COMPLIANCE', // Persentase daftar arsip inaktif yang disusun sesuai ketentuan
    TRANSFER_TO_ARCHIVE_UNIT = 'TRANSFER_TO_ARCHIVE_UNIT', // Unit pengolah sudah memindahkan arsip inaktif < 10 tahun
}

const CalculatorWrapper = ({ title, children, icon: Icon = CalculatorIcon, description }: { title: string, children: React.ReactNode, icon?: any, description?: string }) => (
    <Card className="border-2 border-primary/30 shadow-[0_20px_40px_-15px_rgba(var(--primary),.3)] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader className="pb-4 pt-6 bg-primary/5 border-b border-primary/10">
            <div className="flex items-center gap-3 text-primary">
                <div className="p-2.5 bg-primary/20 rounded-xl">
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-primary leading-none mb-1">{title}</CardTitle>
                    {description && <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{description}</p>}
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            {children}
        </CardContent>
    </Card>
);

const ResultCard = ({ label, value, subValue, type = 'percentage' }: { label: string, value: string | number, subValue?: string | number, type?: 'percentage' | 'number' }) => (
    <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-primary/30 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative flex flex-col items-center justify-center p-6 bg-background border-2 border-primary/10 rounded-3xl overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 -rotate-12 translate-x-2 -translate-y-2">
                {type === 'percentage' ? <Percent className="w-16 h-16" /> : <Hash className="w-16 h-16" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 text-center">{label}</span>
            <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary tracking-tighter">
                    {value}
                </span>
                {type === 'percentage' && <span className="text-xl font-black text-primary/60">%</span>}
            </div>
            {subValue !== undefined && (
                <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                    <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Total: {subValue}</span>
                </div>
            )}
        </div>
    </div>
);

const CalcInput = ({ label, name, value, onChange, placeholder }: { label: string, name: string, value: number, onChange: (e: any) => void, placeholder?: string }) => (
    <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{label}</Label>
        <div className="relative group">
            <Input
                type="number"
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder || "0"}
                className="pl-4 pr-4 py-6 rounded-2xl border-2 border-muted hover:border-primary/40 focus:border-primary transition-all font-bold text-lg shadow-sm"
            />
        </div>
    </div>
);

export const PercentageCalculator = ({ numeratorLabel = 'Pembilang', denominatorLabel = 'Penyebut' }) => {
    const [numerator, setNumerator] = useState(0);
    const [denominator, setDenominator] = useState(0);

    const percentage = useMemo(() => {
        if (denominator <= 0) return '0.00';
        return ((numerator / denominator) * 100).toFixed(2);
    }, [numerator, denominator]);

    return (
        <CalculatorWrapper title="Kalkulator Persentase" icon={Percent}>
            <div className="grid gap-6">
                <CalcInput 
                    label={numeratorLabel} 
                    name="numerator" 
                    value={numerator} 
                    onChange={(e) => setNumerator(parseFloat(e.target.value) || 0)} 
                />
                <CalcInput 
                    label={denominatorLabel} 
                    name="denominator" 
                    value={denominator} 
                    onChange={(e) => setDenominator(parseFloat(e.target.value) || 0)} 
                />
                <Separator className="bg-primary/10" />
                <ResultCard label="Hasil Persentase" value={percentage} subValue={denominator > 0 ? `${numerator} / ${denominator}` : undefined} />
            </div>
        </CalculatorWrapper>
    );
};

export const SignedSentCalculator = () => {
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

    const sumInvalid = ditolak + diperbaiki + belumDitandatangani;
    const totalValid = entri - sumInvalid;
    const dikirim = useMemo(() => {
        const base = entri - sumInvalid;
        const sub = belumDikirim - sumInvalid;
        return base - sub;
    }, [entri, belumDikirim, sumInvalid]);

    const percent = useMemo(() => {
        if (totalValid <= 0) return '0.00';
        return ((dikirim / totalValid) * 100).toFixed(2);
    }, [dikirim, totalValid]);

    return (
        <CalculatorWrapper title="Kalkulator Naskah TTD & Kirim" icon={Calculator}>
            <div className="grid gap-4">
                <CalcInput label="ENTRI NASKAH DINAS (TTD NASKAH)" name="entri" value={entri} onChange={handleChange} />
                <CalcInput label="NASKAH BELUM DIKIRIM" name="belumDikirim" value={belumDikirim} onChange={handleChange} />
                <div className="grid grid-cols-3 gap-3">
                    <CalcInput label="DITOLAK" name="ditolak" value={ditolak} onChange={handleChange} />
                    <CalcInput label="DIPERBAIKI" name="diperbaiki" value={diperbaiki} onChange={handleChange} />
                    <CalcInput label="BELUM TTD" name="belumDitandatangani" value={belumDitandatangani} onChange={handleChange} />
                </div>
                <Separator className="bg-primary/10" />
                <div className="grid grid-cols-1 gap-4">
                    <ResultCard label="Persentase Naskah" value={percent} subValue={`${dikirim} dari ${totalValid}`} />
                </div>
            </div>
        </CalculatorWrapper>
    );
};

export const FollupCalculator = () => {
    const [form, setForm] = useState({
        entri: 0,
        belumDitindaklanjuti: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: Number(e.target.value || 0),
        });
    };

    const { entri, belumDitindaklanjuti } = form;
    const telahDitindaklanjuti = useMemo(() => Math.max(0, entri - belumDitindaklanjuti), [entri, belumDitindaklanjuti]);

    const percent = useMemo(() => {
        if (entri <= 0) return '0.00';
        return ((telahDitindaklanjuti / entri) * 100).toFixed(2);
    }, [telahDitindaklanjuti, entri]);

    return (
        <CalculatorWrapper title="Kalkulator Tindak Lanjut" icon={Hash}>
            <div className="grid gap-6">
                <CalcInput label="JUMLAH ENTRI NASKAH DINAS" name="entri" value={entri} onChange={handleChange} />
                <CalcInput label="JUMLAH BELUM DITINDAKLANJUTI" name="belumDitindaklanjuti" value={belumDitindaklanjuti} onChange={handleChange} />
                <Separator className="bg-primary/10" />
                <ResultCard label="Hasil Persentase" value={percent} subValue={`${telahDitindaklanjuti} / ${entri}`} />
            </div>
        </CalculatorWrapper>
    );
};

export const ArchiveFilingCalculator = () => {
    const [form, setForm] = useState({
        naskahKeluar: 0,
        naskahMasuk: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: Number(e.target.value || 0),
        });
    };

    const { naskahKeluar, naskahMasuk } = form;

    const rataRata = useMemo(() => {
        return ((naskahKeluar + naskahMasuk) / 2).toFixed(2);
    }, [naskahKeluar, naskahMasuk]);

    return (
        <CalculatorWrapper title="Rata-rata Pemberkasan" icon={Percent}>
            <div className="grid gap-6">
                <CalcInput label="PERSENTASE NASKAH KELUAR (%)" name="naskahKeluar" value={naskahKeluar} onChange={handleChange} />
                <CalcInput label="PERSENTASE NASKAH MASUK (%)" name="naskahMasuk" value={naskahMasuk} onChange={handleChange} />
                <Separator className="bg-primary/10" />
                <ResultCard label="Rata-rata Persentase" value={rataRata} />
            </div>
        </CalculatorWrapper>
    );
};

export const renderHelperCalculator = (calculator: string | null | undefined) => {
    if (!calculator) return null;

    switch (calculator) {
        case AuditCalculator.SIGNED_AND_SENT:
            return <SignedSentCalculator />;
        case AuditCalculator.FOLLOWED_UP:
            return <FollupCalculator />;
        case AuditCalculator.ARCHIVE_FILING:
            return <ArchiveFilingCalculator />;
        case AuditCalculator.ACCESS_AVAILABILITY:
            return (
                <PercentageCalculator
                    numeratorLabel="JUMLAH PEMINDAHAN ARSIP INAKTIF YANG DIBUKTIKAN DENGAN BERITA ACARA PEMINDAHAN"
                    denominatorLabel="JUMLAH DAFTAR ARSIP INAKTIF YANG TELAH DISUSUN BERDASARKAN BERITA ACARA PEMINDAHAN"
                />
            );
        case AuditCalculator.INACTIVE_LIST_COMPLIANCE:
            return (
                <PercentageCalculator
                    numeratorLabel="JUMLAH DAFTAR ARSIP INAKTIF YANG DISUSUN HASIL PEMINDAHAN DALAM DUA TAHUN TERAKHIR"
                    denominatorLabel="JUMLAH DAFTAR ARSIP INAKTIF YANG TELAH SESUAI KETENTUAN"
                />
            );
        case AuditCalculator.TRANSFER_TO_ARCHIVE_UNIT:
            return (
                <PercentageCalculator
                    numeratorLabel="JUMLAH UNIT PENGOLAH YANG TERDAPAT PADA PERANGKAT DAERAH"
                    denominatorLabel="JUMLAH UNIT PENGOLAH YANG TELAH MEMINDAAHKAN ARSIP INAKTIFNYA KE UNIT KEARSIPAN"
                />
            );
        default:
            return null;
    }
};

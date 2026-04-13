import { Head, Link } from '@inertiajs/react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, FileText, Percent, Filter, CheckCircle2, Circle, Send, AlertCircle, CheckCircle, Calculator } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import HelpFloatingButton, { TutorialItem } from '@/components/help-floating-button';

export default function QuestionList({ aspects }: any) {
    const [statusFilter, setStatusFilter] = useState('all');

    const filterOptions = [
        { id: 'all', label: 'Semua', icon: Filter, activeBg: 'bg-primary', activeText: 'text-primary-foreground' },
        { id: 'answered', label: 'Terjawab', icon: CheckCircle2, activeBg: 'bg-primary', activeText: 'text-primary-foreground' },
        { id: 'unanswered', label: 'Belum Dijawab', icon: Circle, activeBg: 'bg-secondary', activeText: 'text-secondary-foreground' },
        { id: 'submitted', label: 'Diajukan', icon: Send, activeBg: 'bg-amber-500', activeText: 'text-white' },
        { id: 'revision', label: 'Perlu Revisi', icon: AlertCircle, activeBg: 'bg-destructive', activeText: 'text-white' },
        { id: 'completed', label: 'Selesai', icon: CheckCircle, activeBg: 'bg-green-600', activeText: 'text-white' },
    ];

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const filter = params.get('filter');
        if (filter) {
            setStatusFilter(filter);
        }
    }, []);

    const { filteredAspects, totalFilteredQs } = useMemo(() => {
        let count = 0;
        const result = aspects.map((aspect: any) => {
            const aspectVisibleSubs = aspect.sub_aspects.map((sub: any) => {
                const visibleQs = sub.questions.filter((q: any) => {
                    const answer = q.answers && q.answers[0];
                    const isAnswered = !!answer;
                    const status = answer?.status || 'none';

                    if (statusFilter === 'all') return true;
                    if (statusFilter === 'answered') return isAnswered;
                    if (statusFilter === 'unanswered') return !isAnswered;
                    return status === statusFilter;
                });
                count += visibleQs.length;
                return { ...sub, visibleQs };
            }).filter((sub: any) => sub.visibleQs.length > 0);
            return { ...aspect, aspectVisibleSubs };
        }).filter((aspect: any) => aspect.aspectVisibleSubs.length > 0);

        return { filteredAspects: result, totalFilteredQs: count };
    }, [aspects, statusFilter]);

    return (
        <>
            <Head title="Daftar Kuisioner" />

            <HelpFloatingButton
                tutorials={[
                    {
                        id: 1,
                        title: 'Cara Mengisi Item ASKI / Kuisioner',
                        description: 'Panduan lengkap bagaimana cara mengisi dan melampirkan bukti pada kuesioner pengawasan.',
                        videoUrl: '/videos/cara-mengisi.mp4' // Ganti dengan URL video yang diupload ke public/videos/
                    },
                    {
                        id: 2,
                        title: 'Cara Memperbaiki Item ASKI / Kuisioner yang Butuh Revisi',
                        description: 'Panduan lengkap bagaimana cara memperbaiki item ASKI / Kuisioner yang butuh revisi.',
                        videoUrl: '/videos/cara-revisi.mp4'
                    }
                ]}
            />

            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b pb-6">
                    <div className="space-y-1">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground/90 leading-none">Pelaksanaan Audit</h1>
                        <p className="text-sm text-muted-foreground w-full max-w-xl leading-relaxed">Monitor pengawasan internal kearsipan Anda. Bobot nilai per aspek telah ditentukan sesuai regulasi.</p>
                    </div>
                    <div className="w-full md:w-auto overflow-x-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none] -mx-4 px-4 md:mx-0 md:px-0">
                        <div className="flex items-center gap-1.5 p-1.5 bg-muted/30 rounded-2xl border border-muted/50 w-fit min-w-max">
                            {filterOptions.map((opt) => (
                                <Button
                                    key={opt.id}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setStatusFilter(opt.id)}
                                    className={`
                                        h-8 text-xs font-bold rounded-xl transition-all duration-200 gap-1.5 px-3.5 whitespace-nowrap
                                        ${statusFilter === opt.id
                                            ? `${opt.activeBg} ${opt.activeText} shadow-sm`
                                            : 'text-muted-foreground hover:bg-muted/50'
                                        }
                                    `}
                                >
                                    <opt.icon className={`size-3.5 ${statusFilter === opt.id ? 'opacity-100' : 'opacity-60'}`} />
                                    {opt.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>

                {totalFilteredQs === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center bg-muted/20 rounded-3xl border border-dashed mt-4">
                        <div className="p-4 bg-background border border-dashed rounded-full mb-3 shadow-sm">
                            <Filter className="w-8 h-8 text-muted-foreground/40" />
                        </div>
                        <p className="font-bold text-muted-foreground text-sm uppercase tracking-widest opacity-80">Tidak Ditemukan Soal</p>
                        <p className="text-sm font-semibold text-muted-foreground/60 mt-1">Tidak ada kuesioner dengan status yang dipilih.</p>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in duration-300">
                        {filteredAspects.map((aspect: any) => (
                            <div key={aspect.id} className="space-y-6 group">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-primary pl-4 py-1 transition-all group-hover:border-l-8">
                                    <div className="space-y-1">
                                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground/90 uppercase">{aspect.name}</h2>
                                        {/* {aspect.description && <p className="text-sm text-muted-foreground max-w-2xl">{aspect.description}</p>} */}
                                    </div>
                                    <div className="shrink-0 flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 w-fit">
                                        <Percent className="size-3.5 text-primary" />
                                        <span className="text-sm font-bold text-primary uppercase tracking-widest">Bobot: {aspect.score_weight}%</span>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    {aspect.aspectVisibleSubs.map((sub: any) => (
                                        <div key={sub.id} className="ml-0 sm:ml-6 space-y-4">
                                            <div className="flex flex-wrap items-center gap-3 border-b border-muted pb-2">
                                                <Badge variant="outline" className="px-2 py-0.5 font-bold bg-primary/5 text-primary border-primary/20 text-xs tracking-widest uppercase rounded shrink-0">
                                                    UNIT {sub.type === 'UP' ? 'PENGELOLA' : 'KEARSIPAN'}
                                                </Badge>
                                                <h3 className="font-bold text-sm sm:text-base text-foreground/80 tracking-tight">{sub.name}</h3>
                                                <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-md border border-amber-500/20 text-xs font-bold uppercase tracking-widest sm:ml-auto">
                                                    <Percent className="size-2.5" />
                                                    Bobot Sub: {sub.score_weight}%
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-2 sm:gap-3">
                                                {sub.visibleQs.map((q: any) => {
                                                    const answer = q.answers && q.answers[0];
                                                    const isAnswered = !!answer;
                                                    const status = answer?.status || 'none';

                                                    const statusMap: any = {
                                                        'submitted': { label: 'Diajukan', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', borderTop: 'border-t-amber-500/80' },
                                                        'revision': { label: 'Perlu Revisi', color: 'bg-destructive/10 text-destructive border-destructive/20', borderTop: 'border-t-destructive/80' },
                                                        'completed': { label: 'Selesai', color: 'bg-green-500/10 text-green-600 border-green-500/20', borderTop: 'border-t-green-500' },
                                                        'none': { label: 'Kosong', color: 'bg-muted/50 text-muted-foreground border-muted/50', borderTop: 'border-t-muted/30' }
                                                    };

                                                    return (
                                                        <Link
                                                            key={q.id}
                                                            href={`/questionnaire/${q.id}`}
                                                            className="group/card transition-all duration-200 outline-none block w-full"
                                                        >
                                                            <Card className={`h-full border shadow-sm cursor-pointer gap-2 overflow-hidden group-focus-visible/card:ring-1 ring-primary flex flex-col border-t-4 ${statusMap[status].borderTop} ${isAnswered ? 'bg-linear-to-br from-background to-primary/2' : 'bg-background'}`}>
                                                                <CardHeader className="p-3 pb-1.5 space-y-0 text-sm flex-none">
                                                                    <div className="flex justify-between items-center gap-2">
                                                                        <div className="flex items-center gap-1.5">
                                                                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border bg-muted/30 text-xs font-bold uppercase text-muted-foreground tracking-wider">
                                                                                <FileText className="w-2.5 h-2.5" />
                                                                                ID: {q.id}
                                                                            </div>
                                                                            {q.helper && (
                                                                                <div className="p-0.5 bg-primary/10 text-primary rounded border border-primary/20 animate-pulse-subtle" title="Tersedia Kalkulator Bantu">
                                                                                    <Calculator className="w-3 h-3" />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        <div className={`px-1.5 py-0.5 border rounded opacity-90 text-xs font-bold uppercase tracking-widest ${statusMap[status].color}`}>
                                                                            {statusMap[status].label}
                                                                        </div>
                                                                    </div>
                                                                </CardHeader>
                                                                <CardContent className="p-3 pt-0 flex flex-col flex-1">
                                                                    <p className="text-sm font-medium leading-snug text-foreground/80 group-hover/card:text-primary transition-colors line-clamp-3 mt-0.5 flex-1">
                                                                        {q.text}
                                                                    </p>
                                                                    <div className="mt-3 text-right opacity-0 group-hover/card:opacity-100 transition-opacity">
                                                                        <span className="text-xs font-bold uppercase tracking-widest text-primary flex items-center justify-end gap-0.5">
                                                                            Buka <ChevronRight className="size-2.5" />
                                                                        </span>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

QuestionList.layout = {
    breadcrumbs: [
        {
            title: 'Audit Internal',
            href: '/questionnaire',
        },
    ],
};

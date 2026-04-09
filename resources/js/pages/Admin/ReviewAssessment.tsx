import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, AlertCircle, Clock, Download, ExternalLink, FileText, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FilePreviewModal } from '@/components/file-preview-modal';
import { useState } from 'react';

export default function ReviewAssessment({ pelaksana, aspects }: any) {
    const statusMap: any = {
        'submitted': { label: 'Diajukan', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: Clock },
        'revision': { label: 'Butuh Perbaikan', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle },
        'completed': { label: 'Selesai', color: 'bg-primary/10 text-primary border-primary/20', icon: CheckCircle2 }
    };

    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: '', name: '' });

    const openPreview = (url: string, name: string) => {
        setPreviewModal({ isOpen: true, url, name });
    };

    const handleStatusChange = (answerId: number, newStatus: string) => {
        router.put(`/admin/answers/${answerId}/status`, { status: newStatus }, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Review: ${pelaksana.organization?.name}`} />
            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex items-center justify-between border-b pb-6">
                    <div className="space-y-1">
                        <Link href="/dashboard" className="text-xs font-bold text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors uppercase tracking-widest">
                            <ChevronLeft className="w-3 h-3" /> Kembali ke Dashboard
                        </Link>
                        <h1 className="text-3xl font-black tracking-tight">{pelaksana.organization?.name}</h1>
                        <p className="text-muted-foreground text-sm flex items-center gap-2 font-medium">
                            <span className="opacity-60">PIC:</span> {pelaksana.name} 
                            <span className="mx-1">•</span> 
                            <span className="opacity-60">Email:</span> {pelaksana.email}
                        </p>
                    </div>
                </div>

                <div className="space-y-12 mt-4">
                    {aspects.map((aspect: any) => (
                        <div key={aspect.id} className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                                <h2 className="text-2xl font-black tracking-tight uppercase">{aspect.name}</h2>
                            </div>

                            {aspect.sub_aspects.map((sub: any) => (
                                <div key={sub.id} className="ml-4 space-y-6">
                                    <div className="flex items-center gap-3 border-b border-muted pb-2">
                                        <Badge variant="outline" className="px-2 py-0 font-bold bg-primary/5 text-primary border-primary/20 text-[10px]">
                                            {sub.type}
                                        </Badge>
                                        <h3 className="font-bold text-lg text-muted-foreground">{sub.name}</h3>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {sub.questions.map((q: any, idx: number) => {
                                            const answer = q.answers && q.answers[0];
                                            const StatusIcon = answer ? statusMap[answer.status]?.icon : Clock;

                                            return (
                                                <Card key={q.id} className={`border-none shadow-sm ring-1 ring-inset ${answer ? 'ring-primary/10 bg-card' : 'ring-muted bg-muted/20 opacity-60'}`}>
                                                    <CardHeader className="p-6 pb-2">
                                                        <div className="flex justify-between items-start gap-4">
                                                            <div className="space-y-1 flex-1">
                                                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest block mb-2">PERTANYAAN #{idx + 1}</span>
                                                                <CardTitle className="text-lg font-bold leading-snug">{q.text}</CardTitle>
                                                            </div>
                                                            
                                                            {answer && (
                                                                <div className="flex flex-col items-end gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                         <Select 
                                                                            defaultValue={answer.status} 
                                                                            onValueChange={(val) => handleStatusChange(answer.id, val)}
                                                                        >
                                                                            <SelectTrigger className={`w-[180px] h-9 text-xs font-bold rounded-xl border-none ring-1 ring-inset ${statusMap[answer.status]?.color}`}>
                                                                                <SelectValue />
                                                                            </SelectTrigger>
                                                                            <SelectContent className="rounded-xl border-none shadow-xl">
                                                                                <SelectItem value="submitted" className="text-xs font-bold focus:bg-amber-500/10 focus:text-amber-600">DIAJUKAN (REVIEW)</SelectItem>
                                                                                <SelectItem value="revision" className="text-xs font-bold focus:bg-destructive/10 focus:text-destructive">BUTUH PERBAIKAN</SelectItem>
                                                                                <SelectItem value="completed" className="text-xs font-bold focus:bg-primary/10 focus:text-primary">SELESAI / FINAL</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </div>
                                                                    <div className="text-[10px] font-black text-primary bg-primary/10 px-2 py-1 rounded-lg">
                                                                        SKOR: {answer.option?.score || 0}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="p-6 pt-2">
                                                        {answer ? (
                                                            <div className="space-y-6 mt-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/5">
                                                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block mb-2">JAWABAN TERPILIH:</span>
                                                                        <p className="text-sm font-bold text-foreground/80">{answer.option?.text || '-'}</p>
                                                                    </div>
                                                                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                                                                        <span className="text-[9px] font-black uppercase tracking-widest text-amber-600 block mb-2">DASAR HUKUM:</span>
                                                                        <p className="text-xs font-medium text-muted-foreground italic leading-relaxed">
                                                                            {q.legal_basis || 'Tidak ada dasar hukum khusus.'}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-1">
                                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block pl-1">PETUNJUK:</span>
                                                                    <p className="text-xs font-medium text-muted-foreground/70 pl-1">{q.instructions || '-'}</p>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground block">BUKTI DUKUNG ({answer.evidence_submissions?.length || 0}):</span>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                        {answer.evidence_submissions?.map((ev: any) => (
                                                                            <div 
                                                                                key={ev.id} 
                                                                                className="flex items-center justify-between gap-3 p-3 bg-background border rounded-xl hover:border-primary/40 transition-all group shadow-sm cursor-pointer"
                                                                                onClick={() => openPreview(`/storage/${ev.file_path}`, ev.original_name)}
                                                                            >
                                                                                <div className="flex items-center gap-2 truncate">
                                                                                    <FileText className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                                                                                    <span className="text-[10px] font-bold text-muted-foreground truncate group-hover:text-primary transition-colors">
                                                                                        {ev.original_name}
                                                                                    </span>
                                                                                </div>
                                                                                <div className="flex items-center gap-1.5">
                                                                                     <Eye className="w-3.5 h-3.5 text-muted-foreground opacity-30 group-hover:opacity-100" />
                                                                                     <a 
                                                                                        href={`/storage/${ev.file_path}`} 
                                                                                        download 
                                                                                        onClick={e => e.stopPropagation()}
                                                                                        className="p-1 hover:bg-muted rounded text-muted-foreground"
                                                                                     >
                                                                                        <Download className="w-3.5 h-3.5 opacity-20 group-hover:opacity-60" />
                                                                                     </a>
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="py-4 text-center italic text-xs font-medium text-muted-foreground/60">
                                                                Pengguna belum mengisi jawaban untuk soal ini.
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <FilePreviewModal 
                isOpen={previewModal.isOpen} 
                onClose={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))} 
                fileUrl={previewModal.url}
                fileName={previewModal.name}
            />
        </>
    );
}

ReviewAssessment.layout = {
    breadcrumbs: [
        {
            title: 'Review Pengawasan',
            href: '#',
        },
    ],
};

import { Head, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle2, AlertCircle, Clock, Download, FileText, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FilePreviewModal } from '@/components/file-preview-modal';
import { useState, useMemo, useEffect } from 'react';

function AnswerNotes({ answer }: { answer: any }) {
    const [notes, setNotes] = useState(answer.notes || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        router.put(`/admin/answers/${answer.id}/status`, { notes }, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsSaving(false)
        });
    };

    return (
        <div className="space-y-3 mt-8 pt-6 border-t-2 border-dashed border-muted/50">
            <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-widest text-primary block">CATATAN & EVALUASI ADMIN</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-start">
                <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="flex-1 w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary min-h-[100px] resize-y transition-all"
                    placeholder="Tambahkan catatan, evaluasi, atau feedback untuk jawaban pengguna ini..."
                />
                <Button 
                    onClick={handleSave} 
                    disabled={isSaving || notes === (answer.notes || '')}
                    className="h-12 px-6 text-sm font-bold rounded-xl shrink-0 w-full sm:w-auto"
                >
                    {isSaving ? 'Menyimpan...' : 'Simpan Note'}
                </Button>
            </div>
        </div>
    );
}

export default function ReviewAssessment({ pelaksana, aspects }: any) {
    const statusMap: any = {
        'submitted': { label: 'Diajukan', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', icon: Clock },
        'revision': { label: 'Butuh Perbaikan', color: 'bg-destructive/10 text-destructive border-destructive/20', icon: AlertCircle },
        'completed': { label: 'Selesai', color: 'bg-primary/10 text-primary border-primary/20', icon: CheckCircle2 }
    };

    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: '', name: '' });
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportForm, setReportForm] = useState({
        up_name: 'Bidang ',
        opd_name: pelaksana.organization?.name || '',
        ttd2_jabatan: `KEPALA ${pelaksana.organization?.name?.toUpperCase() || 'INSTANSI'}`,
        ttd2_nama: '',
        ttd2_pangkat: '',
        ttd2_nip: '',
    });

    const allQuestions = useMemo(() => {
        return aspects.flatMap((aspect: any) =>
            aspect.sub_aspects.flatMap((sub: any) =>
                sub.questions.map((q: any) => ({
                    ...q,
                    aspect_name: aspect.name,
                    sub_aspect_name: sub.name,
                    sub_type: sub.type,
                    answer: q.answers && q.answers.length > 0 ? q.answers[0] : null
                }))
            )
        );
    }, [aspects]);

    const filteredQuestions = useMemo(() => {
        return allQuestions.filter((q: any) => {
            if (statusFilter === 'all') return true;
            if (statusFilter === 'unanswered') return !q.answer;
            return q.answer?.status === statusFilter;
        });
    }, [allQuestions, statusFilter]);

    const selectedQuestion = useMemo(() => {
        return selectedQuestionId ? allQuestions.find((q: any) => q.id === selectedQuestionId) : null;
    }, [selectedQuestionId, allQuestions]);

    const openPreview = (url: string, name: string) => {
        setPreviewModal({ isOpen: true, url, name });
    };

    const handleStatusChange = (answerId: number, newStatus: string) => {
        router.put(`/admin/answers/${answerId}/status`, { status: newStatus }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);

    useEffect(() => {
        setSelectedAnswers([]);
    }, [statusFilter]);

    const handleBulkStatus = (newStatus: string) => {
        router.post('/admin/answers/bulk-status', { answer_ids: selectedAnswers, status: newStatus }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setSelectedAnswers([])
        });
    };

    return (
        <>
            <Head title={`Review: ${pelaksana.organization?.name}`} />
            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-5 border-b pb-6">
                    <div className="space-y-3 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            <div>
                                <Link href="/dashboard" className="text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-1 mb-2 transition-colors uppercase tracking-widest w-fit">
                                    <ChevronLeft className="w-3 h-3" /> Kembali ke Dashboard
                                </Link>
                                <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{pelaksana.organization?.name}</h1>
                                <div className="text-muted-foreground text-sm flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 font-medium mt-2">
                                    <span className="flex items-center gap-1"><span className="opacity-60">PIC:</span> {pelaksana.name}</span>
                                    <span className="hidden sm:inline opacity-30">•</span> 
                                    <span className="flex items-center gap-1"><span className="opacity-60">Email:</span> {pelaksana.email}</span>
                                </div>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => setReportModalOpen(true)}
                                className="border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 shadow-sm w-full sm:w-auto mt-1 lg:mt-6 shrink-0"
                            >
                                <Download className="w-4 h-4 mr-2" /> Cetak Laporan PDF
                            </Button>
                        </div>
                    </div>
                    {!selectedQuestion && (
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-muted/10 p-3 sm:p-4 rounded-2xl border">
                            <div className="flex flex-wrap items-center gap-2">
                                 <Button variant={statusFilter === 'all' ? 'default' : 'outline'} onClick={() => setStatusFilter('all')} size="sm" className="rounded-full px-4 sm:px-5 text-sm font-bold h-9">Semua</Button>
                                 <Button variant={statusFilter === 'submitted' ? 'default' : 'outline'} onClick={() => setStatusFilter('submitted')} size="sm" className="rounded-full px-4 sm:px-5 text-sm font-bold h-9 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 hover:text-amber-700 border-none shadow-none">Diajukan</Button>
                                 <Button variant={statusFilter === 'revision' ? 'default' : 'outline'} onClick={() => setStatusFilter('revision')} size="sm" className="rounded-full px-4 sm:px-5 text-sm font-bold h-9 bg-destructive/10 text-destructive hover:bg-destructive/20 border-none shadow-none">Diperbaiki</Button>
                                 <Button variant={statusFilter === 'completed' ? 'default' : 'outline'} onClick={() => setStatusFilter('completed')} size="sm" className="rounded-full px-4 sm:px-5 text-sm font-bold h-9 bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none">Selesai</Button>
                                 <Button variant={statusFilter === 'unanswered' ? 'default' : 'outline'} onClick={() => setStatusFilter('unanswered')} size="sm" className="rounded-full px-4 sm:px-5 text-sm font-bold h-9">Belum Dijawab</Button>
                            </div>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="rounded-full px-5 text-sm font-bold h-9 border-primary/40 text-primary bg-background shadow-sm hover:bg-primary/5 w-full xl:w-auto shrink-0"
                                onClick={() => {
                                    const answerableIds = filteredQuestions.filter((q: any) => q.answer).map((q: any) => q.answer.id);
                                    if (selectedAnswers.length === answerableIds.length && answerableIds.length > 0) {
                                        setSelectedAnswers([]);
                                    } else {
                                        setSelectedAnswers(answerableIds);
                                    }
                                }}
                            >
                                {selectedAnswers.length > 0 && selectedAnswers.length === filteredQuestions.filter((q: any) => q.answer).length ? `Batal Pilih (${selectedAnswers.length})` : 'Pilih Semua Dimuka'}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-2">
                    {!selectedQuestion ? (
                        <div className="space-y-12 animate-in fade-in duration-300">
                            {aspects.map((aspect: any) => {
                                const aspectVisibleSubs = aspect.sub_aspects.map((sub: any) => {
                                    const visibleQs = sub.questions.map((q: any) => ({
                                        ...q,
                                        aspect_name: aspect.name,
                                        sub_aspect_name: sub.name,
                                        sub_type: sub.type,
                                        answer: q.answers && q.answers.length > 0 ? q.answers[0] : null
                                    })).filter((q: any) => {
                                        if (statusFilter === 'all') return true;
                                        if (statusFilter === 'unanswered') return !q.answer;
                                        return q.answer?.status === statusFilter;
                                    });
                                    return { ...sub, visibleQs };
                                }).filter((sub: any) => sub.visibleQs.length > 0);

                                if (aspectVisibleSubs.length === 0) return null;

                                return (
                                    <div key={aspect.id} className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)]" />
                                            <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase">{aspect.name}</h2>
                                        </div>

                                        {aspectVisibleSubs.map((sub: any) => (
                                            <div key={sub.id} className="ml-4 space-y-5">
                                                <div className="flex items-center gap-3 border-b border-muted pb-2">
                                                    <Badge variant="outline" className="px-2 py-0 font-bold bg-primary/5 text-primary border-primary/20 text-xs">
                                                        {sub.type}
                                                    </Badge>
                                                    <h3 className="font-bold text-lg text-muted-foreground">{sub.name}</h3>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                                    {sub.visibleQs.map((q: any) => {
                                                        const answer = q.answer;
                                                        const statusConfig = answer ? statusMap[answer.status] : { label: 'Belum Dijawab', color: 'bg-muted/50 text-muted-foreground border-transparent' };
                                                        
                                                        return (
                                                            <Card key={q.id} className={`cursor-pointer transition-all duration-200 flex flex-col h-full shadow-sm relative overflow-hidden ${answer && selectedAnswers.includes(answer.id) ? 'ring-2 ring-primary border-primary/50 bg-primary/5' : 'hover:ring-2 hover:ring-primary/40 border-muted/60 hover:shadow-md'}`} onClick={() => setSelectedQuestionId(q.id)}>
                                                                {answer && (
                                                                    <div className="absolute top-4 right-4 z-10" onClick={e => e.stopPropagation()}>
                                                                        <input 
                                                                            type="checkbox" 
                                                                            checked={selectedAnswers.includes(answer.id)}
                                                                            onChange={(e) => {
                                                                                if (e.target.checked) setSelectedAnswers([...selectedAnswers, answer.id]);
                                                                                else setSelectedAnswers(selectedAnswers.filter(id => id !== answer.id));
                                                                            }}
                                                                            className="w-5 h-5 cursor-pointer accent-primary hover:scale-110 transition-transform"
                                                                        />
                                                                    </div>
                                                                )}
                                                                <CardHeader className="p-4 pb-0 space-y-3 border-none flex-none pr-12">
                                                                    <div className="flex flex-col items-start gap-2">
                                                                        <Badge variant="outline" className={`text-xs uppercase font-bold px-2.5 py-0.5 rounded-md ${statusConfig?.color}`}>
                                                                            {statusConfig?.label}
                                                                        </Badge>
                                                                        {answer && <div className="text-xs font-black text-primary bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20 shadow-xs">SKOR: {answer.option?.score || 0}</div>}
                                                                    </div>
                                                                </CardHeader>
                                                                <CardContent className="p-4 pt-4 flex-1 flex flex-col gap-3">
                                                                    <p className="text-sm font-bold line-clamp-4 flex-1 text-foreground/90 leading-relaxed">{q.text}</p>
                                                                    
                                                                    {answer ? (
                                                                        <div className={`mt-2 flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs font-black tracking-widest ${answer.evidence_submissions && answer.evidence_submissions.length > 0 ? 'bg-primary/5 text-primary border-primary/20' : 'bg-destructive/5 text-destructive border-destructive/20'}`}>
                                                                            <div className="flex items-center gap-2">
                                                                                <FileText className="w-4 h-4 shrink-0" />
                                                                                <span className="truncate">
                                                                                    {answer.evidence_submissions && answer.evidence_submissions.length > 0 ? 'Bukti Dukung Terlampir' : 'Bukti Dukung Kosong'}
                                                                                </span>
                                                                            </div>
                                                                            {answer.evidence_submissions && answer.evidence_submissions.length > 0 && (
                                                                                <Badge className="bg-primary text-white hover:bg-primary shadow-none px-1.5 py-0 h-5 font-black">{answer.evidence_submissions.length}</Badge>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="mt-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/50 px-3 py-2.5 bg-muted/20 rounded-xl border border-dashed text-center">
                                                                            Belum Terjawab
                                                                        </div>
                                                                    )}
                                                                </CardContent>
                                                            </Card>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                            
                            {filteredQuestions.length === 0 && (
                                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-muted/20 rounded-3xl border border-dashed gap-3 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center">
                                        <AlertCircle className="w-5 h-5 text-muted-foreground/60" />
                                    </div>
                                    <p className="text-sm font-bold text-muted-foreground">Tidak ada soal dengan status tersebut.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <Button variant="ghost" onClick={() => setSelectedQuestionId(null)} className="mb-2 text-sm font-bold -ml-3 text-muted-foreground hover:text-foreground h-9 px-3">
                                <ChevronLeft className="w-4 h-4 mr-1" /> Kembali ke Grid Soal
                            </Button>

                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="px-3 py-1 font-black uppercase bg-primary/5 text-primary border-primary/20 text-xs tracking-widest">
                                    {selectedQuestion.sub_type}
                                </Badge>
                                <div className="text-sm font-bold text-muted-foreground">
                                    {selectedQuestion.aspect_name} <span className="mx-2 opacity-30">/</span> {selectedQuestion.sub_aspect_name}
                                </div>
                            </div>
                            
                            <Card className="border-none shadow-lg ring-1 ring-inset ring-primary/10 bg-card overflow-hidden rounded-3xl">
                                <CardHeader className="p-6 md:p-8 md:pb-6 bg-gradient-to-b from-muted/30 to-transparent border-b">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                        <div className="space-y-3 flex-1">
                                            <span className="text-xs font-black uppercase text-primary tracking-widest block bg-primary/10 w-fit px-2 py-1 rounded-md">DETAIL PERTANYAAN</span>
                                            <CardTitle className="text-xl md:text-2xl font-bold leading-snug">{selectedQuestion.text}</CardTitle>
                                        </div>
                                        
                                        {selectedQuestion.answer && (
                                            <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto shrink-0 bg-background/50 md:bg-transparent p-5 md:p-0 rounded-2xl md:rounded-none border md:border-none">
                                                <span className="text-xs font-black uppercase text-muted-foreground tracking-widest block md:hidden">STATUS REVIEW:</span>
                                                <div className="flex items-center gap-2 w-full md:w-auto">
                                                     <Select 
                                                        defaultValue={selectedQuestion.answer.status} 
                                                        onValueChange={(val) => handleStatusChange(selectedQuestion.answer.id, val)}
                                                    >
                                                        <SelectTrigger className={`w-full md:w-[220px] h-11 text-sm font-bold rounded-xl border-none ring-1 ring-inset shadow-sm ${statusMap[selectedQuestion.answer.status]?.color}`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl border-none shadow-xl">
                                                            <SelectItem value="submitted" className="text-sm font-bold focus:bg-amber-500/10 focus:text-amber-600 py-2.5">DIAJUKAN (REVIEW)</SelectItem>
                                                            <SelectItem value="revision" className="text-sm font-bold focus:bg-destructive/10 focus:text-destructive py-2.5">BUTUH PERBAIKAN</SelectItem>
                                                            <SelectItem value="completed" className="text-sm font-bold focus:bg-primary/10 focus:text-primary py-2.5">SELESAI / FINAL</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="text-sm font-black text-primary bg-primary/10 px-4 py-2 rounded-xl w-full md:w-auto text-center border border-primary/20 shadow-sm">
                                                    SKOR: {selectedQuestion.answer.option?.score || 0}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 md:p-8 space-y-8">
                                    {selectedQuestion.answer ? (
                                        <>
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                <div className="p-6 rounded-2xl bg-muted/40 border border-muted-foreground/10 space-y-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">JAWABAN TERPILIH</span>
                                                    </div>
                                                    <p className="text-base font-bold text-foreground leading-relaxed">{selectedQuestion.answer.option?.text || '-'}</p>
                                                </div>
                                                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 space-y-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-1.5 h-4 bg-amber-500 rounded-full"></div>
                                                        <span className="text-xs font-black uppercase tracking-widest text-amber-600">DASAR HUKUM</span>
                                                    </div>
                                                    <div 
                                                        className="text-sm font-medium text-muted-foreground/80 italic leading-relaxed ql-editor-mini"
                                                        dangerouslySetInnerHTML={{ __html: selectedQuestion.legal_basis || 'Tidak ada dasar hukum khusus.' }}
                                                    />
                                                </div>
                                            </div>

                                            {selectedQuestion.instructions && (
                                                <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6 space-y-4">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                                                        <span className="text-xs font-black uppercase tracking-widest text-blue-600">PETUNJUK STANDAR</span>
                                                    </div>
                                                    <div 
                                                        className="text-sm font-medium text-muted-foreground/80 ql-editor-mini leading-relaxed"
                                                        dangerouslySetInnerHTML={{ __html: selectedQuestion.instructions }}
                                                    />
                                                </div>
                                            )}

                                            <div className="space-y-4 pt-4">
                                                <div className="flex items-center gap-2 border-b pb-3">
                                                    <span className="text-xs font-black uppercase tracking-widest text-foreground block">BUKTI DUKUNG TERLAMPIR</span>
                                                    <Badge className="px-2 py-0 text-xs rounded-md font-black bg-foreground text-background">{selectedQuestion.answer.evidence_submissions?.length || 0}</Badge>
                                                </div>
                                                {selectedQuestion.answer.evidence_submissions?.length > 0 ? (
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                        {selectedQuestion.answer.evidence_submissions.map((ev: any) => (
                                                            <div 
                                                                key={ev.id} 
                                                                className="flex items-center justify-between gap-3 p-4 bg-background border rounded-2xl hover:border-primary/40 hover:shadow-md transition-all group shadow-sm cursor-pointer"
                                                                onClick={() => openPreview(`/storage/${ev.file_path}`, ev.original_name)}
                                                            >
                                                                <div className="flex items-center gap-3 truncate">
                                                                    <div className="bg-primary/5 p-2.5 rounded-xl group-hover:bg-primary/10 transition-colors shadow-sm">
                                                                        <FileText className="w-4 h-4 text-primary" />
                                                                    </div>
                                                                    <span className="text-sm font-bold text-foreground/80 truncate group-hover:text-primary transition-colors">
                                                                        {ev.original_name}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                     <Eye className="w-4 h-4 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity mx-2" />
                                                                     <a 
                                                                        href={`/storage/${ev.file_path}`} 
                                                                        download 
                                                                        onClick={e => e.stopPropagation()}
                                                                        className="p-2 hover:bg-muted/80 rounded-lg text-muted-foreground transition-colors group-hover:text-primary"
                                                                     >
                                                                        <Download className="w-4 h-4" />
                                                                     </a>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8 bg-muted/10 border border-dashed rounded-2xl text-sm font-medium text-muted-foreground/60 italic">
                                                        Tidak ada file bukti dukung yang dilampirkan.
                                                    </div>
                                                )}
                                            </div>

                                            <AnswerNotes answer={selectedQuestion.answer} />
                                        </>
                                    ) : (
                                        <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 bg-muted/10 rounded-3xl border border-dashed">
                                            <div className="w-16 h-16 rounded-full bg-background border border-muted-foreground/20 flex items-center justify-center mb-2 shadow-sm">
                                                <AlertCircle className="w-7 h-7 text-muted-foreground/40" />
                                            </div>
                                            <p className="text-base font-bold text-foreground/70">Asesmen Belum Terjawab</p>
                                            <p className="text-sm font-medium text-muted-foreground/60 max-w-[300px]">
                                                Pengguna masih belum mengisi jawaban maupun melampirkan file bukti dukung untuk instrumen ini.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .ql-editor-mini {
                    padding: 0;
                }
                .ql-editor-mini p {
                    margin-bottom: 0.75rem;
                }
                .ql-editor-mini p:last-child {
                    margin-bottom: 0;
                }
                .ql-editor-mini ul, .ql-editor-mini ol {
                    padding-left: 1.5rem;
                    list-style-position: outside;
                }
                .ql-editor-mini ul {
                    list-style-type: disc;
                }
                .ql-editor-mini ol {
                    list-style-type: decimal;
                }
            `}</style>
            
            {selectedAnswers.length > 0 && !selectedQuestion && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 p-4 bg-popover text-popover-foreground shadow-[0_10px_40px_rgba(var(--primary),0.2)] ring-1 ring-border rounded-2xl flex items-center justify-between gap-6 z-50 animate-in slide-in-from-bottom-5 duration-300 pointer-events-auto">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">{selectedAnswers.length}</div>
                        <span className="font-bold text-sm tracking-widest uppercase opacity-80 hidden sm:block">Pertanyaan<br/>Terpilih</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            size="sm" 
                            variant="outline" 
                            className="font-bold h-10 px-4"
                            onClick={() => setSelectedAnswers([])}
                        >BATAL</Button>
                        <Button 
                            size="sm" 
                            className="bg-destructive hover:bg-destructive/90 text-white font-bold h-10 px-4 whitespace-nowrap" 
                            onClick={() => handleBulkStatus('revision')}
                        >BUTUH PERBAIKAN</Button>
                        <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white font-bold h-10 px-6" 
                            onClick={() => handleBulkStatus('completed')}
                        >SELESAI</Button>
                    </div>
                </div>
            )}

            <FilePreviewModal 
                isOpen={previewModal.isOpen} 
                onClose={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))} 
                fileUrl={previewModal.url}
                fileName={previewModal.name}
            />

            {/* Modal Input Laporan PDF */}
            <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto w-[95vw] rounded-2xl mx-auto border-none p-0">
                    <DialogHeader className="p-6 pb-2 border-b bg-muted/30">
                        <DialogTitle className="text-xl font-black">Konfigurasi Laporan PDF</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 p-6">
                        <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border">
                            <h3 className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                Informasi Organisasi (Objek Pemeriksaan)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Nama Unit Pengolah (UP)</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" value={reportForm.up_name} onChange={e => setReportForm({...reportForm, up_name: e.target.value})} placeholder="Contoh: Bidang Kesehatan Masyarakat" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Nama Organisasi (UK/OPD)</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" value={reportForm.opd_name} onChange={e => setReportForm({...reportForm, opd_name: e.target.value})} placeholder="Contoh: Dinas Kesehatan" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border">
                            <h3 className="font-black text-xs uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                                Informasi Penandatangan Pihak Instansi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground">Jabatan</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm" value={reportForm.ttd2_jabatan} onChange={e => setReportForm({...reportForm, ttd2_jabatan: e.target.value})} />
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground">Nama Lengkap</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm" value={reportForm.ttd2_nama} onChange={e => setReportForm({...reportForm, ttd2_nama: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Pangkat/Golongan</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm" value={reportForm.ttd2_pangkat} onChange={e => setReportForm({...reportForm, ttd2_pangkat: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">NIP</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm tracking-wider" value={reportForm.ttd2_nip} onChange={e => setReportForm({...reportForm, ttd2_nip: e.target.value})} />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="p-6 bg-muted/40 border-t flex flex-col sm:flex-row justify-end gap-3 mt-auto">
                        <Button variant="outline" className="rounded-xl w-full sm:w-auto h-11 px-8 font-bold" onClick={() => setReportModalOpen(false)}>Batal</Button>
                        <Button variant="secondary" className="rounded-xl w-full sm:w-auto h-11 px-8 font-bold flex items-center shadow-sm" onClick={() => {
                            const params = new URLSearchParams(reportForm as any).toString();
                            window.open(`/admin/review/${pelaksana.id}/report.pdf?download=1&${params}`, '_blank');
                            setReportModalOpen(false);
                        }}>
                            <Download className="w-4 h-4 mr-2" />
                            Unduh PDF
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl w-full sm:w-auto h-11 px-8 font-bold shadow-md hover:shadow-lg transition-all" onClick={() => {
                            const params = new URLSearchParams(reportForm as any).toString();
                            setPreviewModal({ isOpen: true, url: `/admin/review/${pelaksana.id}/report.pdf?${params}`, name: `Laporan: ${pelaksana.organization?.name || pelaksana.name}` });
                            setReportModalOpen(false);
                        }}>Cetak dan Pratinjau</Button>
                    </div>
                </DialogContent>
            </Dialog>
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

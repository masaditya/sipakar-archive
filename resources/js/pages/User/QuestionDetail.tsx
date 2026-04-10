import { Head, useForm, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, FileUp, Info, CheckCircle2, Download, ExternalLink, FileText, Scale, Eye, Trash2, MessageSquare, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { FilePreviewModal } from '@/components/file-preview-modal';
import { Progress } from '@/components/ui/progress';

export default function QuestionDetail({ question, answer, prevId, nextId, currentIndex, totalCount }: any) {
    const { data, setData, post, processing, errors, progress } = useForm({
        question_id: question.id,
        option_id: answer?.option_id || '',
        next_id: nextId || '',
        files: [] as File[],
        _method: 'POST'
    });

    const [filesPreview, setFilesPreview] = useState<{ name: string, url: string }[]>([]);
    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: '', name: '' });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setData('files', filesArray);
            setFilesPreview(filesArray.map(f => ({
                name: f.name,
                url: URL.createObjectURL(f)
            })));
        }
    };

    const openPreview = (url: string, name: string) => {
        setPreviewModal({ isOpen: true, url, name });
    };

    const statusMap: any = {
        'submitted': { label: 'Diajukan', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
        'revision': { label: 'Butuh Perbaikan', color: 'bg-destructive/10 text-destructive border-destructive/20' },
        'completed': { label: 'Selesai', color: 'bg-primary/10 text-primary border-primary/20' }
    };

    const isCompleted = answer?.status === 'completed';

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isCompleted) return;
        post('/dashboard/submit-answer', {
            preserveScroll: true,
            onSuccess: () => {
                setFilesPreview([]);
                setData('files', []);
            }
        });
    };

    return (
        <>
            <Head title={`Soal #${question.id}`} />
            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="mb-2 flex justify-between items-center bg-card p-3 rounded-2xl border shadow-sm">
                    <Link href="/questionnaire" className="text-xs sm:text-sm font-bold text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors group pl-1 sm:pl-2">
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> <span className="hidden sm:inline">KEMBALI KE</span> DAFTAR
                    </Link>

                    <div className="flex items-center gap-1.5 sm:gap-2 pr-1">
                        {prevId ? (
                            <Button variant="outline" size="sm" asChild className="h-8 rounded-xl px-2 sm:px-3 bg-muted/30 hover:bg-muted">
                                <Link href={`/questionnaire/${prevId}`}>
                                    <ChevronLeft className="w-3.5 h-3.5 sm:mr-1" />
                                    <span className="hidden sm:inline">Sebelumnya</span>
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" disabled className="h-8 rounded-xl px-2 sm:px-3 bg-muted/10 opacity-50">
                                <ChevronLeft className="w-3.5 h-3.5 sm:mr-1" />
                                <span className="hidden sm:inline">Sebelumnya</span>
                            </Button>
                        )}

                        <div className="px-2 sm:px-3 py-1 bg-muted/30 rounded-lg border flex items-center justify-center">
                            <span className="text-[10px] sm:text-xs font-black tracking-widest text-muted-foreground">{currentIndex} / {totalCount}</span>
                        </div>

                        {nextId ? (
                            <Button variant="outline" size="sm" asChild className="h-8 rounded-xl px-2 sm:px-3 bg-muted/30 hover:bg-muted">
                                <Link href={`/questionnaire/${nextId}`}>
                                    <span className="hidden sm:inline">Selanjutnya</span>
                                    <ChevronRight className="w-3.5 h-3.5 sm:ml-1" />
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" disabled className="h-8 rounded-xl px-2 sm:px-3 bg-muted/10 opacity-50">
                                <span className="hidden sm:inline">Selanjutnya</span>
                                <ChevronRight className="w-3.5 h-3.5 sm:ml-1" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge variant="outline" className="px-2 py-0 font-extrabold bg-primary/10 text-primary border-primary/20 text-[9px] tracking-widest uppercase">
                                {question.sub_aspect.aspect.name}
                            </Badge>
                            <ChevronRight className="w-3 h-3 text-muted-foreground/30" />
                            <Badge variant="secondary" className="px-2 py-0 font-bold text-[9px] uppercase tracking-wider">
                                {question.sub_aspect.name}
                            </Badge>
                            {answer && (
                                <>
                                    <Badge variant="outline" className={`px-2 py-0 font-bold text-[9px] uppercase tracking-widest ${statusMap[answer.status]?.color}`}>
                                        {statusMap[answer.status]?.label}
                                    </Badge>
                                    <Badge className="px-2 py-0 font-black text-[10px] uppercase tracking-widest bg-primary text-primary-foreground border-transparent">
                                        Skor: {question.options.find((o: any) => o.id == answer.option_id)?.score || 0}
                                    </Badge>
                                </>
                            )}
                        </div>
                        <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground/90 max-w-4xl">
                            {question.text}
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-start">
                        {/* LEFT COLUMN: Question Content & Form */}
                        <div className="space-y-10 col-span-4">
                            <form onSubmit={submit} className="space-y-10">
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Pilih Opsi Jawaban</Label>
                                        <div className="h-0.5 w-8 bg-primary/40 rounded-full ml-1" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        {question.options.map((opt: any) => (
                                            <label
                                                key={opt.id}
                                                className={`flex items-start gap-4 p-5 rounded-3xl border-2 transition-all cursor-pointer group ${data.option_id == opt.id ? 'border-primary bg-primary/3 shadow-[0_4px_20px_rgb(var(--primary),0.05),inset_0_4px_10px_rgb(var(--primary),0.02)]' : 'border-muted hover:border-muted-foreground/20 hover:bg-muted/20'} ${isCompleted ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            >
                                                <div className="pt-1">
                                                    <input
                                                        type="radio"
                                                        name="option_id"
                                                        value={opt.id}
                                                        checked={data.option_id == opt.id}
                                                        disabled={isCompleted}
                                                        onChange={e => setData('option_id', e.target.value)}
                                                        className="w-5 h-5 accent-primary cursor-pointer border-2 disabled:cursor-not-allowed"
                                                        required
                                                    />
                                                </div>
                                                <div className="flex-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pr-4">
                                                    <span className={`text-base font-bold tracking-tight transition-colors ${data.option_id == opt.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}>
                                                        {opt.text}
                                                    </span>
                                                    <div className={`px-3 py-1.5 rounded-xl font-black text-xs min-w-[50px] text-center ${data.option_id == opt.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground group-hover:bg-muted-foreground/10'}`}>
                                                        {opt.score}
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6 border-t font-semibold">
                                    <div className="flex flex-col gap-1">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Upload Bukti Dokumen</Label>
                                        <div className="h-0.5 w-8 bg-primary/40 rounded-full ml-1" />
                                    </div>

                                    {answer?.evidence_submissions && answer.evidence_submissions.length > 0 && (
                                        <div className="flex flex-col gap-2 p-4 bg-muted/30 border border-muted-foreground/10 rounded-3xl animate-in fade-in">
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70">LAMPIRAN AKTIF</span>
                                                <Badge variant="secondary" className="h-5 px-1.5 font-black text-foreground">
                                                    {answer.evidence_submissions.length}
                                                </Badge>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[250px] overflow-y-auto pr-1">
                                                {answer.evidence_submissions.map((ev: any) => (
                                                    <div
                                                        key={ev.id}
                                                        className="flex items-center justify-between gap-2 p-2.5 bg-background border hover:border-primary/30 rounded-2xl group transition-all cursor-pointer shadow-sm"
                                                        onClick={() => openPreview(`/storage/${ev.file_path}`, ev.original_name)}
                                                    >
                                                        <span className="text-[11px] font-bold text-muted-foreground truncate flex-1 group-hover:text-primary transition-colors pl-1">
                                                            {ev.original_name}
                                                        </span>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            <Eye className="w-3 h-3 text-muted-foreground opacity-40 group-hover:opacity-100 hidden sm:block" />
                                                            <a
                                                                href={`/storage/${ev.file_path}`}
                                                                download
                                                                onClick={e => e.stopPropagation()}
                                                                className="p-1.5 hover:bg-primary/10 rounded-lg"
                                                            >
                                                                <Download className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                                                            </a>
                                                            {!isCompleted && (
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (confirm('Hapus file ini?')) {
                                                                            router.delete(`/dashboard/evidence/${ev.id}`);
                                                                        }
                                                                    }}
                                                                    className="p-1.5 hover:bg-destructive/10 rounded-lg group/del shadow-none"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover/del:text-destructive opacity-40 group-hover:opacity-100 transition-opacity" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid gap-4">
                                        {!isCompleted ? (
                                            <div className="relative group border-2 border-dashed border-muted-foreground/20 rounded-4xl p-10 transition-all hover:bg-muted/10 hover:border-primary/40 text-center">
                                                <input
                                                    type="file"
                                                    multiple
                                                    onChange={handleFileChange}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className="p-4 bg-muted/50 rounded-2xl w-fit mx-auto group-hover:bg-primary/10 transition-colors">
                                                    <FileUp className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                                                </div>
                                                <div className="mt-5 flex flex-col gap-1">
                                                    <span className="text-sm font-bold text-foreground">Pilih file pendukung</span>
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">Klik atau Geser ke sini (Multiple files ok)</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-10 border-2 border-dashed rounded-4xl bg-muted/20 text-center opacity-60">
                                                <CheckCircle2 className="w-8 h-8 text-primary mx-auto mb-3" />
                                                <span className="text-sm font-bold text-muted-foreground">Penyimpanan ditutup karena sudah difinalisasi</span>
                                            </div>
                                        )}

                                        {filesPreview.length > 0 && (
                                            <div className="flex flex-col gap-2 p-4 bg-primary/2 border border-primary/10 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 pl-1 mb-1">FILE SIAP DIUPLOAD:</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {filesPreview.map((file, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => openPreview(file.url, file.name)}
                                                            className="flex items-center gap-2 px-3 py-2 bg-background border border-primary/20 rounded-xl text-xs font-bold text-foreground shadow-sm hover:border-primary transition-colors cursor-pointer group"
                                                        >
                                                            <FileText className="w-3.5 h-3.5 text-primary" /> {file.name}
                                                            <Eye className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {progress && (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary">
                                                <span>Mengunggah Berkas...</span>
                                                <span>{progress.percentage}%</span>
                                            </div>
                                            <Progress value={progress.percentage} className="h-2" />
                                        </div>
                                    )}
                                    <Button
                                        className="w-full py-8 rounded-3xl text-sm font-black tracking-[0.3em] uppercase shadow-[0_15px_40px_-10px_rgba(var(--primary),.4)] hover:shadow-[0_20px_50px_-10px_rgba(var(--primary),.5)] transition-all active:scale-95 disabled:opacity-50"
                                        disabled={processing || isCompleted}
                                    >
                                        {isCompleted ? 'SUDAH DIFINALISASI' : (processing ? 'MENGIRIM DATA...' : 'SIMPAN SEMUA DATA')}
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* RIGHT COLUMN: Info & Status */}
                        <div className="space-y-6 lg:sticky lg:top-6 col-span-6">

                            {answer?.notes && (
                                <Card className={`border-2 shadow-md relative overflow-hidden ${answer.status === 'revision' ? 'border-destructive/40 bg-destructive/5' : 'border-primary/30 bg-primary/5'}`}>
                                    <div className={`absolute top-0 right-0 p-2 opacity-5 -rotate-12 translate-x-2 -translate-y-2`}>
                                        <MessageSquare className="w-20 h-20" />
                                    </div>
                                    <CardHeader className={`pb-3 pt-4 border-b mb-4 ${answer.status === 'revision' ? 'border-destructive/10' : 'border-primary/10'}`}>
                                        <div className={`flex items-center gap-2.5 ${answer.status === 'revision' ? 'text-destructive' : 'text-primary'}`}>
                                            <div className={`p-1.5 rounded-lg ${answer.status === 'revision' ? 'bg-destructive/20' : 'bg-primary/20'}`}>
                                                <MessageSquare className="w-4 h-4" />
                                            </div>
                                            <CardTitle className="text-sm font-black uppercase tracking-widest">Feedback / Catatan Admin</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm leading-relaxed font-bold text-foreground/90 whitespace-pre-wrap">
                                            {answer.notes}
                                        </p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Reference Info Card */}
                            <Card className="border-2 border-primary/30 shadow-[0_20px_40px_-15px_rgba(var(--primary),.3)]  overflow-hidden">
                                <CardHeader className="pb-4 pt-6 bg-primary/5 border-b border-primary/10">
                                    <div className="flex items-center justify-center sm:justify-start gap-3 text-primary">
                                        <div className="p-2.5 bg-primary/20 rounded-xl">
                                            <Info className="w-6 h-6" />
                                        </div>
                                        <CardTitle className="text-base font-black uppercase tracking-widest text-primary">Informasi Referensi</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 sm:p-8 space-y-10 max-h-[400px] overflow-y-auto">
                                    {/* Instructions */}
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 text-primary border-b-2 border-primary/30 pb-2 mb-2 w-max">
                                            <FileText className="w-5 h-5" />
                                            <span className="text-sm font-black uppercase tracking-widest">Deskripsi & Petunjuk</span>
                                        </div>
                                        <div
                                            className="text-base leading-relaxed text-foreground/90 font-medium ql-editor-mini"
                                            dangerouslySetInnerHTML={{ __html: question.instructions || 'Harap isi sesuai dengan kriteria yang berlaku dan sertakan bukti yang valid.' }}
                                        />
                                    </div>

                                    {/* Legal Basis */}
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 text-amber-600 border-b-2 border-amber-500/30 pb-2 mb-2 w-max">
                                            <Scale className="w-5 h-5" />
                                            <span className="text-sm font-black uppercase tracking-widest">Dasar Hukum</span>
                                        </div>
                                        <div
                                            className="bg-amber-500/5 p-5 rounded-2xl border border-amber-500/20 text-base leading-relaxed text-amber-700/90 font-medium italic ql-editor-mini"
                                            dangerouslySetInnerHTML={{ __html: question.legal_basis || 'Tidak ada dasar hukum khusus tercatat.' }}
                                        />
                                    </div>

                                    {/* Example File */}
                                    {question.example_file_path && (
                                        <div
                                            onClick={() => openPreview(`/storage/${question.example_file_path}`, 'Contoh Bukti Dukung')}
                                            className="mt-6 p-5 rounded-3xl border-2 border-dashed border-primary/30 bg-primary/10 flex items-center justify-between group hover:border-primary/60 hover:bg-primary/20 transition-all cursor-pointer shadow-sm"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 rounded-2xl bg-white text-primary shadow-sm group-hover:scale-110 transition-transform">
                                                    <Download className="w-5 h-5" />
                                                </div>
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-black text-primary tracking-widest uppercase">CONTOH BUKTI</span>
                                                    <span className="text-[10px] text-primary/70 font-black uppercase tracking-widest">Regulasi & Juknis</span>
                                                </div>
                                            </div>
                                            <div className="p-3 rounded-full bg-white/80 border shadow-sm group-hover:text-primary transition-all text-muted-foreground group-hover:-translate-x-1">
                                                <Eye className="w-5 h-5" />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>



                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .ql-editor-mini {
                    padding: 0;
                }
                .ql-editor-mini p {
                    margin-bottom: 0.5rem;
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

            <FilePreviewModal
                isOpen={previewModal.isOpen}
                onClose={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))}
                fileUrl={previewModal.url}
                fileName={previewModal.name}
            />
        </>
    );
}

QuestionDetail.layout = {
    breadcrumbs: [
        {
            title: 'Kuisioner',
            href: '/questionnaire',
        },
        {
            title: 'Detail Soal',
            href: '#',
        },
    ],
};

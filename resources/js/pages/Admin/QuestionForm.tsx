import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FilePreviewModal } from '@/components/file-preview-modal';
import { useState, useRef, useEffect } from 'react';
import { 
    Eye, 
    FileText, 
    ArrowLeft, 
    UploadCloud, 
    X, 
    Info, 
    HelpCircle, 
    CheckCircle2, 
    Plus,
    FileCheck
} from 'lucide-react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

// Custom Simple Editor Component to avoid findDOMNode issue in React 19
function RichTextEditor({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder?: string }) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                placeholder: placeholder,
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image', 'clean'],
                    ],
                },
            });

            quillRef.current.on('text-change', () => {
                const html = editorRef.current?.children[0].innerHTML || '';
                onChange(html);
            });
        }
        
        // Update content if changed from outside (only if different to prevent cursor jumping)
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            // Only update if the sanitized content is different to avoid infinite loops
            // But for simplicity in this case, we trust the internal state unless external reset
            if (value === '') {
                quillRef.current.root.innerHTML = '';
            }
        }
    }, []);

    // Initial value set
    useEffect(() => {
        if (quillRef.current && value && quillRef.current.root.innerHTML === '<p><br></p>') {
            quillRef.current.root.innerHTML = value;
        }
    }, [value]);

    return (
        <div className="bg-background">
            <div ref={editorRef} />
        </div>
    );
}

export default function QuestionForm({ question, sub_aspect_id }: any) {
    const isEditing = !!question;

    const { data, setData, post, processing, errors, progress } = useForm({
        _method: isEditing ? 'PUT' : 'POST',
        sub_aspect_id: sub_aspect_id || question?.sub_aspect_id || '',
        text: question?.text || '',
        instructions: question?.instructions || '',
        legal_basis: question?.legal_basis || '',
        example_files: [] as File[],
        existing_example_files: question?.example_file_paths || [],
        options: question?.options?.length ? question.options : [
            { score: 0, text: 'Tidak sesuai' },
            { score: 20, text: 'Kurang sesuai' },
            { score: 50, text: 'Sesuai sebagian' },
            { score: 70, text: 'Sesuai sebagian besar' },
            { score: 100, text: 'Sesuai 100%' },
        ]
    });

    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: '', name: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleOptionChange = (index: number, field: string, value: string | number) => {
        const newOptions = [...data.options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setData('options', newOptions);
    };

    const addOption = () => {
        setData('options', [...data.options, { score: 0, text: '' }]);
    };

    const removeOption = (index: number) => {
        const newOptions = data.options.filter((_: any, i: number) => i !== index);
        setData('options', newOptions);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setData('example_files', [...data.example_files, ...Array.from(e.target.files)]);
        }
    };

    const removeNewFile = (index: number) => {
        const newFiles = [...data.example_files];
        newFiles.splice(index, 1);
        setData('example_files', newFiles);
    };

    const removeExistingFile = (index: number) => {
        const newExisting = [...data.existing_example_files];
        newExisting.splice(index, 1);
        setData('existing_example_files', newExisting);
    };

    const openPreview = (url: string, name: string) => {
        setPreviewModal({ isOpen: true, url, name });
    };

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const url = isEditing ? `/admin/questions/${question.id}` : '/admin/questions';
        post(url);
    };

    return (
        <>
            <Head title={isEditing ? 'Edit Soal' : 'Tambah Soal Baru'} />
            <div className="flex flex-col gap-10 p-8 max-w-[1200px] mx-auto w-full font-sans">
                <div className="flex justify-between items-center border-b pb-6">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/assessments">
                            <div className="size-12 rounded-2xl bg-muted/50 flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all cursor-pointer border border-transparent hover:border-primary/20 text-foreground">
                                <ArrowLeft className="size-5" />
                            </div>
                        </Link>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-foreground/90 uppercase">{isEditing ? 'Edit Soal Penilaian' : 'Buat Soal Baru'}</h1>
                            <p className="text-muted-foreground font-medium mt-1">Konfigurasi butir pertanyaan, instruksi, dan bobot jawaban.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="grid lg:grid-cols-[1fr_400px] gap-10 items-start pb-20">
                    <div className="space-y-10">
                        {/* Core Question Content */}
                        <CardWrapper title="Inti Pertanyaan" icon={<HelpCircle className="size-5" />}>
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Teks Pertanyaan / Soal</Label>
                                    <textarea 
                                        className="w-full h-32 rounded-2xl bg-muted/5 p-5 font-bold text-lg border-2 border-muted focus:border-primary focus:ring-8 focus:ring-primary/5 transition-all focus:outline-none"
                                        placeholder="Tuliskan pertanyaan pengawasan di sini..."
                                        required
                                        value={data.text}
                                        onChange={e => setData('text', e.target.value)}
                                    />
                                    {errors.text && <p className="text-xs text-destructive font-bold mt-1 px-1">{errors.text}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Petunjuk Pengisian</Label>
                                    <div className="bg-muted/5 rounded-2xl border-2 border-muted overflow-hidden focus-within:ring-8 focus-within:ring-primary/5 focus-within:border-primary transition-all">
                                        <RichTextEditor 
                                            value={data.instructions} 
                                            onChange={val => setData('instructions', val)}
                                            placeholder="Berikan instruksi tambahan cara menjawab soal ini..."
                                        />
                                    </div>
                                    {errors.instructions && <p className="text-xs text-destructive font-bold mt-1 px-1">{errors.instructions}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Dasar Hukum / Regulasi</Label>
                                    <div className="bg-muted/5 rounded-2xl border-2 border-muted overflow-hidden focus-within:ring-8 focus-within:ring-primary/5 focus-within:border-primary transition-all">
                                        <RichTextEditor 
                                            value={data.legal_basis} 
                                            onChange={val => setData('legal_basis', val)}
                                            placeholder="Tuliskan dasar hukum atau regulasi terkait..."
                                        />
                                    </div>
                                    {errors.legal_basis && <p className="text-xs text-destructive font-bold mt-1 px-1">{errors.legal_basis}</p>}
                                </div>
                            </div>
                        </CardWrapper>

                        {/* Options Section */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-3 text-foreground">
                                    <CheckCircle2 className="size-5 text-primary" />
                                    <h3 className="font-black text-xl uppercase tracking-tight">Opsi Jawaban</h3>
                                </div>
                                <Button type="button" variant="outline" className="rounded-xl border-dashed h-9 text-[10px] font-black uppercase tracking-widest px-4" onClick={addOption}>
                                    <Plus className="size-3 mr-2" /> Tambah Opsi
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {data.options.map((opt: any, index: number) => (
                                    <div key={index} className="group relative flex gap-4 items-center bg-card border-2 border-muted p-5 rounded-3xl transition-all hover:border-primary/40 hover:shadow-xl">
                                        <div className="w-24 shrink-0">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Bobot</Label>
                                            <div className="relative">
                                                <Input 
                                                    type="number" 
                                                    required 
                                                    min="0"
                                                    max="100"
                                                    value={opt.score} 
                                                    onChange={e => handleOptionChange(index, 'score', e.target.value)}
                                                    className="h-11 rounded-xl font-black text-center pr-2"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 mb-2 block">Teks Jawaban</Label>
                                            <Input 
                                                required 
                                                value={opt.text} 
                                                onChange={e => handleOptionChange(index, 'text', e.target.value)}
                                                className="h-11 rounded-xl font-bold"
                                                placeholder="Deskripsi pilihan jawaban..."
                                            />
                                        </div>
                                        {data.options.length > 2 && (
                                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 mt-6 rounded-xl text-destructive hover:bg-destructive/10" onClick={() => removeOption(index)}>
                                                <X className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                {errors.options && <p className="text-sm text-destructive font-bold px-1">{errors.options}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Assets */}
                    <div className="space-y-8 sticky top-8">
                        {/* File Upload Area */}
                        <div className="bg-card border-2 border-dashed border-muted rounded-[2.5rem] p-8 space-y-6 text-center shadow-sm">
                            <div className="size-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto border border-primary/20">
                                <UploadCloud className="size-10" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-black text-lg tracking-tight text-foreground">Contoh Bukti Dukung</h4>
                                <p className="text-[11px] text-muted-foreground font-medium px-4">Lampirkan file PDF / Dokumen sebagai referensi pengisian oleh pelaksana.</p>
                            </div>

                            <input 
                                type="file" 
                                className="hidden" 
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png,.jpeg,.mp4,.mov,.avi"
                                multiple
                            />

                            <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full h-14 rounded-2xl border-2 font-black text-xs uppercase tracking-widest hover:bg-primary/5 hover:border-primary transition-all mb-4"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Plus className="size-4 mr-2" /> Tambah File
                            </Button>

                            <div className="space-y-3">
                                {data.example_files.map((f: File, i: number) => (
                                    <div key={`new-${i}`} className="p-4 bg-primary/5 rounded-2xl border-2 border-primary/20 relative group">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="size-10 bg-primary text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                                                <FileCheck className="size-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[11px] font-black truncate text-foreground">{f.name}</p>
                                                <p className="text-[9px] font-bold text-muted-foreground">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => removeNewFile(i)}
                                                className="size-8 rounded-lg hover:bg-destructive/20 text-destructive flex items-center justify-center transition-colors"
                                            >
                                                <X className="size-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {isEditing && data.existing_example_files && data.existing_example_files.map((ef: any, i: number) => (
                                    <div key={`ext-${i}`} className="p-4 bg-muted/30 rounded-2xl border border-muted space-y-3">
                                        <div className="flex items-center justify-between">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 w-32 truncate">{ef.name}</p>
                                            <button 
                                                type="button"
                                                onClick={() => removeExistingFile(i)}
                                                className="size-6 rounded hover:bg-destructive/10 text-destructive flex items-center justify-center transition-colors"
                                            >
                                                <X className="size-3" />
                                            </button>
                                        </div>
                                        <Button 
                                            type="button" 
                                            variant="secondary" 
                                            size="sm" 
                                            className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                            onClick={() => openPreview(`/storage/${ef.path}`, ef.name)}
                                        >
                                            <Eye className="size-4 mr-2" /> Lihat Current
                                        </Button>
                                    </div>
                                ))}
                            </div>


                        </div>

                        {/* Submit Section */}
                        <div className="bg-foreground text-background rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
                            <div className="flex items-center gap-4">
                                <div className="size-12 bg-primary animate-pulse rounded-2xl flex items-center justify-center text-white">
                                    <FileText className="size-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="font-black text-xl tracking-tight leading-none uppercase italic text-background">Finalisasi</h4>
                                    <p className="text-[10px] text-background/60 font-bold uppercase tracking-widest">Validasi & Simpan</p>
                                </div>
                            </div>

                            {progress && (
                                <div className="space-y-3">
                                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary">
                                        <span>Mengunggah...</span>
                                        <span>{progress.percentage}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progress.percentage}%` }} />
                                    </div>
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                size="lg" 
                                disabled={processing} 
                                className="w-full h-16 rounded-2xl bg-primary text-white hover:bg-primary/90 transition-all shadow-xl active:scale-[0.98] font-black uppercase text-xs tracking-[0.2em] border-none"
                            >
                                {processing ? 'Memproses...' : (isEditing ? 'Perbarui Soal' : 'Simpan Soal')}
                            </Button>
                            
                            <p className="text-[9px] text-center font-bold text-background/40 uppercase tracking-widest">Pastikan semua kolom mandatory terisi.</p>
                        </div>

                        <div className="p-6 bg-muted/20 rounded-3xl border flex gap-4">
                            <Info className="size-5 text-primary shrink-0 mt-0.5" />
                            <p className="text-[11px] font-medium leading-relaxed text-muted-foreground">
                                Perubahan pada soal akan langsung berdampak pada seluruh kuisioner pelaksana di periode ini. Pastikan tidak mengubah konteks pertanyaan secara radikal jika periode sudah berjalan.
                            </p>
                        </div>
                    </div>
                </form>
            </div>

            <FilePreviewModal 
                isOpen={previewModal.isOpen} 
                onClose={() => setPreviewModal(prev => ({ ...prev, isOpen: false }))} 
                fileUrl={previewModal.url}
                fileName={previewModal.name}
            />

            <style>{`
                .ql-container {
                    font-family: inherit;
                    font-size: 0.875rem;
                }
                .ql-editor {
                    min-height: 250px;
                }
                .ql-toolbar.ql-snow {
                    border: none;
                    border-bottom: 2px solid var(--muted);
                    padding: 8px 16px;
                }
                .ql-container.ql-snow {
                    border: none;
                }
            `}</style>
        </>
    );
}

function CardWrapper({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
    return (
        <div className="bg-card border-none rounded-[2.5rem] shadow-2xl p-10 space-y-8 overflow-hidden">
            <div className="flex items-center gap-4 text-foreground">
                <div className="size-10 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                    {icon}
                </div>
                <h3 className="font-black text-2xl tracking-tight uppercase">{title}</h3>
            </div>
            {children}
        </div>
    );
}

QuestionForm.layout = (page: React.ReactNode) => page;

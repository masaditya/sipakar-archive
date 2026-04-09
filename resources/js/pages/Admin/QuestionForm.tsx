import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { FilePreviewModal } from '@/components/file-preview-modal';
import { useState } from 'react';
import { Eye, FileText } from 'lucide-react';

export default function QuestionForm({ question, sub_aspect_id }: any) {
    const isEditing = !!question;

    const { data, setData, post, processing, errors, progress } = useForm({
        _method: isEditing ? 'PUT' : 'POST',
        sub_aspect_id: sub_aspect_id || question?.sub_aspect_id || '',
        text: question?.text || '',
        instructions: question?.instructions || '',
        legal_basis: question?.legal_basis || '',
        example_file: null as File | null,
        options: question?.options?.length ? question.options : [
            { score: 100, text: 'Sesuai 100%' },
            { score: 70, text: 'Sesuai sebagian besar' },
            { score: 50, text: 'Sesuai sebagian' },
            { score: 20, text: 'Kurang sesuai' },
            { score: 0, text: 'Tidak sesuai' }
        ]
    });

    const [previewModal, setPreviewModal] = useState({ isOpen: false, url: '', name: '' });

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
        if (e.target.files) {
            setData('example_file', e.target.files[0]);
        }
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
            <div className="p-6 max-w-4xl mx-auto w-full">
                <div className="mb-6 flex gap-4 items-center">
                    <Link href="/dashboard">
                        <Button variant="outline" size="sm">← Kembali</Button>
                    </Link>
                    <h1 className="text-2xl font-bold">{isEditing ? 'Edit Soal Penilaian' : 'Buat Soal Penilaian Baru'}</h1>
                </div>

                <div className="bg-card border rounded-xl shadow-sm p-6 overflow-hidden">
                    <form onSubmit={onSubmit} className="space-y-6">
                        
                        <div className="space-y-4">
                            <div>
                                <Label className="text-lg">Teks Pertanyaan / Soal</Label>
                                <textarea 
                                    className="w-full mt-2 border rounded-md p-3 min-h-[100px] text-sm focus:outline-primary"
                                    placeholder="Tuliskan pertanyaan pengawasan di sini..."
                                    required
                                    value={data.text}
                                    onChange={e => setData('text', e.target.value)}
                                />
                                {errors.text && <p className="text-sm text-destructive mt-1">{errors.text}</p>}
                            </div>

                            <div>
                                <Label className="text-lg">Petunjuk Pengisian (Opsional)</Label>
                                <textarea 
                                    className="w-full mt-2 border rounded-md p-3 text-sm focus:outline-primary bg-muted/20"
                                    placeholder="Berikan instruksi tambahan cara menjawab soal ini..."
                                    value={data.instructions}
                                    onChange={e => setData('instructions', e.target.value)}
                                />
                                {errors.instructions && <p className="text-sm text-destructive mt-1">{errors.instructions}</p>}
                            </div>

                            <div>
                                <Label className="text-lg">Dasar Hukum (Opsional)</Label>
                                <textarea 
                                    className="w-full mt-2 border rounded-md p-3 text-sm focus:outline-primary bg-muted/20"
                                    placeholder="Tuliskan dasar hukum atau regulasi terkait soal ini..."
                                    value={data.legal_basis}
                                    onChange={e => setData('legal_basis', e.target.value)}
                                />
                                {errors.legal_basis && <p className="text-sm text-destructive mt-1">{errors.legal_basis}</p>}
                            </div>

                            <div>
                                <Label className="text-lg">Contoh Bukti Dukung (File Opsional)</Label>
                                <p className="text-sm text-muted-foreground mb-2">Unggah PDF atau dokumen sebagai contoh bukti dukung yang bisa dipreview oleh pengguna.</p>
                                <Input 
                                    type="file" 
                                    onChange={handleFileChange}
                                />
                                {errors.example_file && <p className="text-sm text-destructive mt-1">{errors.example_file}</p>}
                                
                                {data.example_file && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <Button 
                                            type="button" 
                                            variant="secondary" 
                                            size="sm" 
                                            className="text-xs"
                                            onClick={() => openPreview(URL.createObjectURL(data.example_file as File), (data.example_file as File).name)}
                                        >
                                            <Eye className="w-4 h-4 mr-1" /> Pratinjau File Baru
                                        </Button>
                                        <span className="text-xs text-muted-foreground italic truncate max-w-[200px]">{(data.example_file as File).name}</span>
                                    </div>
                                )}

                                {isEditing && question.example_file_path && !data.example_file && (
                                    <div className="mt-2 text-sm bg-blue-50 text-blue-800 p-2 rounded-md border border-blue-200 w-fit flex items-center gap-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold">File Aktif di Server</span>
                                            <span className="text-[10px] text-blue-600 uppercase font-bold tracking-widest opacity-70 italic">Sudah tersimpan</span>
                                        </div>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="sm" 
                                            className="text-blue-800 hover:bg-blue-100"
                                            onClick={() => openPreview(`/storage/${question.example_file_path}`, 'Contoh Bukti Aktif')}
                                        >
                                            <Eye className="w-4 h-4 mr-1" /> Lihat Sekarang
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t pt-6 mt-6">
                            <div className="flex justify-between items-center mb-4">
                                <Label className="text-lg">Opsi Jawaban & Bobot Nilai</Label>
                                <Button type="button" variant="outline" size="sm" onClick={addOption}>+ Tambah Opsi</Button>
                            </div>
                            {errors.options && <p className="text-sm text-destructive mb-4">{errors.options}</p>}
                            
                            <div className="space-y-3">
                                {data.options.map((opt: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-center bg-muted/10 p-3 rounded-lg border">
                                        <div className="w-24">
                                            <Label className="text-xs text-muted-foreground">Bobot (0-100)</Label>
                                            <Input 
                                                type="number" 
                                                required 
                                                value={opt.score} 
                                                onChange={e => handleOptionChange(index, 'score', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Label className="text-xs text-muted-foreground">Teks Opsi Jawaban</Label>
                                            <Input 
                                                required 
                                                value={opt.text} 
                                                onChange={e => handleOptionChange(index, 'text', e.target.value)}
                                            />
                                        </div>
                                        {data.options.length > 2 && (
                                            <Button type="button" variant="destructive" size="sm" className="mt-5" onClick={() => removeOption(index)}>
                                                Hapus
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t pt-6 space-y-4">
                            {progress && (
                                <div className="space-y-2">
                                     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary">
                                        <span>Menyimpan ke Server...</span>
                                        <span>{progress.percentage}%</span>
                                    </div>
                                    <Progress value={progress.percentage} className="h-2" />
                                </div>
                            )}
                            <div className="flex justify-end">
                                <Button type="submit" size="lg" disabled={processing} className="px-8">
                                    {processing ? 'Sedang Memproses...' : 'Simpan Pertanyaan'}
                                </Button>
                            </div>
                        </div>
                    </form>
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

QuestionForm.layout = (page: React.ReactNode) => page;

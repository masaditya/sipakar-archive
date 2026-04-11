import { Head, router, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { 
    ChevronDown, 
    ChevronRight, 
    Plus, 
    Pencil, 
    Trash2, 
    HelpCircle, 
    Layers, 
    CalendarDays,
    Info,
    Percent,
    Paperclip
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CentralManagement({ aspects }: any) {
    const { current_period } = usePage<any>().props;

    // === COLLAPSE STATES ===
    const [expandedAspects, setExpandedAspects] = useState<number[]>([]);
    const toggleAspect = (id: number) => {
        setExpandedAspects(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const [expandedSubAspects, setExpandedSubAspects] = useState<number[]>([]);
    const toggleSubAspect = (id: number) => {
        setExpandedSubAspects(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    // === ASPECT CRUD ===
    const [newAspect, setNewAspect] = useState({ name: '', description: '', score_weight: '' });
    const handleCreateAspect = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/aspects', newAspect, { 
            onSuccess: () => setNewAspect({ name: '', description: '', score_weight: '' }),
            preserveScroll: true
        });
    };
    const handleDeleteAspect = (id: number) => {
        if(confirm('Hapus aspek ini berserta seluruh sub-aspek dan soal di dalamnya?')) router.delete(`/admin/aspects/${id}`);
    };

    // === SUBASPECT CRUD ===
    const [newSub, setNewSub] = useState({ aspect_id: '', name: '', type: 'UP', score_weight: '' });
    const handleCreateSub = (e: React.FormEvent, aspect_id: number) => {
        e.preventDefault();
        router.post('/admin/subaspects', { ...newSub, aspect_id }, { 
            onSuccess: () => setNewSub({ aspect_id: '', name: '', type: 'UP', score_weight: '' }),
            preserveScroll: true 
        });
    };
    const handleDeleteSub = (id: number) => {
        if(confirm('Hapus sub aspek ini beserta soalnya?')) router.delete(`/admin/subaspects/${id}`);
    };

    // === QUESTION CRUD ===
    const handleDeleteQuestion = (id: number) => {
        if(confirm('Hapus soal ini?')) router.delete(`/admin/questions/${id}`);
    };

    const handleEditAspect = (a: any) => {
        const name = prompt('Edit Aspek:', a.name);
        const weight = prompt('Bobot Nilai (0-100):', a.score_weight);
        if(name && weight !== null) router.put(`/admin/aspects/${a.id}`, { name, description: a.description, score_weight: weight });
    };

    const handleEditSub = (sub: any) => {
        const name = prompt('Edit Sub Aspek:', sub.name);
        const weight = prompt('Bobot Nilai (0-100):', sub.score_weight);
        if(name && weight !== null) router.put(`/admin/subaspects/${sub.id}`, { name, aspect_id: sub.aspect_id, type: sub.type, score_weight: weight });
    };

    return (
        <>
            <Head title="Manajemen Kuisioner" />
            <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground/90">Manajemen Kuisioner</h1>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            Bank soal dan struktur penilaian periode 
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full font-black text-xs uppercase tracking-widest border border-primary/20">
                                <CalendarDays className="size-3" />
                                TA {current_period?.name}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
                    {/* Add Aspect Form */}
                    <div className="bg-card border rounded-3xl p-8 shadow-xl sticky top-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                                <Plus className="size-5" />
                            </div>
                            <h3 className="font-black text-xl tracking-tight uppercase">Aspek Baru</h3>
                        </div>
                        <form onSubmit={handleCreateAspect} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Nama Aspek</Label>
                                <Input required placeholder="Contoh: A. Penciptaan Arsip" value={newAspect.name} onChange={e => setNewAspect({...newAspect, name: e.target.value})} className="h-12 rounded-xl bg-background border-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold shadow-sm" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Bobot Nilai (%)</Label>
                                <div className="relative">
                                    <Input required type="number" min="0" max="100" placeholder="0-100" value={newAspect.score_weight} onChange={e => setNewAspect({...newAspect, score_weight: e.target.value})} className="h-12 rounded-xl bg-background border-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-bold pr-10" />
                                    <Percent className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground opacity-50" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Deskripsi Ringkas</Label>
                                <textarea placeholder="Deskripsi opsional..." value={newAspect.description} onChange={e => setNewAspect({...newAspect, description: e.target.value})} className="w-full mt-1 border border-muted/30 rounded-xl p-4 text-xs font-semibold focus:ring-4 focus:ring-primary/10 transition-all bg-background min-h-[120px]" />
                            </div>
                            <Button type="submit" className="w-full h-14 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                                Tambah Aspek
                            </Button>
                        </form>
                    </div>

                    {/* Aspects List */}
                    <div className="space-y-6">
                        {aspects?.map((aspect: any) => {
                            const isAspectExpanded = expandedAspects.includes(aspect.id);
                            return (
                                <div key={aspect.id} className={`border rounded-3xl bg-card shadow-lg transition-all duration-300 overflow-hidden ${isAspectExpanded ? 'ring-2 ring-primary/20' : ''}`}>
                                    <div className="flex justify-between items-center p-6 sm:p-8 cursor-pointer group hover:bg-primary/5" onClick={() => toggleAspect(aspect.id)}>
                                        <div className="flex items-center gap-6">
                                            <div className={`p-3 rounded-2xl transition-all ${isAspectExpanded ? 'bg-primary text-white shadow-lg' : 'bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'}`}>
                                                {isAspectExpanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors">{aspect.name}</h3>
                                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black border border-primary/20">
                                                        BOBOT: {aspect.score_weight}%
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-muted-foreground opacity-70 mt-1">{aspect.description || "Tidak ada deskripsi rinci"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                            <Button variant="ghost" size="icon" onClick={() => handleEditAspect(aspect)} className="rounded-xl hover:bg-primary/10 hover:text-primary">
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleDeleteAspect(aspect.id)} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {isAspectExpanded && (
                                        <div className="p-8 space-y-8 bg-muted/10 border-t border-muted/20">
                                            {/* Sub Aspects List */}
                                            <div className="grid gap-6">
                                                {aspect.sub_aspects?.map((sub: any) => {
                                                    const isSubExpanded = expandedSubAspects.includes(sub.id);
                                                    return (
                                                        <div key={sub.id} className="border rounded-2xl bg-background shadow-sm overflow-hidden transition-all">
                                                            <div className="flex items-center justify-between p-5 cursor-pointer hover:bg-primary/5 transition-colors" onClick={() => toggleSubAspect(sub.id)}>
                                                                <div className="flex items-center gap-4">
                                                                    <div className={`transition-colors ${isSubExpanded ? 'text-primary' : 'text-muted-foreground'}`}>
                                                                        {isSubExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                                                    </div>
                                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                                        <h5 className="font-black text-base tracking-tight">{sub.name}</h5>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-black tracking-widest rounded-md bg-primary/10 text-primary border border-primary/20 uppercase w-fit">
                                                                                UNIT {sub.type === 'UP' ? 'PENGELOLA' : 'KEARSIPAN'}
                                                                            </span>
                                                                            <span className="inline-flex items-center px-2 py-0.5 text-[9px] font-black tracking-widest rounded-md bg-orange-100 text-orange-600 border border-orange-200 uppercase w-fit">
                                                                                BOBOT: {sub.score_weight}%
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                                    <Button variant="ghost" size="sm" onClick={() => handleEditSub(sub)} className="h-8 px-2 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors">Edit</Button>
                                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteSub(sub.id)} className="h-8 px-2 text-[10px] font-black uppercase text-muted-foreground hover:text-destructive transition-colors">Hapus</Button>
                                                                </div>
                                                            </div>
                                                            
                                                            {isSubExpanded && (
                                                                <div className="p-5 pt-0 space-y-4">
                                                                    <div className="space-y-4">
                                                                        {sub.questions?.length === 0 && (
                                                                            <p className="text-xs font-medium text-muted-foreground text-center py-8 bg-muted/30 rounded-xl border border-dashed">Belum ada soal tersedia.</p>
                                                                        )}
                                                                        {sub.questions?.map((q: any, i: number) => (
                                                                            <div key={q.id} className="p-5 bg-card rounded-2xl border flex items-center gap-4 hover:border-primary/50 transition-colors shadow-sm relative group/q">
                                                                                <div className="size-8 shrink-0 bg-primary/10 text-primary flex items-center justify-center font-black text-xs rounded-xl border border-primary/20">
                                                                                    {i + 1}
                                                                                </div>
                                                                                <div className="flex-1 space-y-3">
                                                                                    <p className="font-bold text-sm leading-relaxed text-foreground/90">{q.text}</p>
                                                                                    {/* {q.instructions && (
                                                                                        <div className="flex items-start gap-2 bg-muted/50 p-3 rounded-xl border-l-4 border-primary">
                                                                                            <HelpCircle className="size-4 text-primary shrink-0 mt-0.5" />
                                                                                            <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">{q.instructions}</p>
                                                                                        </div>
                                                                                    )} */}
                                                                                    {q.example_file_paths && q.example_file_paths.length > 0 && (
                                                                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary mt-1 border border-primary/20">
                                                                                            <Paperclip className="size-3" />
                                                                                            <span className="text-[10px] font-black uppercase tracking-widest">{q.example_file_paths.length} Item Contoh Bukti Dukung</span>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                                <div className="flex flex-col gap-2 shrink-0 self-start">
                                                                                    <Link href={`/admin/questions/${q.id}/edit`}>
                                                                                        <Button variant="secondary" size="sm" className="h-8 px-3 text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-primary hover:text-white transition-all">
                                                                                            Edit Soal
                                                                                        </Button>
                                                                                    </Link>
                                                                                    <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(q.id)} className="h-8 px-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-destructive transition-all">
                                                                                        Hapus
                                                                                    </Button>
                                                                                </div>
                                                                            </div>
                                                                        ))}

                                                                        <div className="mt-6 flex justify-center">
                                                                            <Link href={`/admin/questions/create?sub_aspect_id=${sub.id}`}>
                                                                                <Button variant="outline" className="rounded-xl border-dashed border-2 hover:bg-primary/5 hover:border-primary transition-all flex items-center gap-2 font-black text-xs uppercase tracking-widest px-6 h-12 shadow-sm">
                                                                                    <Plus className="size-4" />
                                                                                    Tambah Soal
                                                                                </Button>
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                            
                                            {/* Add Sub Aspect Section */}
                                            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                                                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-primary/60 mb-4 ml-1">Struktur Sub-Aspek</h4>
                                                <form onSubmit={(e) => handleCreateSub(e, aspect.id)} className="flex flex-col sm:flex-row items-end gap-3">
                                                    <div className="flex-[3] w-full space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Nama Sub-Aspek</Label>
                                                        <Input required placeholder="Contoh: 1. Tata Naskah Dinas" value={newSub.aspect_id === aspect.id.toString() ? newSub.name : ''} onChange={e => setNewSub({aspect_id: aspect.id.toString(), name: e.target.value, type: newSub.type, score_weight: newSub.score_weight})} className="h-11 rounded-xl bg-background border-primary/10 font-bold focus:ring-4 focus:ring-primary/10 shadow-sm" />
                                                    </div>
                                                    <div className="flex-1 w-full space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Bobot (%)</Label>
                                                        <Input required type="number" min="0" max="100" placeholder="%" value={newSub.aspect_id === aspect.id.toString() ? newSub.score_weight : ''} onChange={e => setNewSub({...newSub, score_weight: e.target.value})} className="h-11 rounded-xl bg-background border-primary/10 font-black focus:ring-4 focus:ring-primary/10 shadow-sm" />
                                                    </div>
                                                    <div className="flex-1 w-full space-y-2">
                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Jenis</Label>
                                                        <select className="flex h-11 w-full rounded-xl border border-primary/10 bg-background px-3 py-1 text-[10px] font-black transition-colors focus:ring-4 focus:ring-primary/10 shadow-sm uppercase tracking-widest" value={newSub.aspect_id === aspect.id.toString() ? newSub.type : 'UP'} onChange={e => setNewSub({...newSub, type: e.target.value})}>
                                                            <option value="UP">UNIT PENGELOLA</option>
                                                            <option value="UK">UNIT KEARSIPAN</option>
                                                        </select>
                                                    </div>
                                                    <Button type="submit" className="h-11 w-full sm:w-auto px-6 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-all">
                                                        Simpan Sub
                                                    </Button>
                                                </form>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

CentralManagement.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Kuisioner',
            href: '/admin/assessments',
        },
    ],
};

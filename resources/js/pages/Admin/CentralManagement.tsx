import { Head, router, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function CentralManagement({ aspects, organizations }: any) {
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
    const [newAspect, setNewAspect] = useState({ name: '', description: '' });
    const handleCreateAspect = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/admin/aspects', newAspect, { onSuccess: () => setNewAspect({ name: '', description: '' }) });
    };
    const handleDeleteAspect = (id: number) => {
        if(confirm('Hapus aspek ini berserta seluruh sub-aspek dan soal di dalamnya?')) router.delete(`/admin/aspects/${id}`);
    };

    // === SUBASPECT CRUD ===
    const [newSub, setNewSub] = useState({ aspect_id: '', name: '', type: 'UP' });
    const handleCreateSub = (e: React.FormEvent, aspect_id: number) => {
        e.preventDefault();
        router.post('/admin/subaspects', { ...newSub, aspect_id }, { onSuccess: () => setNewSub({ aspect_id: '', name: '', type: 'UP' }) });
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
        if(name) router.put(`/admin/aspects/${a.id}`, { name, description: a.description });
    };

    const handleEditSub = (sub: any) => {
        const name = prompt('Edit Sub Aspek:', sub.name);
        if(name) router.put(`/admin/subaspects/${sub.id}`, { name, aspect_id: sub.aspect_id, type: sub.type });
    };

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex justify-between items-end border-b pb-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-bold tracking-tight">Manajemen Sentral</h1>
                        <p className="text-muted-foreground">Kelola struktur bank soal pengawasan kearsipan.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Add Aspect Form */}
                        <div className="bg-card border rounded-xl p-6 shadow-sm">
                            <h3 className="font-semibold text-lg mb-4">Mulai Tambah Aspek Baru</h3>
                            <form onSubmit={handleCreateAspect} className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <Label>Nama Aspek</Label>
                                    <Input required placeholder="Contoh: A. Penciptaan Arsip" value={newAspect.name} onChange={e => setNewAspect({...newAspect, name: e.target.value})} />
                                </div>
                                <div className="flex-[2]">
                                    <Label>Deskripsi</Label>
                                    <Input placeholder="Deskripsi opsional..." value={newAspect.description} onChange={e => setNewAspect({...newAspect, description: e.target.value})} />
                                </div>
                                <Button type="submit">Tambah</Button>
                            </form>
                        </div>

                        {/* List Aspects */}
                        <div className="grid gap-6">
                            {aspects?.map((aspect: any) => {
                                const isAspectExpanded = expandedAspects.includes(aspect.id);
                                return (
                                <div key={aspect.id} className="border rounded-xl bg-card shadow-sm overflow-hidden">
                                    <div className="flex justify-between items-center p-6 border-b hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => toggleAspect(aspect.id)}>
                                        <div className="flex items-center gap-4">
                                            <div className="text-muted-foreground bg-muted p-2 rounded-lg">
                                                {isAspectExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold">{aspect.name}</h3>
                                                <p className="text-sm text-muted-foreground">{aspect.description || "Tidak ada deskripsi"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                                            <Button variant="outline" size="sm" onClick={() => handleEditAspect(aspect)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteAspect(aspect.id)}>Hapus</Button>
                                        </div>
                                    </div>
                                    
                                    {isAspectExpanded && (
                                        <div className="p-6 space-y-6 bg-muted/5">
                                            {/* Sub Aspects List */}
                                            {aspect.sub_aspects?.map((sub: any) => {
                                                const isSubExpanded = expandedSubAspects.includes(sub.id);
                                                return (
                                                <div key={sub.id} className="p-4 border rounded-xl bg-background shadow-sm">
                                                    <div className="flex items-center justify-between cursor-pointer group" onClick={() => toggleSubAspect(sub.id)}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-muted-foreground group-hover:text-primary transition-colors">
                                                                {isSubExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                                                            </div>
                                                            <h5 className="font-semibold text-base flex items-center gap-3">
                                                                {sub.name}
                                                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                                                    {sub.type}
                                                                </span>
                                                            </h5>
                                                        </div>
                                                        <div className="flex items-center gap-4" onClick={e => e.stopPropagation()}>
                                                            <button onClick={() => handleEditSub(sub)} className="text-primary text-sm hover:underline font-medium">Edit</button>
                                                            <button onClick={() => handleDeleteSub(sub.id)} className="text-destructive text-sm hover:underline font-medium">Hapus</button>
                                                        </div>
                                                    </div>
                                                    
                                                    {isSubExpanded && (
                                                        <div className="mt-4 pt-4 border-t pl-2 space-y-4">
                                                            {sub.questions?.length === 0 && (
                                                                <p className="text-sm text-muted-foreground text-center p-4 bg-muted/20 rounded-lg">Belum ada soal.</p>
                                                            )}
                                                            {sub.questions?.map((q: any, i: number) => (
                                                                <div key={q.id} className="p-4 bg-card rounded-lg border flex items-start gap-4">
                                                                    <div className="w-7 h-7 shrink-0 bg-primary/10 text-primary flex items-center justify-center font-bold text-sm rounded-md">
                                                                        {i + 1}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <p className="font-medium text-sm leading-relaxed">{q.text}</p>
                                                                        {q.instructions && <p className="text-xs text-muted-foreground mt-2 bg-muted/50 p-2 border-l-2 border-primary/50">Petunjuk: {q.instructions}</p>}
                                                                    </div>
                                                                    <div className="flex flex-col gap-3 shrink-0 items-end">
                                                                        <Link href={`/admin/questions/${q.id}/edit`}>
                                                                            <button className="text-primary text-xs font-semibold hover:underline bg-primary/10 px-2 py-1 rounded">Edit Soal</button>
                                                                        </Link>
                                                                        <button onClick={() => handleDeleteQuestion(q.id)} className="text-destructive text-xs hover:underline">Hapus</button>
                                                                    </div>
                                                                </div>
                                                            ))}

                                                            <div className="mt-4 p-4 border border-dashed rounded-lg bg-muted/10 flex justify-between items-center">
                                                                <p className="text-sm font-semibold text-muted-foreground">Kelola dan Buat Soal Penilaian</p>
                                                                <Link href={`/admin/questions/create?sub_aspect_id=${sub.id}`}>
                                                                    <Button size="sm" variant="secondary" className="shadow-sm">+ Tambah Soal</Button>
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )})}
                                            
                                            {/* Add Sub Aspect Form */}
                                            <form onSubmit={(e) => handleCreateSub(e, aspect.id)} className="flex items-end gap-3 bg-card p-4 rounded-xl border border-dashed mt-4 shadow-sm">
                                                <div className="flex-1">
                                                    <Label>Buat Sub Aspek Baru</Label>
                                                    <Input required placeholder="Contoh: 1. Tata Naskah Dinas" value={newSub.aspect_id === aspect.id.toString() ? newSub.name : ''} onChange={e => setNewSub({aspect_id: aspect.id.toString(), name: e.target.value, type: newSub.type})} />
                                                </div>
                                                <div>
                                                    <Label>Jenis</Label>
                                                    <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors mt-1" value={newSub.aspect_id === aspect.id.toString() ? newSub.type : 'UP'} onChange={e => setNewSub({...newSub, type: e.target.value})}>
                                                        <option value="UP">UP</option>
                                                        <option value="UK">UK</option>
                                                    </select>
                                                </div>
                                                <Button type="submit" variant="default" className="shadow-sm">Simpan</Button>
                                            </form>

                                        </div>
                                    )}
                                </div>
                            )})}
                        </div>
                </div>
            </div>
        </>
    );
}

CentralManagement.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Sentral',
            href: '/admin/assessments',
        },
    ],
};

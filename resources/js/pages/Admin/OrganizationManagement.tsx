import { Head, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, Pencil, Trash2, X } from 'lucide-react';

export default function OrganizationManagement({ organizations, filters }: any) {
    const initialFormState = { name: '', type: 'Dinas', address: '', phone: '', head_name: '', description: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [editingOrg, setEditingOrg] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingOrg) {
            router.put(`/admin/organizations/${editingOrg.id}`, formData, { 
                onSuccess: () => {
                    setEditingOrg(null);
                    setFormData(initialFormState);
                } 
            });
        } else {
            router.post('/admin/organizations', formData, { 
                onSuccess: () => setFormData(initialFormState) 
            });
        }
    };

    const handleDeleteOrg = (id: number) => {
        if(confirm('Yakin ingin menghapus organisasi ini beserta semua penggunanya?')) router.delete(`/admin/organizations/${id}`);
    };

    const handleEditOrg = (org: any) => {
        setEditingOrg(org);
        setFormData({ 
            name: org.name || '', 
            type: org.type || 'Dinas', 
            address: org.address || '', 
            phone: org.phone || '', 
            head_name: org.head_name || '', 
            description: org.description || '' 
        });
    };

    const cancelEdit = () => {
        setEditingOrg(null);
        setFormData(initialFormState);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/organizations', { search: searchTerm }, { preserveState: true });
    };

    // Debounced search could be better, but for now button click is fine
    useEffect(() => {
        if (searchTerm === '' && filters?.search) {
             router.get('/admin/organizations', {}, { preserveState: true });
        }
    }, [searchTerm]);

    return (
        <>
            <Head title="Manajemen Organisasi" />
            <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground/90">Manajemen Organisasi</h1>
                        <p className="text-muted-foreground mt-1">Kelola data organisasi, dinas, atau lembaga unit kearsipan.</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
                    {/* Form Section */}
                    <div className={`bg-card border rounded-3xl p-8 shadow-xl transition-all duration-500 ${editingOrg ? 'ring-2 ring-primary border-primary bg-primary/5' : ''}`}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-xl tracking-tight uppercase flex items-center gap-2">
                                {editingOrg ? <Pencil className="size-5" /> : <Plus className="size-5" />}
                                {editingOrg ? 'Edit Organisasi' : 'Tambah Organisasi'}
                            </h3>
                            {editingOrg && (
                                <Button variant="ghost" size="icon" onClick={cancelEdit} className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors">
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Nama Organisasi</Label>
                                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Dinas Sosial" className="h-12 rounded-xl bg-background border-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Jenis Institusi</Label>
                                <select className="w-full h-12 border border-muted/30 rounded-xl px-4 text-sm bg-background focus:ring-4 focus:ring-primary/10 transition-all font-semibold" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                                    <option value="Dinas">Dinas</option>
                                    <option value="Badan">Badan</option>
                                    <option value="Kantor">Kantor</option>
                                    <option value="Kementerian">Kementerian</option>
                                    <option value="RSUD">RSUD</option>
                                    <option value="Inspektorat">Inspektorat</option>
                                    <option value="Sekretariat">Sekretariat</option>
                                    <option value="Kecamatan">Kecamatan</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Nama Pimpinan (Kepala)</Label>
                                <Input value={formData.head_name} onChange={e => setFormData({...formData, head_name: e.target.value})} placeholder="Nama Kepala Dinas" className="h-12 rounded-xl bg-background border-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">No. Telepon / Kontak</Label>
                                <Input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="021-xxxxxx" className="h-12 rounded-xl bg-background border-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Alamat Lengkap</Label>
                                <textarea className="w-full mt-1 border border-muted/30 rounded-xl p-4 text-sm focus:ring-4 focus:ring-primary/10 transition-all bg-background min-h-[100px] font-semibold" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Jl. Raya No..." />
                            </div>
                            <Button type="submit" className="w-full h-14 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95">
                                {editingOrg ? 'Simpan Perubahan' : 'Simpan Organisasi'}
                            </Button>
                        </form>
                    </div>
                    
                    {/* List Section */}
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <form onSubmit={handleSearch} className="relative w-full md:max-w-md group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input 
                                    value={searchTerm} 
                                    onChange={e => setSearchTerm(e.target.value)} 
                                    placeholder="Cari nama, jenis, atau alamat..." 
                                    className="pl-11 h-12 rounded-2xl bg-card border-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-semibold shadow-sm" 
                                />
                                {searchTerm && (
                                    <button type="button" onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <X className="size-4 text-muted-foreground hover:text-foreground" />
                                    </button>
                                )}
                            </form>
                            <div className="text-sm font-bold text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border">
                                Menampilkan {organizations.from || 0} - {organizations.to || 0} dari {organizations.total} Data
                            </div>
                        </div>

                        <div className="bg-card border rounded-3xl overflow-hidden shadow-xl">
                            <div className="divide-y divide-muted/10 bg-background">
                                {organizations.data?.map((org: any) => (
                                    <div key={org.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-primary/5 transition-colors group">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <p className="font-black text-xl tracking-tight text-foreground/90 group-hover:text-primary transition-colors">{org.name}</p>
                                                <span className="text-[10px] px-2.5 py-1 bg-primary/10 text-primary rounded-lg font-black uppercase tracking-widest border border-primary/20">{org.type || 'N/A'}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-x-6 gap-y-2">
                                                {org.head_name && (
                                                    <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 opacity-80">
                                                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px]">👤</div>
                                                        {org.head_name}
                                                    </div>
                                                )}
                                                {org.phone && (
                                                    <div className="text-xs font-bold text-muted-foreground flex items-center gap-1.5 opacity-80">
                                                        <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px]">📞</div>
                                                        {org.phone}
                                                    </div>
                                                )}
                                            </div>
                                            {org.address && <p className="text-xs font-medium text-muted-foreground opacity-60 leading-relaxed max-w-2xl mt-1">{org.address}</p>}
                                        </div>
                                        <div className="flex gap-2 shrink-0 self-end sm:self-center">
                                            <Button variant="outline" size="icon" onClick={() => handleEditOrg(org)} className="rounded-xl border-muted/30 hover:bg-primary hover:text-white transition-all shadow-sm">
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={() => handleDeleteOrg(org.id)} className="rounded-xl border-muted/30 hover:bg-destructive hover:text-white transition-all shadow-sm">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {organizations.data?.length === 0 && (
                                    <div className="p-20 text-center flex flex-col items-center gap-4">
                                        <div className="size-20 bg-muted/20 rounded-full flex items-center justify-center">
                                            <Search className="size-10 text-muted-foreground/30" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-lg font-black text-foreground/60 tracking-tight">Tidak Ada Data</p>
                                            <p className="text-sm font-medium text-muted-foreground">Maaf, kami tidak menemukan data organisasi yang Anda cari.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {organizations.links && organizations.links.length > 3 && (
                                <div className="border-t p-6 bg-muted/5">
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        {organizations.links.map((link: any, i: number) => {
                                             if (link.url === null) return (
                                                 <span key={i} className="px-4 py-2 text-xs font-black uppercase text-muted-foreground/40 border border-transparent" dangerouslySetInnerHTML={{ __html: link.label }} />
                                             );
                                             
                                             return (
                                                 <Link
                                                     key={i}
                                                     href={link.url}
                                                     className={`px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all border ${link.active ? 'bg-primary text-white border-primary shadow-md' : 'bg-background text-muted-foreground border-muted/30 hover:border-primary/50 hover:bg-primary/5'}`}
                                                     dangerouslySetInnerHTML={{ __html: link.label }}
                                                     preserveState
                                                 />
                                             );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

OrganizationManagement.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Organisasi',
            href: '/admin/organizations',
        },
    ],
};

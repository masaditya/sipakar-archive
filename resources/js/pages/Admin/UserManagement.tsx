import { Head, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Plus, Pencil, Trash2, X, Shield, UserCircle, Mail, Building2, Download, Trash } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function UserManagement({ users, organizations, filters }: any) {
    const initialFormState = { name: '', username: '', email: '', password: '', role: 'user', organization_id: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            router.put(`/admin/users/${editingUser.id}`, formData, { 
                onSuccess: () => {
                    setEditingUser(null);
                    setFormData(initialFormState);
                } 
            });
        } else {
            router.post('/admin/users', formData, { 
                onSuccess: () => setFormData(initialFormState) 
            });
        }
    };

    const handleDeleteUser = (id: number) => {
        if(confirm('Yakin ingin menghapus user ini?')) router.delete(`/admin/users/${id}`);
    };

    const handleEditUser = (u: any) => {
        setEditingUser(u);
        setFormData({ ...u, password: '' }); 
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setFormData(initialFormState);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/users', { search: searchTerm }, { preserveState: true });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(users.data.map((u: any) => u.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectUser = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds(prev => [...prev, id]);
        } else {
            setSelectedIds(prev => prev.filter(i => i !== id));
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Yakin ingin menghapus ${selectedIds.length} user terpilih?`)) {
            router.post('/admin/users/bulk-delete', { ids: selectedIds }, {
                onSuccess: () => setSelectedIds([])
            });
        }
    };

    const handleExport = () => {
        window.location.href = '/admin/users/export';
    };

    useEffect(() => {
        if (searchTerm === '' && filters?.search) {
             router.get('/admin/users', {}, { preserveState: true });
        }
    }, [searchTerm]);

    return (
        <>
            <Head title="Manajemen Pengguna" />
            <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground/90">Manajemen Pengguna</h1>
                        <p className="text-muted-foreground mt-1">Kelola akun admin dan pelaksana sistem pengawasan kearsipan.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={handleExport} variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-11 px-6 shadow-sm hover:bg-primary hover:text-white transition-all">
                            <Download className="mr-2 size-4" />
                            Export Data
                        </Button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-start">
                    {/* Form Section */}
                    <div className={`bg-card border rounded-3xl p-8 shadow-xl transition-all duration-500 ${editingUser ? 'ring-2 ring-primary border-primary bg-primary/5' : ''}`}>
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="font-black text-xl tracking-tight uppercase flex items-center gap-2">
                                {editingUser ? <Pencil className="size-5" /> : <Plus className="size-5" />}
                                {editingUser ? 'Edit Pengguna' : 'Tambah User Baru'}
                            </h3>
                            {editingUser && (
                                <Button variant="ghost" size="icon" onClick={cancelEdit} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
                                    <X className="size-4" />
                                </Button>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Nama Lengkap</Label>
                                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" className="h-12 rounded-xl bg-background border-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold" />
                            </div>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Username</Label>
                                    <Input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="johndoe" className="h-12 rounded-xl bg-background border-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Role</Label>
                                    <select className="w-full h-12 border border-muted/30 rounded-xl px-4 text-sm bg-background focus:ring-4 focus:ring-primary/10 transition-all font-semibold" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                        <option value="user">Operator</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email</Label>
                                <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" className="h-12 rounded-xl bg-background border-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1 flex justify-between">
                                    Password 
                                    {editingUser && <span className="font-normal normal-case opacity-60">(Kosongkan jika tidak diubah)</span>}
                                </Label>
                                <Input type="password" required={!editingUser} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={editingUser ? "••••••••" : "Min. 8 karakter"} className="h-12 rounded-xl bg-background border-muted/30 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Organisasi / Dinas</Label>
                                <select className="w-full h-12 border border-muted/30 rounded-xl px-4 text-sm bg-background focus:ring-4 focus:ring-primary/10 transition-all font-semibold" value={formData.organization_id || ''} onChange={e => setFormData({...formData, organization_id: e.target.value})}>
                                    <option value="">-- Akun Umum / Global --</option>
                                    {organizations?.map((org: any) => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full h-14 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95">
                                {editingUser ? 'Simpan Perubahan' : 'Simpan Pengguna'}
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
                                    placeholder="Cari nama, username, atau email..." 
                                    className="pl-11 h-12 rounded-2xl bg-card border-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-semibold shadow-sm" 
                                />
                                {searchTerm && (
                                    <button type="button" onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <X className="size-4 text-muted-foreground hover:text-foreground" />
                                    </button>
                                )}
                            </form>
                            <div className="text-sm font-bold text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border">
                                {users.total} Pengguna Terdaftar
                            </div>
                        </div>

                        <div className="bg-card border rounded-3xl overflow-hidden shadow-xl">
                            {selectedIds.length > 0 && (
                                <div className="p-4 bg-primary/10 border-b border-primary/20 flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
                                    <div className="flex items-center gap-4 ml-2">
                                        <div className="px-3 py-1 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            {selectedIds.length} Terpilih
                                        </div>
                                    </div>
                                    <Button onClick={handleBulkDelete} variant="destructive" size="sm" className="rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 h-9">
                                        <Trash className="mr-2 size-3" />
                                        Hapus Terpilih
                                    </Button>
                                </div>
                            )}
                            <div className="p-4 border-b bg-muted/20 flex items-center gap-4">
                                <Checkbox 
                                    checked={selectedIds.length === users.data?.length && users.data?.length > 0}
                                    onCheckedChange={handleSelectAll}
                                    className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Pilih Semua</span>
                            </div>
                            <div className="divide-y divide-muted/10 bg-background">
                                {users.data?.map((u: any) => (
                                    <div key={u.id} className={`p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:bg-primary/5 transition-colors group ${selectedIds.includes(u.id) ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}>
                                        <div className="flex gap-4 items-center flex-1">
                                            <Checkbox 
                                                checked={selectedIds.includes(u.id)}
                                                onCheckedChange={(checked) => handleSelectUser(u.id, !!checked)}
                                                className="rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                            />
                                            <div className="size-12 rounded-2xl bg-muted/50 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all shrink-0">
                                                {u.role === 'admin' ? <Shield className="size-6" /> : <UserCircle className="size-6" />}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-black text-lg tracking-tight text-foreground/90">{u.name}</p>
                                                    <span className={`text-[10px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-orange-500/10 text-orange-600 border-orange-200' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                                        {u.role}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground opacity-70">
                                                    <span className="flex items-center gap-1"><Mail className="size-3" /> {u.email}</span>
                                                    <span className="flex items-center gap-1">@ {u.username}</span>
                                                </div>
                                                {u.organization_id && (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 bg-muted/50 rounded-lg text-[11px] font-bold text-muted-foreground/80 border">
                                                        <Building2 className="size-3" />
                                                        {organizations.find((o:any) => o.id === u.organization_id)?.name || 'Instansi Terdeteksi'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 shrink-0 self-end sm:self-center">
                                            <Button variant="outline" size="icon" onClick={() => handleEditUser(u)} className="rounded-xl border-muted/30 hover:bg-primary hover:text-white transition-all shadow-sm">
                                                <Pencil className="size-4" />
                                            </Button>
                                            <Button variant="outline" size="icon" onClick={() => handleDeleteUser(u.id)} className="rounded-xl border-muted/30 hover:bg-destructive hover:text-white transition-all shadow-sm">
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {users.data?.length === 0 && (
                                    <div className="p-20 text-center flex flex-col items-center gap-4">
                                        <div className="size-20 bg-muted/20 rounded-full flex items-center justify-center">
                                            <Search className="size-10 text-muted-foreground/30" />
                                        </div>
                                        <p className="text-lg font-black text-foreground/60 tracking-tight">User Tidak Ditemukan</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            {users.links && users.links.length > 3 && (
                                <div className="border-t p-6 bg-muted/5">
                                    <div className="flex flex-wrap justify-center gap-1.5">
                                        {users.links.map((link: any, i: number) => {
                                             if (link.url === null) return (
                                                 <span key={i} className="px-4 py-2 text-xs font-black uppercase text-muted-foreground/40" dangerouslySetInnerHTML={{ __html: link.label }} />
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

UserManagement.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Pengguna',
            href: '/admin/users',
        },
    ],
};

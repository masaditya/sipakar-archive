import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UserManagement({ users, organizations }: any) {
    const initialFormState = { name: '', username: '', email: '', password: '', role: 'user', organization_id: '' };
    const [formData, setFormData] = useState(initialFormState);
    const [editingUser, setEditingUser] = useState<any>(null);

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
        setFormData({ ...u, password: '' }); // keep password empty so they only update if typed
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setFormData(initialFormState);
    };

    return (
        <>
            <Head title="Manajemen Pengguna" />
            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-2 border-b pb-4">
                    <h1 className="text-3xl font-bold tracking-tight">Manajemen Pengguna</h1>
                    <p className="text-muted-foreground">Kelola akun admin dan pelaksana sistem pengawasan kearsipan.</p>
                </div>

                <div className="grid md:grid-cols-[300px_1fr] gap-6 items-start">
                    <div className={`bg-card border rounded-xl p-6 shadow-sm sticky top-6 transition-all ${editingUser ? 'ring-2 ring-primary border-primary' : ''}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-semibold text-lg">{editingUser ? 'Edit Pengguna' : 'Tambah User Baru'}</h3>
                            {editingUser && <Button variant="ghost" size="sm" onClick={cancelEdit} className="text-xs">Batal</Button>}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Label>Nama Lengkap</Label>
                                <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                            </div>
                            <div>
                                <Label>Username</Label>
                                <Input required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="johndoe" />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                            </div>
                            <div>
                                <Label>Password {editingUser && <span className="text-xs text-muted-foreground font-normal">(Kosongkan jika tidak diubah)</span>}</Label>
                                <Input type="password" required={!editingUser} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={editingUser ? "••••••••" : "Min. 8 karakter"} />
                            </div>
                            <div>
                                <Label>Role</Label>
                                <select className="w-full border rounded-md p-2 text-sm mt-1 bg-background focus:ring-2 focus:ring-ring focus:outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                                    <option value="user">User / Pelaksana</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <Label>Organisasi / Dinas</Label>
                                <select className="w-full border rounded-md p-2 text-sm mt-1 bg-background focus:ring-2 focus:ring-ring focus:outline-none" value={formData.organization_id || ''} onChange={e => setFormData({...formData, organization_id: e.target.value})}>
                                    <option value="">-- Pilih Organisasi --</option>
                                    {organizations?.map((org: any) => (
                                        <option key={org.id} value={org.id}>{org.name}</option>
                                    ))}
                                </select>
                            </div>
                            <Button type="submit" className="w-full">{editingUser ? 'Simpan Perubahan' : 'Simpan User'}</Button>
                        </form>
                    </div>
                    <div className="bg-card border rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-lg mb-4">Daftar Pengguna</h3>
                        <div className="divide-y border rounded-md overflow-hidden bg-background">
                            {users?.map((u: any) => (
                                <div key={u.id} className="p-4 flex justify-between items-center hover:bg-muted/50">
                                    <div>
                                        <p className="font-bold">{u.name} <span className="text-xs ml-2 px-2 py-0.5 bg-primary/10 text-primary rounded-full">{u.role}</span></p>
                                        <p className="text-sm text-muted-foreground">{u.username} • {u.email} {u.organization_id && organizations ? ` • 🏢 ${organizations.find((o:any) => o.id === u.organization_id)?.name || 'Organisasi terhapus'}` : ''}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEditUser(u)}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDeleteUser(u.id)}>Hapus</Button>
                                    </div>
                                </div>
                            ))}
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

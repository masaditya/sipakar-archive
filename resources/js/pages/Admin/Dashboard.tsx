import { Head, Link } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { 
    Activity, 
    Users, 
    Building2, 
    ClipboardList, 
    CheckCircle2, 
    ChevronRight,
    Search,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Dashboard({ stats, usersProgress }: any) {
    const [searchTerm, setSearchTerm] = useState('');
    const [progressFilter, setProgressFilter] = useState('all');
    const [sortValue, setSortValue] = useState('score-desc');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, progressFilter, sortValue]);

    const filteredUsers = useMemo(() => {
        let result = usersProgress || [];

        // Apply search
        if (searchTerm) {
            const lowerSearch = searchTerm.toLowerCase();
            result = result.filter((u: any) => 
                (u.name && u.name.toLowerCase().includes(lowerSearch)) || 
                (u.organization && u.organization.toLowerCase().includes(lowerSearch))
            );
        }

        // Apply progress filter
        if (progressFilter !== 'all') {
            result = result.filter((u: any) => {
                if (progressFilter === 'complete') return u.progress === 100;
                if (progressFilter === 'in-progress') return u.progress > 0 && u.progress < 100;
                if (progressFilter === 'not-started') return u.progress === 0;
                return true;
            });
        }

        // Apply sorting
        const [field, direction] = sortValue.split('-');
        result = [...result].sort((a: any, b: any) => {
            const aValue = a[field];
            const bValue = b[field];
            
            if (typeof aValue === 'string') {
                return direction === 'asc' 
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            
            // Numeric fallback
            return direction === 'asc' ? (aValue || 0) - (bValue || 0) : (bValue || 0) - (aValue || 0);
        });

        return result;
    }, [usersProgress, searchTerm, progressFilter, sortValue]);

    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-8 p-8 max-w-[1400px] mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight text-foreground/90">Dashboard Monitoring</h1>
                        <p className="text-muted-foreground mt-1">Ringkasan hasil evaluasi dan progres pengawasan kearsipan.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 to-transparent overflow-hidden relative group">
                        <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                            <Users size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Total Pelaksana</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{stats.users}</div>
                            <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-tighter opacity-70">User Terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 to-transparent overflow-hidden relative group">
                        <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                            <Building2 size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Instansi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{stats.organizations}</div>
                            <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-tighter opacity-70">Organisasi Aktif</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 to-transparent overflow-hidden relative group">
                        <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                            <ClipboardList size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Bank Soal</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{stats.questions}</div>
                            <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-tighter opacity-70">Butir Pertanyaan</p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-xl bg-gradient-to-br from-primary/5 to-transparent overflow-hidden relative group">
                        <div className="absolute right-[-20px] top-[-20px] opacity-10 group-hover:scale-110 transition-transform">
                            <CheckCircle2 size={120} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-primary">Aspek</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{stats.aspects}</div>
                            <p className="text-xs text-muted-foreground font-bold mt-1 uppercase tracking-tighter opacity-70">Aspek Pengawasan</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mt-4 shadow-2xl border-none rounded-3xl overflow-hidden">
                    <CardHeader className="p-8 bg-muted/20 border-b relative">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg">
                                <Activity className="w-5 h-5" />
                            </div>
                            <div>
                                <CardTitle className="text-2xl font-black tracking-tight">Progres & Nilai Pengawasan</CardTitle>
                                <CardDescription className="font-medium">Pemantauan evaluasi mandiri (*self-assessment*) dari masing-masing instansi pelaksana.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    
                    <div className="p-5 border-b bg-muted/10 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 opacity-50" />
                            <Input 
                                placeholder="Cari nama instansi atau pelaksana..." 
                                className="pl-9 w-full rounded-xl text-sm border-muted-foreground/20 focus-visible:ring-primary shadow-sm h-10" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Select value={progressFilter} onValueChange={setProgressFilter}>
                                <SelectTrigger className="w-full md:w-[170px] rounded-xl text-xs font-bold h-10 border-muted-foreground/20 shadow-sm">
                                    <SelectValue placeholder="Semua Progres" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-xl">
                                    <SelectItem value="all" className="text-xs font-bold">Semua Progres</SelectItem>
                                    <SelectItem value="complete" className="text-xs font-bold">Selesai (100%)</SelectItem>
                                    <SelectItem value="in-progress" className="text-xs font-bold">Sedang Berjalan</SelectItem>
                                    <SelectItem value="not-started" className="text-xs font-bold">Belum Mulai</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Select value={sortValue} onValueChange={setSortValue}>
                                <SelectTrigger className="w-full md:w-[190px] rounded-xl text-xs font-bold h-10 border-muted-foreground/20 shadow-sm">
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl border-none shadow-xl">
                                    <SelectItem value="score-desc" className="text-xs font-bold">Skor Tertinggi</SelectItem>
                                    <SelectItem value="score-asc" className="text-xs font-bold">Skor Terendah</SelectItem>
                                    <SelectItem value="progress-desc" className="text-xs font-bold">Progres (Tinggi - Rendah)</SelectItem>
                                    <SelectItem value="progress-asc" className="text-xs font-bold">Progres (Rendah - Tinggi)</SelectItem>
                                    <SelectItem value="organization-asc" className="text-xs font-bold">Instansi (A - Z)</SelectItem>
                                    <SelectItem value="organization-desc" className="text-xs font-bold">Instansi (Z - A)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 border-none h-14">
                                            <TableHead className="pl-8 min-w-[180px] text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pelaksana</TableHead>
                                            <TableHead className="min-w-[280px] text-[10px] font-black uppercase tracking-widest text-muted-foreground">Instansi / Dinas</TableHead>
                                            <TableHead className="min-w-[220px] text-[10px] font-black uppercase tracking-widest text-muted-foreground">Progress Pengisian</TableHead>
                                            <TableHead className="text-right sticky right-[100px] bg-muted/60 backdrop-blur-md z-20 shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.1)] text-[10px] font-black uppercase tracking-widest text-muted-foreground">Skor Akhir</TableHead>
                                            <TableHead className="text-right sticky right-0 bg-muted/60 backdrop-blur-md z-20 w-[100px] pr-8 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Opsi Review</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {paginatedUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-24">
                                                    <div className="flex flex-col items-center justify-center gap-4">
                                                        <div className="p-4 bg-muted/30 rounded-full border border-dashed">
                                                            <Search className="size-8 text-muted-foreground/40" />
                                                        </div>
                                                        <p className="text-muted-foreground font-black text-sm uppercase tracking-widest opacity-60">Tidak ditemukan pelaksana yang sesuai</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            paginatedUsers.map((user: any) => (
                                                <TableRow key={user.id} className="hover:bg-primary/[0.03] group border-muted/10 transition-colors">
                                                    <TableCell className="pl-8 font-medium py-5">
                                                        <div className="text-sm font-black tracking-tight line-clamp-2 max-w-[200px]" title={user.name}>{user.name}</div>
                                                        <div className="text-[10px] text-muted-foreground font-bold opacity-70 truncate max-w-[200px]" title={user.email}>{user.email}</div>
                                                    </TableCell>
                                                    <TableCell className="py-5">
                                                        <div className="text-sm leading-tight text-foreground/80 font-black tracking-tight max-w-[320px] line-clamp-2" title={user.organization}>
                                                            {user.organization || '-'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 min-w-[240px]">
                                                        <div className="flex flex-col gap-2.5 pr-4">
                                                            <div className="flex items-center gap-3">
                                                                <Progress value={user.progress} className="h-2.5 flex-1 shadow-inner bg-muted" />
                                                                <span className="text-[10px] font-black w-9">{user.progress}%</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
                                                                    <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                                                                    <span className="text-[9px] font-black uppercase tracking-wider">Final: {user.completed_progress}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right sticky right-[100px] bg-background/98 backdrop-blur-sm group-hover:bg-primary/[0.01] z-10 shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.1)] py-5">
                                                        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-orange-500/10 text-orange-600 font-black text-xs border border-orange-500/20 shadow-sm">
                                                            {user.score} pt
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right sticky right-0 bg-background/98 backdrop-blur-sm group-hover:bg-primary/[0.01] z-10 pr-8 py-5">
                                                        <Link 
                                                            href={`/admin/review/${user.id}`}
                                                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md hover:shadow-lg active:scale-95"
                                                        >
                                                            Review <ChevronRight className="w-3 h-3" />
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Pagination Area */}
                        {totalPages > 0 && (
                            <div className="p-5 border-t bg-muted/10 flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-xs font-bold text-muted-foreground">
                                    Menampilkan <span className="text-foreground">{paginatedUsers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> - <span className="text-foreground">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> dari <span className="text-foreground">{filteredUsers.length}</span> pelaksana
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-9 px-4 text-xs font-bold rounded-xl bg-background shadow-sm hover:text-primary transition-colors" 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    >
                                        Sebelumnya
                                    </Button>
                                    
                                    <div className="px-3 text-xs font-bold text-muted-foreground flex items-center gap-1">
                                        <span className="text-foreground w-4 text-center">{currentPage}</span> / {totalPages}
                                    </div>

                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-9 px-4 text-xs font-bold rounded-xl bg-background shadow-sm hover:text-primary transition-colors" 
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    >
                                        Selanjutnya
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

import { Head, Link } from '@inertiajs/react';
import { Fragment } from 'react';
import { 
    Activity, 
    Users, 
    Building2, 
    ClipboardList, 
    CheckCircle2, 
    ChevronRight,
    Search,
    TrendingUp,
    FileText
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Dashboard({ stats, usersProgress }: any) {
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
                    <CardHeader className="p-8 bg-muted/20 border-b">
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
                    <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 border-none h-16">
                                            <TableHead className="pl-8 min-w-[180px] text-xs font-black uppercase tracking-widest">Pelaksana</TableHead>
                                            <TableHead className="min-w-[280px] text-xs font-black uppercase tracking-widest">Instansi / Dinas</TableHead>
                                            <TableHead className="min-w-[220px] text-xs font-black uppercase tracking-widest">Progress Pengisian</TableHead>
                                            <TableHead className="text-right sticky right-[100px] bg-muted/60 backdrop-blur-md z-20 shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.1)] text-xs font-black uppercase tracking-widest">Skor</TableHead>
                                            <TableHead className="text-right sticky right-0 bg-muted/60 backdrop-blur-md z-20 w-[100px] pr-8 text-xs font-black uppercase tracking-widest">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {usersProgress?.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center py-20">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <Search className="size-10 text-muted-foreground opacity-20" />
                                                        <p className="text-muted-foreground font-black text-sm uppercase tracking-widest opacity-60">Belum ada data progres pelaksana</p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            usersProgress?.map((user: any) => (
                                                <TableRow key={user.id} className="hover:bg-primary/[0.03] group border-muted/10 transition-colors">
                                                    <TableCell className="pl-8 font-medium py-6">
                                                        <div className="text-sm font-black tracking-tight line-clamp-2 max-w-[200px]" title={user.name}>{user.name}</div>
                                                        <div className="text-[10px] text-muted-foreground font-bold opacity-60 truncate max-w-[200px]" title={user.email}>{user.email}</div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div className="text-sm leading-tight text-foreground/80 font-black tracking-tight max-w-[320px] line-clamp-2" title={user.organization}>
                                                            {user.organization}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6 min-w-[240px]">
                                                        <div className="flex flex-col gap-2 pr-4">
                                                            <div className="flex items-center gap-3">
                                                                <Progress value={user.progress} className="h-2 flex-1 shadow-inner" />
                                                                <span className="text-[10px] font-black w-9">{user.progress}%</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                                    <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                                                                    <span className="text-[8px] font-black uppercase tracking-wider">Final: {user.completed_progress}%</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right sticky right-[100px] bg-background/98 backdrop-blur-sm group-hover:bg-primary/[0.01] z-10 shadow-[-4px_0_4px_-4px_rgba(0,0,0,0.1)] py-6">
                                                        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-xl bg-primary/10 text-primary font-black text-xs border border-primary/10">
                                                            {user.score} pt
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right sticky right-0 bg-background/98 backdrop-blur-sm group-hover:bg-primary/[0.01] z-10 pr-8 py-6">
                                                        <Link 
                                                            href={`/admin/review/${user.id}`}
                                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-foreground text-background text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-md active:scale-95"
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
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

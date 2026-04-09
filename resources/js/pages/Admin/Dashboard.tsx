import { Head, Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Building2, FileText, CheckSquare, Activity, ChevronRight } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

export default function AdminDashboard({ stats, usersProgress }: any) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-col gap-2 border-b pb-4">
                    <h1 className="text-3xl font-bold tracking-tight">Ikhtisar Statistik</h1>
                    <p className="text-muted-foreground">Ringkasan status pengawasan kearsipan dan progres pengisian pelaksana.</p>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-linear-to-br from-background to-primary/5 hover:border-primary/40 transition-all group overflow-hidden relative border-primary/10">
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity -rotate-12 translate-x-1 -translate-y-1">
                            <Users className="w-20 h-20" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Pelaksana</CardTitle>
                            <Users className="w-4 h-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats?.users || 0}</div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">User terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-linear-to-br from-background to-indigo-500/5 hover:border-indigo-500/40 transition-all group overflow-hidden relative border-indigo-500/10">
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity -rotate-12 translate-x-1 -translate-y-1">
                            <Building2 className="w-20 h-20 text-indigo-500" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Instansi</CardTitle>
                            <Building2 className="w-4 h-4 text-indigo-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-indigo-600">{stats?.organizations || 0}</div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Unit kerja & dinas</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-linear-to-br from-background to-emerald-500/5 hover:border-emerald-500/40 transition-all group overflow-hidden relative border-emerald-500/10">
                        <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity -rotate-12 translate-x-1 -translate-y-1">
                            <FileText className="w-20 h-20 text-emerald-500" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Aspek</CardTitle>
                            <FileText className="w-4 h-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-emerald-600">{stats?.aspects || 0}</div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Kategori evaluasi</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground hover:shadow-[0_20px_50px_rgba(var(--primary),0.3)] transition-all group overflow-hidden relative border-none">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-30 transition-opacity -rotate-12 translate-x-2 -translate-y-2">
                            <CheckSquare className="w-20 h-20 text-white" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-white">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest opacity-80">Total Soal</CardTitle>
                            <CheckSquare className="w-4 h-4 opacity-80 text-white" />
                        </CardHeader>
                        <CardContent className="text-white">
                            <div className="text-3xl font-black">{stats?.questions || 0}</div>
                            <p className="text-[10px] font-bold uppercase opacity-70">Butir instrumen aktif</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Table */}
                <Card className="mt-4 shadow-sm border-t-4 border-t-primary">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            <CardTitle>Progres & Nilai Pengawasan</CardTitle>
                        </div>
                        <CardDescription>Pemantauan evaluasi mandiri (*self-assessment*) dari masing-masing instansi pelaksana.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead>Pelaksana</TableHead>
                                        <TableHead>Instansi / Dinas</TableHead>
                                        <TableHead className="w-[30%]">Progress Pengisian</TableHead>
                                        <TableHead className="text-right">Skor Kumulatif</TableHead>
                                        <TableHead className="text-right">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {usersProgress?.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Belum ada data progres pelaksana. Pastikan sudah ada user pelaksana yang terdaftar.</TableCell>
                                        </TableRow>
                                    ) : (
                                        usersProgress?.map((user: any) => (
                                            <TableRow key={user.id} className="hover:bg-muted/30 group">
                                                <TableCell className="font-medium">
                                                    <div>{user.name}</div>
                                                    <div className="text-xs text-muted-foreground font-normal">{user.email}</div>
                                                </TableCell>
                                                <TableCell>{user.organization}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-3">
                                                            <Progress value={user.progress} className="h-1.5 flex-1" />
                                                            <span className="text-[10px] font-bold w-9">{user.progress}%</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                                                <div className="h-full bg-primary" style={{ width: `${user.completed_progress}%` }} />
                                                            </div>
                                                            <span className="text-[8px] font-black text-primary uppercase">Final: {user.completed_progress}%</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-sm">
                                                        {user.score} pt
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Link 
                                                        href={`/admin/review/${user.id}`}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-foreground text-background text-xs font-bold hover:bg-foreground/90 transition-colors opacity-0 group-hover:opacity-100"
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
                    </CardContent>
                </Card>

            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Admin Dashboard',
            href: dashboard(),
        },
    ],
};

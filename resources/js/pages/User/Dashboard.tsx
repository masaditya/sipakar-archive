import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ClipboardList, TrendingUp, Building2, Activity, AlertCircle, ArrowRight } from 'lucide-react';

export default function UserDashboard({ stats, organization }: any) {
    return (
        <>
            <Head title="Dashboard Pelaksana" />
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Selamat Datang, {organization?.name || 'Pelaksana'}</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">Monitor progres pengawasan internal kearsipan Anda di sini.</p>
                    </div>
                    <Button asChild size="lg" className="w-full sm:w-auto shadow-sm shrink-0">
                        <Link href="/questionnaire">
                            Isi Kuisioner Sekarang
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
                    <Link href="/questionnaire?filter=all" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                        <Card className="bg-linear-to-br from-background to-primary/5 border-primary/20 hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 group shadow-sm overflow-hidden relative cursor-pointer h-full">
                            <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12 translate-x-1 -translate-y-1">
                                <ClipboardList className="w-24 h-24" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Total Soal</CardTitle>
                                <ClipboardList className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">{stats.totalQuestions}</div>
                                <p className="text-xs font-bold text-muted-foreground uppercase opacity-60">Butir evaluasi mandiri</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Link href="/questionnaire?filter=answered" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                        <Card className="bg-linear-to-br from-background to-primary/10 border-primary/20 hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 group shadow-sm overflow-hidden relative cursor-pointer h-full">
                            <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12 translate-x-1 -translate-y-1">
                                <CheckCircle2 className="w-24 h-24" />
                            </div>
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">Terjawab</CardTitle>
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-primary">{stats.totalAnswered}</div>
                                <p className="text-xs font-bold text-muted-foreground uppercase opacity-60">{stats.totalQuestions - stats.totalAnswered} soal tersisa</p>
                            </CardContent>
                        </Card>
                    </Link>

                    <Card className="bg-linear-to-br from-background to-primary/5 border-primary/20 hover:border-primary transition-all duration-300 group shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-3 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12 translate-x-1 -translate-y-1">
                            <TrendingUp className="w-24 h-24" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Progres</CardTitle>
                            <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black">{stats.progress}%</div>
                            <Progress value={stats.progress} className="mt-3 h-1.5" />
                        </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground hover:shadow-[0_20px_50px_rgba(var(--primary),.3)] transition-all duration-300 group shadow-sm overflow-hidden relative border-none">
                        <div className="absolute top-0 right-0 p-3 opacity-[0.1] group-hover:opacity-[0.2] transition-opacity -rotate-12 translate-x-2 -translate-y-2">
                            <Activity className="w-24 h-24 text-white" />
                        </div>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Estimasi Skor</CardTitle>
                            <div className="px-1.5 py-0.5 bg-white/20 text-[8px] rounded-md font-black uppercase tracking-tighter shadow-sm backdrop-blur">MAX 100</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{stats.totalScore}</div>
                            <p className="text-xs font-bold opacity-70 uppercase mt-1">Berdasarkan jawaban aktif</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
                    <Link href="/questionnaire?filter=completed" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                        <Card className="bg-primary/5 border-primary/20 hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full group">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                                    <div className="p-1 rounded-full bg-primary/20 group-hover:bg-primary group-hover:text-white transition-colors"><CheckCircle2 className="w-3 h-3 group-hover:stroke-white"/></div>
                                    Selesai / Finalisasi
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black">{stats.completedCount}</div>
                                <p className="text-xs font-bold text-muted-foreground uppercase mt-1">Dihitung dalam nilai akhir</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/questionnaire?filter=submitted" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl">
                        <Card className="bg-amber-500/5 border-amber-500/20 hover:border-amber-500 hover:shadow-md hover:-translate-y-1 hover:shadow-amber-500/10 transition-all duration-300 cursor-pointer h-full group">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold uppercase text-amber-600 tracking-widest flex items-center gap-2">
                                    <Activity className="w-3 h-3 group-hover:scale-110 transition-transform"/>
                                    Diajukan (Review)
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-amber-600">{stats.submittedCount}</div>
                                <p className="text-xs font-bold text-muted-foreground uppercase mt-1">Sedang ditinjau oleh admin</p>
                            </CardContent>
                        </Card>
                    </Link>
                    <Link href="/questionnaire?filter=revision" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive rounded-xl">
                        <Card className="bg-destructive/5 border-destructive/20 hover:border-destructive hover:shadow-md hover:-translate-y-1 hover:shadow-destructive/10 transition-all duration-300 cursor-pointer h-full group">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold uppercase text-destructive tracking-widest flex items-center gap-2">
                                    <AlertCircle className="w-3 h-3 group-hover:scale-110 transition-transform"/>
                                    Butuh Perbaikan
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-black text-destructive">{stats.revisionCount}</div>
                                <p className="text-xs font-bold text-muted-foreground uppercase mt-1">Segera perbaiki bukti dukung</p>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <Card className="shadow-sm border-l-4 border-l-primary bg-muted/30">
                    <CardHeader>
                        <CardTitle className="text-lg">Instruksi Pengisian</CardTitle>
                        <CardDescription>
                            Silakan buka menu <strong>"Kuisioner"</strong> di sidebar untuk mulai mengisi jawaban dan mengunggah bukti dukung. 
                            Pastikan setiap jawaban didukung oleh file bukti yang relevan sesuai dengan petunjuk yang diberikan pada tiap soal.
                            Status <strong>"Selesai"</strong> berarti jawaban Anda sudah difinalisasi oleh tim pengawas.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        </>
    );
}

UserDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
    ],
};

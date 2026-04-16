import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ClipboardList, TrendingUp, Building2, Activity, AlertCircle, ArrowRight, FileText, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from 'react';
import HelpFloatingButton from '@/components/help-floating-button';

export default function UserDashboard({ stats, organization }: any) {
    const [rhasModalOpen, setRhasModalOpen] = useState(false);
    const [rhasForm, setRhasForm] = useState({
        type: 'UP',
        up_name: 'Bidang ',
        ttd2_jabatan: `KEPALA ${organization?.name?.toUpperCase() || 'INSTANSI'}`,
        ttd2_nama: '',
        ttd2_pangkat: '',
        ttd2_nip: '',
    });

    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportForm, setReportForm] = useState({
        up_name: 'Bidang ',
        opd_name: organization?.name || '',
        ttd2_jabatan: `KEPALA ${organization?.name?.toUpperCase() || 'INSTANSI'}`,
        ttd2_nama: '',
        ttd2_pangkat: '',
        ttd2_nip: '',
    });

    return (
        <>
            <Head title="Dashboard Pelaksana" />
            <HelpFloatingButton
                tutorials={[
                    {
                        id: 1,
                        title: 'Pengenalan Dashboard dan mulai pengisian ASKI',
                        description: 'Panduan lengkap monitoring dashboard dan mulai pengisian ASKI.',
                        videoUrl: '/videos/dashboard.mp4'
                    },
                    {
                        id: 2,
                        title: 'Cara mengganti password',
                        description: 'Panduan lengkap cara mengganti password.',
                        videoUrl: '/videos/update-password.mp4'
                    }
                ]}
            />
            <div className="flex flex-col gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Selamat Datang, {organization?.name || 'Pelaksana'}</h1>
                        <p className="text-muted-foreground text-sm sm:text-base">Monitor progres pengawasan internal kearsipan Anda di sini.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 shrink-0 w-full lg:w-auto">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => {
                                setRhasForm(prev => ({ ...prev, type: 'UP', up_name: 'Bidang ' }));
                                setRhasModalOpen(true);
                            }}
                            className="w-full sm:w-auto border-blue-500/30 text-blue-600 bg-blue-50/50 hover:bg-blue-100/50 shadow-sm font-bold"
                        >
                            <FileText className="w-4 h-4 mr-2" /> Cetak RHAS
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setReportModalOpen(true)}
                            className="w-full sm:w-auto border-primary/30 text-primary bg-primary/5 hover:bg-primary/10 shadow-sm font-bold"
                        >
                            <Download className="w-4 h-4 mr-2" /> LAPORAN HASIL AKHIR
                        </Button>
                        <Button asChild size="lg" className="w-full sm:w-auto shadow-sm shrink-0">
                            <Link href="/questionnaire">
                                Isi Kuisioner Sekarang
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
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
                            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Estimasi Nilai Akhir</CardTitle>
                            <div className="px-1.5 py-0.5 bg-white/20 text-[8px] rounded-md font-black uppercase tracking-tighter shadow-sm backdrop-blur">MAX 100</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black">{stats.totalScore}</div>
                            <p className="text-xs font-bold opacity-70 uppercase mt-1">Berdasarkan seluruh jawaban terisi</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3">
                    <Link href="/questionnaire?filter=completed" className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                        <Card className="bg-primary/5 border-primary/20 hover:border-primary hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full group">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-bold uppercase text-primary tracking-widest flex items-center gap-2">
                                    <div className="p-1 rounded-full bg-primary/20 group-hover:bg-primary group-hover:text-white transition-colors"><CheckCircle2 className="w-3 h-3 group-hover:stroke-white" /></div>
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
                                    <Activity className="w-3 h-3 group-hover:scale-110 transition-transform" />
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
                                    <AlertCircle className="w-3 h-3 group-hover:scale-110 transition-transform" />
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

            {/* Modal Input RHAS */}
            <Dialog open={rhasModalOpen} onOpenChange={setRhasModalOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto w-[95vw] rounded-2xl mx-auto border-none p-0">
                    <DialogHeader className="p-6 pb-2 border-b bg-blue-50/50">
                        <DialogTitle className="text-xl font-black text-blue-700">Cetak Risalah Hasil Audit Sementara (RHAS)</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border">
                                <h3 className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                    Tipe RHAS
                                </h3>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={rhasForm.type === 'UP' ? 'default' : 'outline'}
                                        className="flex-1 font-bold"
                                        onClick={() => setRhasForm({ ...rhasForm, type: 'UP', up_name: 'Bidang ' })}
                                    >RHAS UP</Button>
                                    <Button
                                        type="button"
                                        variant={rhasForm.type === 'UK' ? 'default' : 'outline'}
                                        className="flex-1 font-bold"
                                        onClick={() => setRhasForm({ ...rhasForm, type: 'UK', up_name: 'Sekretariat ' + (organization?.name || '') })}
                                    >RHAS UK</Button>
                                </div>
                            </div>

                            <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border">
                                <h3 className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                                    <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                    Informasi Unit
                                </h3>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">{rhasForm.type === 'UP' ? 'Nama Unit Pengolah (UP)' : 'Nama Unit Kearsipan (UK)'}</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" value={rhasForm.up_name} onChange={e => setRhasForm({ ...rhasForm, up_name: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border">
                            <h3 className="font-black text-xs uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                                Informasi Penandatangan (Pihak Instansi)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground">Jabatan</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm" value={rhasForm.ttd2_jabatan} onChange={e => setRhasForm({ ...rhasForm, ttd2_jabatan: e.target.value })} />
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground">Nama Lengkap</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm" value={rhasForm.ttd2_nama} onChange={e => setRhasForm({ ...rhasForm, ttd2_nama: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Pangkat/Golongan</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm" value={rhasForm.ttd2_pangkat} onChange={e => setRhasForm({ ...rhasForm, ttd2_pangkat: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">NIP</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm tracking-wider" value={rhasForm.ttd2_nip} onChange={e => setRhasForm({ ...rhasForm, ttd2_nip: e.target.value })} />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="p-6 bg-muted/40 border-t flex flex-col sm:flex-row justify-end gap-3 mt-auto">
                        <Button variant="outline" className="rounded-xl w-full sm:w-auto h-11 px-8 font-bold" onClick={() => setRhasModalOpen(false)}>Batal</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-full sm:w-auto h-11 px-8 font-bold shadow-md hover:shadow-lg transition-all" onClick={() => {
                            const params = new URLSearchParams(rhasForm as any).toString();
                            window.open(`/dashboard/rhas.pdf?download=1&${params}`, '_blank');
                            setRhasModalOpen(false);
                        }}>
                            <Download className="w-4 h-4 mr-2" />
                            Unduh PDF RHAS
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            {/* Modal Input Laporan PDF */}
            <Dialog open={reportModalOpen} onOpenChange={setReportModalOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto w-[95vw] rounded-2xl mx-auto border-none p-0">
                    <DialogHeader className="p-6 pb-2 border-b bg-muted/30">
                        <DialogTitle className="text-xl font-black">Konfigurasi Laporan Hasil Akhir (BAB 3)</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 p-6">
                        <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border">
                            <h3 className="font-black text-xs uppercase tracking-widest text-primary flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-primary rounded-full"></div>
                                Informasi Organisasi (Objek Pemeriksaan)
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Nama Unit Pengolah (UP)</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" value={reportForm.up_name} onChange={e => setReportForm({ ...reportForm, up_name: e.target.value })} placeholder="Contoh: Bidang Kesehatan Masyarakat" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Nama Organisasi (UK/OPD)</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary" value={reportForm.opd_name} onChange={e => setReportForm({ ...reportForm, opd_name: e.target.value })} placeholder="Contoh: Dinas Kesehatan" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 bg-muted/20 p-5 rounded-2xl border">
                            <h3 className="font-black text-xs uppercase tracking-widest text-blue-600 flex items-center gap-2">
                                <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
                                Informasi Penandatangan Pihak Instansi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground">Jabatan</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm" value={reportForm.ttd2_jabatan} onChange={e => setReportForm({ ...reportForm, ttd2_jabatan: e.target.value })} />
                                </div>
                                <div className="space-y-2 col-span-1 md:col-span-2">
                                    <label className="text-xs font-bold text-muted-foreground">Nama Lengkap</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm" value={reportForm.ttd2_nama} onChange={e => setReportForm({ ...reportForm, ttd2_nama: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">Pangkat/Golongan</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm" value={reportForm.ttd2_pangkat} onChange={e => setReportForm({ ...reportForm, ttd2_pangkat: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted-foreground">NIP</label>
                                    <input className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-1 text-sm shadow-sm tracking-wider" value={reportForm.ttd2_nip} onChange={e => setReportForm({ ...reportForm, ttd2_nip: e.target.value })} />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="p-6 bg-muted/40 border-t flex flex-col sm:flex-row justify-end gap-3 mt-auto">
                        <Button variant="outline" className="rounded-xl w-full sm:w-auto h-11 px-8 font-bold" onClick={() => setReportModalOpen(false)}>Batal</Button>
                        <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl w-full sm:w-auto h-11 px-8 font-bold shadow-md hover:shadow-lg transition-all" onClick={() => {
                            const params = new URLSearchParams(reportForm as any).toString();
                            window.open(`/dashboard/report.pdf?download=1&${params}`, '_blank');
                            setReportModalOpen(false);
                        }}>Cetak dan Unduh PDF</Button>
                    </div>
                </DialogContent>
            </Dialog>
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

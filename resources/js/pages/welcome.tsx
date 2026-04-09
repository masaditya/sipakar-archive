import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login } from '@/routes';
import { CheckCircle2, ShieldCheck, FileSearch, BarChart3, ChevronRight, Zap, Download, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Welcome() {
    const { auth } = usePage<any>().props;

    return (
        <>
            <Head title="SIPAKAR - Sistem Pengawasan Kearsipan" />
            
            <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
                {/* Navbar */}
                <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-black tracking-tight uppercase">SIPAKAR</span>
                        </div>
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button variant="default" className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                                        DASHBOARD <ChevronRight className="ml-1 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={login()}>
                                    <Button variant="default" className="rounded-full px-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 py-6">
                                        MASUK SISTEM
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </nav>

                <main className="pt-16">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden px-6 pt-24 pb-32 lg:px-8 lg:pt-32 lg:pb-48">
                        <div className="absolute inset-0 -z-10 overflow-hidden">
                            <div className="absolute top-0 left-1/2 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)] sm:left-[calc(50%-30rem)] lg:left-[calc(50%-36rem)]" aria-hidden="true">
                                <div className="absolute aspect-1108/632 w-277 bg-linear-to-r from-primary/20 to-teal-400/20 opacity-20"></div>
                            </div>
                        </div>

                        <div className="mx-auto max-w-4xl text-center">
                            <div className="mb-8 flex justify-center">
                                <div className="relative rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-primary ring-1 ring-primary/20 bg-primary/5 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
                                    Platform Pengawasan Kearsipan v2.0
                                </div>
                            </div>
                            <h1 className="text-5xl font-black tracking-tight sm:text-7xl bg-linear-to-b from-foreground to-foreground/60 bg-clip-text text-transparent leading-[1.1] pb-2">
                                Wujudkan Tata Kelola Kearsipan yang <span className="text-primary italic">Akuntabel.</span>
                            </h1>
                            <p className="mt-8 text-lg font-medium leading-relaxed text-muted-foreground max-w-2xl mx-auto">
                                SIPAKAR mempermudah instansi dalam melakukan penilaian mandiri, management bukti dukung, 
                                hingga audit kearsipan secara digital dan terintegrasi.
                            </p>
                            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
                                <Link href={auth.user ? dashboard() : login()}>
                                    <Button className="h-14 rounded-2xl px-10 text-sm font-black uppercase tracking-widest shadow-[0_20px_50px_rgba(var(--primary),0.3)] transition-all hover:scale-105 active:scale-95">
                                        {auth.user ? 'BUKA DASHBOARD' : 'Mulai Penilaian Sekarang'}
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                                    <CheckCircle2 className="h-4 w-4 text-primary" /> Terpusat & Terenkripsi
                                </div>
                            </div>
                        </div>

                        {/* Floating Decorative Elements */}
                        <div className="mt-20 flex justify-center px-4 animate-in fade-in zoom-in-95 duration-1000 delay-300">
                            <div className="relative rounded-[2.5rem] border bg-card/50 p-4 backdrop-blur-2xl shadow-2xl overflow-hidden group">
                                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent"></div>
                                <div className="relative rounded-3xl border border-white/10 bg-background overflow-hidden flex flex-col h-[400px] w-full max-w-5xl shadow-inner">
                                     {/* Mockup Dashboard Sidebar */}
                                     <div className="flex flex-1">
                                         <div className="w-16 sm:w-60 border-r bg-muted/20 p-4 hidden sm:flex flex-col gap-4">
                                             <div className="h-8 w-32 bg-primary/20 rounded-lg animate-pulse"></div>
                                             <div className="h-4 w-40 bg-muted rounded-full"></div>
                                             <div className="h-4 w-32 bg-muted rounded-full"></div>
                                             <div className="mt-auto h-12 w-full bg-muted rounded-xl"></div>
                                         </div>
                                         <div className="flex-1 p-8 space-y-8">
                                             <div className="flex justify-between items-center">
                                                 <div className="space-y-2">
                                                     <div className="h-3 w-20 bg-primary/30 rounded-full"></div>
                                                     <div className="h-8 w-64 bg-foreground/10 rounded-xl"></div>
                                                 </div>
                                                 <div className="h-10 w-10 rounded-full bg-muted"></div>
                                             </div>
                                             <div className="grid grid-cols-3 gap-6">
                                                 <div className="h-32 rounded-3xl border bg-muted/10 p-4 flex flex-col justify-between">
                                                     <div className="h-2 w-12 bg-muted rounded"></div>
                                                     <div className="h-8 w-16 bg-primary/20 rounded"></div>
                                                 </div>
                                                 <div className="h-32 rounded-3xl border bg-muted/10 p-4 flex flex-col justify-between">
                                                     <div className="h-2 w-12 bg-muted rounded"></div>
                                                     <div className="h-8 w-16 bg-primary/20 rounded"></div>
                                                 </div>
                                                 <div className="h-32 rounded-3xl border bg-primary/5 border-primary/20 p-4 flex flex-col justify-between">
                                                     <div className="h-2 w-12 bg-primary/30 rounded"></div>
                                                     <div className="h-8 w-16 bg-primary/40 rounded"></div>
                                                 </div>
                                             </div>
                                             <div className="h-40 rounded-3xl border border-dashed border-muted flex items-center justify-center">
                                                 <div className="flex flex-col items-center gap-2 opacity-20">
                                                     <FileSearch className="w-10 h-10" />
                                                     <span className="text-[10px] font-black uppercase tracking-widest">Preview Form Kuisioner</span>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-24 bg-muted/20">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center mb-16">
                                <h2 className="text-base font-black text-primary uppercase tracking-[0.3em] mb-4">Fitur Utama</h2>
                                <p className="text-3xl font-black tracking-tight sm:text-4xl">Semua yang Anda butuhkan untuk audit kearsipan.</p>
                            </div>
                            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="relative flex flex-col gap-6 p-8 rounded-4xl bg-card border hover:border-primary/40 transition-all hover:shadow-2xl group cursor-default">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-500">
                                        <Zap className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">Penilaian Mandiri Cepat</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed font-medium">Isi kuisioner pengawasan kearsipan dengan antarmuka yang intuitif dan pembobotan nilai otomatis.</p>
                                    </div>
                                </div>

                                <div className="relative flex flex-col gap-6 p-8 rounded-4xl bg-card border hover:border-primary/40 transition-all hover:shadow-2xl group cursor-default">
                                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors duration-500">
                                        <Download className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">Management Bukti Dukung</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed font-medium">Unggah file bukti dukung langsung pada setiap butir pertanyaan dengan dukungan berbagai format dokumen.</p>
                                    </div>
                                </div>

                                <div className="relative flex flex-col gap-6 p-8 rounded-4xl bg-card border hover:border-primary/40 transition-all hover:shadow-2xl group cursor-default">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                                        <BarChart3 className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">Analitik & Statistik</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed font-medium">Pantau progres pengisian dan hasil penilaian sementara secara real-time melalui dashboard visual yang informatif.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Stats/Safety Section */}
                    <section className="py-24 overflow-hidden">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div className="space-y-10">
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black tracking-tight leading-tight">Privasi Data & <span className="text-primary italic">Keamanan Terjamin.</span></h2>
                                        <p className="text-muted-foreground font-medium leading-relaxed">Seluruh dokumen bukti dukung dan hasil penilaian disimpan dengan enkripsi serta protokol akses yang ketat hanya untuk tim pengawas.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="p-6 rounded-3xl bg-muted/30 border">
                                            <Lock className="w-6 h-6 text-primary mb-3" />
                                            <div className="text-2xl font-black">E2EE</div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Encryption Ready</div>
                                        </div>
                                        <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20">
                                            <ShieldCheck className="w-6 h-6 text-primary mb-3" />
                                            <div className="text-2xl font-black">100%</div>
                                            <div className="text-[10px] font-bold uppercase tracking-widest text-primary/60">Compliance Level</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-teal-400/20 blur-3xl opacity-30 animate-pulse"></div>
                                    <div className="relative rounded-[3rem] border border-white/10 bg-linear-to-br from-card to-muted/20 p-12 shadow-2xl backdrop-blur-xl flex items-center justify-center h-[450px]">
                                         <div className="text-center space-y-6">
                                             <div className="inline-flex h-24 w-24 items-center justify-center rounded-4xl bg-primary shadow-2xl shadow-primary/40 text-primary-foreground transform rotate-12">
                                                 <CheckCircle2 className="h-12 w-12" />
                                             </div>
                                             <div className="space-y-2">
                                                 <h3 className="text-3xl font-black uppercase italic tracking-tighter">Verified Audit</h3>
                                                 <p className="text-xs uppercase font-black tracking-[0.4em] text-muted-foreground">Standard Archival Quality</p>
                                             </div>
                                         </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t py-12 bg-background">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                                <span className="font-black tracking-widest uppercase">SIPAKAR</span>
                            </div>
                            <div className="text-[10px] font-black tracking-widest text-muted-foreground uppercase text-center sm:text-left">
                                © 2026 SIPAKAR - SISTEM PENGAWASAN KEARSIPAN. SELURUH HAK CIPTA DILINDUNGI.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

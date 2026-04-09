import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { ShieldCheck } from 'lucide-react';

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage<any>().props;

    return (
        <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[550px_1fr] overflow-hidden bg-background">
            {/* Left Side: Form */}
            <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-20 relative z-10 w-full">
                <div className="mx-auto w-full max-w-[400px] space-y-8">
                    <div className="flex flex-col gap-6">
                        <Link href={home()} className="flex items-center gap-2.5 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-transform group-hover:scale-105">
                                <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-black tracking-tight uppercase">{name}</span>
                        </Link>
                        
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tight text-foreground/90">{title}</h1>
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed italic opacity-80">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {children}
                    </div>

                    <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/40 mt-12">
                         © 2026 {name} - Sistem Pengawasan Kearsipan
                    </p>
                </div>
            </div>

            {/* Right Side: Decorative */}
            <div className="relative hidden lg:flex flex-col items-center justify-center bg-muted overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-background to-primary/5 z-0" />
                
                {/* Patterns/Gradients */}
                <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-teal-400/20 rounded-full blur-[100px] mix-blend-multiply delay-700 animate-pulse" />

                <div className="relative z-10 p-12 text-center space-y-8 max-w-xl">
                    <div className="space-y-4">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-background shadow-2xl text-primary transform rotate-12 mb-4">
                             <ShieldCheck className="h-10 w-10" />
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter leading-none uppercase italic text-foreground/90">
                           Transformasi Digital <br /> <span className="text-primary italic">Kearsipan.</span>
                        </h2>
                        <p className="text-lg font-medium text-muted-foreground/80 leading-relaxed max-w-md mx-auto">
                            Tingkatkan akuntabilitas dan efisiensi pengawasan kearsipan dengan platform penilaian mandiri yang modern.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-12">
                        <div className="p-6 rounded-3xl bg-background/50 border backdrop-blur-sm">
                             <div className="text-3xl font-black text-primary mb-1">2026</div>
                             <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Compliance Standard</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-background/50 border backdrop-blur-sm">
                             <div className="text-3xl font-black text-primary mb-1">E2EE</div>
                             <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Security Level</div>
                        </div>
                    </div>
                </div>

                {/* Glass Card Mockup */}
                <div className="absolute bottom-[-100px] right-[-100px] w-full max-w-2xl h-[400px] rounded-[3rem] border border-white/20 bg-white/5 backdrop-blur-xl rotate-15 shadow-2xl opacity-50" />
            </div>
        </div>
    );
}

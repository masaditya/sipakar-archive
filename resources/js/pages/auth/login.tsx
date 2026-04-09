import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Lock, User } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({
    status,
    canResetPassword,
}: Props) {
    return (
        <>
            <Head title="Masuk ke Akun" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-8"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-6">
                            {/* Username Field */}
                            <div className="space-y-2 group">
                                <Label htmlFor="username" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Username</Label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <Input
                                        id="username"
                                        type="text"
                                        name="username"
                                        className="h-14 pl-12 rounded-2xl border-muted bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="username"
                                        placeholder="Ketik username anda..."
                                    />
                                </div>
                                <InputError message={errors.username} />
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2 group">
                                <div className="flex items-center justify-between ml-1">
                                    <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                                            tabIndex={5}
                                        >
                                            Lupa Password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors z-10">
                                        <Lock className="h-4 w-4" />
                                    </div>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        className="h-14 pl-12 rounded-2xl border-muted bg-muted/20 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all font-bold"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3 ml-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="rounded-lg border-muted-foreground/20"
                                />
                                <Label htmlFor="remember" className="text-xs font-bold text-muted-foreground cursor-pointer">Ingat saya di perangkat ini</Label>
                            </div>

                            <Button
                                type="submit"
                                className="h-14 w-full rounded-2xl bg-primary text-xs font-black uppercase tracking-[0.3em] shadow-[0_15px_40px_-5px_rgba(var(--primary),0.3)] hover:shadow-[0_20px_50px_-5px_rgba(var(--primary),0.4)] transition-all active:scale-95"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? <Spinner className="mr-2" /> : null}
                                MASUK SISTEM
                            </Button>
                        </div>
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center text-xs font-black uppercase tracking-widest text-emerald-600">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: 'Selamat Datang Kembali',
    description: 'Silakan masukkan username dan password Anda untuk masuk ke dashboard SIPAKAR.',
};

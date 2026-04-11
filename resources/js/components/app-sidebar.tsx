import { Link, usePage, router } from '@inertiajs/react';
import { 
    BookOpen, 
    FolderGit2, 
    LayoutGrid, 
    Users, 
    Building2, 
    ClipboardList, 
    Settings, 
    Database, 
    Search,
    FileText,
    BarChart3
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import { edit as editAppearance } from '@/routes/appearance';

export function AppSidebar() {
    const { auth } = usePage<any>().props;
    const user = auth?.user;

    const commonNav = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    const adminNav = [
        {
            title: 'Monitoring',
            icon: BarChart3,
            children: [
                { title: 'Daftar Penilaian', href: '/admin/assessments' },
                { title: 'Statistik Instansi', href: '/dashboard' },
            ]
        },
        {
            title: 'Data Master',
            icon: Database,
            children: [
                { title: 'User & Pengguna', href: '/admin/users' },
                { title: 'Instansi / Organisasi', href: '/admin/organizations' },
            ]
        },
        {
            title: 'Pengaturan',
            icon: Settings,
            children: [
                { title: 'Manajemen Kuisioner', href: '/admin/assessments' },
                { title: 'Preferensi Sistem', href: '#' },
            ]
        }
    ];

    const userNav = [
        {
            title: 'Pelaksanaan Audit',
            icon: Search,
            children: [
                { title: 'Form Kuisioner', href: '/questionnaire' },
                { title: 'Hasil Penilaian', href: '/dashboard' },
            ]
        },
        {
            title: 'Pengaturan',
            icon: Settings,
            children: [
                { title: 'Profil Akun', href: editProfile() },
                { title: 'Keamanan', href: editSecurity() },
                { title: 'Tampilan', href: editAppearance() },
            ]
        }
    ];

    return (
        <Sidebar collapsible="icon" className="border-r-0 shadow-2xl">
            <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border/30 bg-sidebar/50 backdrop-blur-md overflow-hidden shrink-0">
                <SidebarMenu className="overflow-hidden">
                    <SidebarMenuItem className="flex items-center justify-center">
                        <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-transparent">
                            <Link href={dashboard()} prefetch className="flex items-center justify-center overflow-hidden">
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="py-2 space-y-4 overflow-hidden">
                {/* Period Switcher Section */}
                <div className="px-4 py-2">
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10 shadow-inner">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2 block px-1">Periode Pengawasan</label>
                        <select 
                            className="w-full px-4 bg-sidebar border-none text-xs font-bold text-white focus:ring-1 focus:ring-primary rounded-lg h-9 appearance-none cursor-pointer"
                            value={usePage<any>().props.current_period?.id || ''}
                            onChange={(e) => router.post('/admin/switch-period', { period_id: e.target.value })}
                        >
                            {usePage<any>().props.periods?.map((p: any) => (
                                <option key={p.id} value={p.id} className="bg-sidebar-accent text-sidebar-foreground">TA {p.name} {p.is_active ? '(Aktif)' : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <NavMain label="Utama" items={commonNav} />
                
                {user?.role === 'admin' && (
                    <>
                        <SidebarSeparator />
                        <NavMain label="Administrasi" items={adminNav} />
                    </>
                )}

                {user?.role === 'user' && (
                    <>
                        <SidebarSeparator />
                        <NavMain label="Audit Internal" items={userNav} />
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border/30 bg-sidebar/50">
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

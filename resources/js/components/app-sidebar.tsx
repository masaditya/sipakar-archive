import { Link, usePage } from '@inertiajs/react';
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
            title: 'Dokumentasi',
            href: '#',
            icon: FileText,
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

            <SidebarContent className="py-4 space-y-4 overflow-hidden">
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

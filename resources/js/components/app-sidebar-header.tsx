import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border bg-sidebar text-sidebar-foreground px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 shadow-sm z-10 font-semibold uppercase tracking-tight">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground opacity-80" />
                <div className="h-4 w-px bg-sidebar-border mx-2" />
                <Breadcrumbs 
                    breadcrumbs={breadcrumbs} 
                    className="text-sidebar-foreground/80 [&_a]:text-sidebar-foreground/80 [&_a:hover]:text-sidebar-foreground [&_span[aria-current=page]]:text-sidebar-foreground [&_li:last-child]:text-sidebar-foreground font-bold"
                />
            </div>
        </header>
    );
}

import { Link } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useCurrentUrl } from '@/hooks/use-current-url';
import { ChevronRight } from 'lucide-react';
import type { NavItem } from '@/types';

export function NavMain({ label = "Platform", items = [] }: { label?: string, items: any[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-2">
            <SidebarGroupLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/50 mb-2 px-4">{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    
                    if (!hasChildren) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isCurrentUrl(item.href)}
                                    tooltip={item.title}
                                    className="h-10 px-4 rounded-xl hover:bg-sidebar-accent transition-all duration-300"
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon className="size-4 opacity-70" />}
                                        <span className="font-bold tracking-tight">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={item.children.some((child: any) => isCurrentUrl(child.href))}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton 
                                        tooltip={item.title}
                                        className="h-10 px-4 rounded-xl hover:bg-sidebar-accent transition-all duration-300"
                                    >
                                        {item.icon && <item.icon className="size-4 opacity-70" />}
                                        <span className="font-bold tracking-tight">{item.title}</span>
                                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 opacity-40" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub className="border-sidebar-border/50 ml-6 pl-2 py-1 space-y-1">
                                        {item.children.map((subItem: any) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <SidebarMenuSubButton asChild isActive={isCurrentUrl(subItem.href)}>
                                                    <Link href={subItem.href} className="text-xs font-semibold py-2">
                                                        <span>{subItem.title}</span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}

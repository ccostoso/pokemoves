import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu } from "@/components/ui/sidebar"

export default function AccountSidebar() {
    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>
                {/* logo + app name */}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Pages</SidebarGroupLabel>
                    <SidebarMenu>
                        {/* nav items with icons + chevrons */}
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Recipients</SidebarGroupLabel>
                    <SidebarMenu>
                        {/* avatar items */}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {/* John Doe / Admin row */}
            </SidebarFooter>
        </Sidebar>
    )
}
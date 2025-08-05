"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/store/auth-context"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Home, Users, Video, CreditCard, Settings, LogOut, Play, ChevronUp } from "lucide-react"

const navigationItems = [
    {
        title: "Overview",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Analyze",
        url: "/dashboard/analyze",
        icon: Users,
    },
    {
        title: "Record",
        url: "/dashboard/record",
        icon: Video,
    },
    {
        title: "Subscribe",
        url: "/subscribe",
        icon: CreditCard,
    },
]

export function DashboardSidebar() {
    const pathname = usePathname()
    const { user, logout } = useAuth()
    const { setOpen, setOpenMobile } = useSidebar()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center space-x-2 px-2 py-2">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold group-data-[collapsible=icon]:hidden">Tactical Button</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) => (
                                <SidebarMenuItem
                                    key={item.title}
                                    onClick={() => {
                                        setOpen(false)
                                        setOpenMobile(false)
                                    }}
                                >
                                    <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton tooltip={user?.fullName}>
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-xs">{user?.fullName?.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="truncate">{user?.fullName}</span>
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                                <DropdownMenuItem>
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={logout}>
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}

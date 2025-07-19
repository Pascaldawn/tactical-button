"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./mode-toggle"
import { Bell } from "lucide-react"

export function DashboardHeader() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-end space-x-2">
                <Button variant="ghost" size="icon">
                    <Bell className="h-4 w-4" />
                </Button>
                <ModeToggle />
            </div>
        </header>
    )
}

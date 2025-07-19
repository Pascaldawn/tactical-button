"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/store/auth-context"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/login")
        }
    }, [user, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return null
    }

    return (
        <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full">
                <DashboardSidebar />
                <SidebarInset className="flex-1 flex flex-col min-w-0">
                    <DashboardHeader />
                    <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    )
}

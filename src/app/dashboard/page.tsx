"use client"
// Main Page
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/store/auth-context"
import { BarChart3, Play, Users, Video, Zap, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
    const { user } = useAuth()

    const quickActions = [
        {
            title: "Analyze Tactics",
            description: "Create and analyze tactical formations",
            icon: Users,
            href: "/dashboard/analyze",
            color: "text-blue-600",
        },
        {
            title: "Record Session",
            description: "Record tactics with webcam overlay",
            icon: Video,
            href: "/dashboard/record",
            color: "text-green-600",
        },
    ]

    return (
        <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex flex-col space-y-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.fullName}!</h1>
                    <p className="text-muted-foreground text-sm md:text-base">Ready to create some amazing tactical content?</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 md:gap-4">
                    <Badge variant="secondary" className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>Pro Plan</span>
                    </Badge>
                    <Badge variant="outline">5 videos this month</Badge>
                </div>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg md:text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {quickActions.map((action) => (
                        <Card key={action.title} className="hover:shadow-md transition-shadow cursor-pointer">
                            <Link href={action.href}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center space-x-3">
                                        <action.icon className={`w-5 h-5 md:w-6 md:h-6 ${action.color}`} />
                                        <CardTitle className="text-base md:text-lg">{action.title}</CardTitle>
                                    </div>
                                    <CardDescription className="text-sm">{action.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button variant="ghost" className="w-full justify-between text-sm">
                                        Get Started
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

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
        {
            title: "View Analytics",
            description: "Track your content performance",
            icon: BarChart3,
            href: "#",
            color: "text-purple-600",
        },
    ]

    const recentBoards = [
        { name: "Liverpool vs City Analysis", date: "2 hours ago", formation: "4-3-3" },
        { name: "Defensive Shape Training", date: "1 day ago", formation: "4-4-2" },
        { name: "Counter Attack Setup", date: "3 days ago", formation: "3-5-2" },
    ]

    return (
        <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="flex flex-col space-y-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.name}!</h1>
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

            {/* Recent Boards */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg md:text-xl font-semibold">Recent Boards</h2>
                    <Button variant="outline" size="sm">
                        View All
                    </Button>
                </div>
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {recentBoards.map((board, index) => (
                                <div key={index} className="p-3 md:p-4 flex items-center justify-between hover:bg-muted/50">
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Play className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="font-medium text-sm md:text-base truncate">{board.name}</p>
                                            <p className="text-xs md:text-sm text-muted-foreground">{board.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 flex-shrink-0">
                                        <Badge variant="outline" className="text-xs">
                                            {board.formation}
                                        </Badge>
                                        <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                                            Open
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Total Boards</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Videos Created</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">8</div>
                        <p className="text-xs text-muted-foreground">+3 from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Total Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">1.2K</div>
                        <p className="text-xs text-muted-foreground">+15% from last week</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl md:text-2xl font-bold">94%</div>
                        <p className="text-xs text-muted-foreground">+5% from last week</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

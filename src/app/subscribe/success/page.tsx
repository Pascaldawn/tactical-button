"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/store/auth-context"
import { toast } from "sonner"
import { Check, ArrowRight, Home, Crown } from "lucide-react"

function SubscribeSuccessContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { refreshUser, user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)

    const plans = {
        basic: {
            name: "Basic",
            features: [
                "Unlimited tactical boards",
                "All formations and tactics",
                "HD export quality",
                "Webcam overlay recording",
                "Up to 5 min recordings",
                "Email support",
                "Advanced drawing tools",
            ],
        },
        pro: {
            name: "Pro",
            features: [
                "Everything in Basic",
                "Unlimited recording time",
                "4K export quality",
                "Team collaboration",
                "Custom branding",
                "API access",
                "Dedicated support",
                "Analytics dashboard",
                "Priority feature requests",
                "White-label options",
            ],
        },
    }

    useEffect(() => {
        const handleSuccess = async () => {
            try {
                // Refresh user data to get updated subscription status
                await refreshUser()
                
                toast.success("Subscription successful!", {
                    description: "Welcome! You now have access to all premium features.",
                })
            } catch (error) {
                console.error("Error refreshing user:", error)
                toast.error("Failed to update subscription status", {
                    description: "Please refresh the page or contact support.",
                })
            } finally {
                setIsLoading(false)
            }
        }

        // Check if this is a successful payment redirect
        const sessionId = searchParams.get('session_id')
        const paymentStatus = searchParams.get('payment_status')

        if (sessionId || paymentStatus === 'success') {
            handleSuccess()
        } else {
            // If no payment parameters, redirect to subscription page
            router.push('/subscribe')
        }
    }, [searchParams, refreshUser, router])

    const handleGoToDashboard = () => {
        router.push('/dashboard')
    }

    const handleGoHome = () => {
        router.push('/')
    }

    // Determine which plan features to show based on user's subscription
    const getPlanFeatures = () => {
        if (user?.subscriptionPlan && plans[user.subscriptionPlan]) {
            return plans[user.subscriptionPlan]
        }
        // Fallback to basic if no plan is set
        return plans.basic
    }

    const currentPlan = getPlanFeatures()

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-lg">Processing your subscription...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4">
            <div className="container mx-auto py-8 md:py-12 max-w-2xl">
                <div className="text-center">
                    {/* Success Icon */}
                    <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                        <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 text-green-600 dark:text-green-400">
                        Welcome to {currentPlan.name}!
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-8">
                        Your subscription has been activated successfully. You now have access to all premium features.
                    </p>

                    {/* Plan Badge */}
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-full">
                            <Crown className="w-4 h-4 mr-2" />
                            <span className="font-medium">{currentPlan.name} Plan</span>
                        </div>
                    </div>

                    {/* Features Card */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>What's Now Available</CardTitle>
                            <CardDescription>
                                Here are the premium features you can now use:
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-left">
                                {currentPlan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center space-x-2">
                                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
                        <Button size="lg" onClick={handleGoToDashboard}>
                            <ArrowRight className="w-4 h-4 mr-2" />
                            Go to Dashboard
                        </Button>
                        <Button size="lg" variant="outline" onClick={handleGoHome}>
                            <Home className="w-4 h-4 mr-2" />
                            Go Home
                        </Button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 text-sm text-muted-foreground">
                        <p>
                            You can manage your subscription anytime from your account settings.
                        </p>
                        <p className="mt-2">
                            Need help? Contact our support team at support@example.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function LoadingFallback() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-lg">Loading...</p>
            </div>
        </div>
    )
}

export default function SubscribeSuccessPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <SubscribeSuccessContent />
        </Suspense>
    )
} 
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/store/auth-context"
import { toast } from "sonner"
import { Check, Crown, Zap, CreditCard, ExternalLink, Star } from "lucide-react"
import api from "@/lib/axios"

export default function SubscribePage() {
    const [selectedPlan, setSelectedPlan] = useState("basic")
    const [isLoading, setIsLoading] = useState(false)
    const { user, refreshUser } = useAuth()

    const plans = [
        {
            id: "basic",
            name: "Basic",
            price: "$4.99",
            period: "month",
            description: "Perfect for individual coaches and creators",
            productId: "80563e0c-7957-4a0e-8287-fb6c03621ff6",
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
        {
            id: "pro",
            name: "Pro",
            price: "$59.99",
            period: "month",
            description: "For professional teams and organizations",
            productId: "59a5060f-8bb3-4a43-ad13-6d0f8ccd6ea1",
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
            popular: true,
        },
    ]

    const handleSubscribe = async () => {
        if (!user) {
            toast.error("Please log in to subscribe")
            return
        }

        const selectedPlanData = plans.find(plan => plan.id === selectedPlan)
        if (!selectedPlanData) {
            toast.error("Please select a plan")
            return
        }

        setIsLoading(true)

        try {
            // Create checkout URL with Polar.sh
            const response = await api.post("/create-checkout", {
                products: selectedPlanData.productId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (response.data.checkout_url) {
                // Redirect to Polar.sh checkout
                window.location.href = response.data.checkout_url
            } else {
                throw new Error("Failed to create checkout URL")
            }
        } catch (error: any) {
            console.error("Subscription error:", error)
            
            // Show more specific error messages
            if (error.response?.status === 500) {
                const errorData = error.response.data
                if (errorData?.details?.includes('POLAR_ACCESS_TOKEN')) {
                    toast.error("Payment service not configured", {
                        description: "Please contact support. The payment system is not properly configured.",
                    })
                } else {
                    toast.error("Payment service error", {
                        description: errorData?.details || "Please try again or contact support.",
                    })
                }
            } else if (error.response?.status === 401) {
                toast.error("Authentication required", {
                    description: "Please log in again to continue.",
                })
            } else if (error.response?.status === 400) {
                toast.error("Invalid request", {
                    description: error.response.data?.error || "Please check your selection and try again.",
                })
            } else {
                toast.error("Failed to start subscription", {
                    description: error.response?.data?.error || "Please try again or contact support.",
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleManageSubscription = async () => {
        if (!user) {
            toast.error("Please log in to manage subscription")
            return
        }

        setIsLoading(true)

        try {
            // Create customer portal URL with Polar.sh
            const response = await api.post("/create-portal", {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })

            if (response.data.portal_url) {
                // Redirect to Polar.sh customer portal
                window.location.href = response.data.portal_url
            } else {
                throw new Error("Failed to create portal URL")
            }
        } catch (error: any) {
            console.error("Portal error:", error)
            toast.error("Failed to open customer portal", {
                description: error.response?.data?.error || "Please try again or contact support.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4">
            <div className="container mx-auto py-8 md:py-12 max-w-6xl">
                <div className="text-center mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Plan</h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Unlock the full potential of tactical analysis and content creation
                    </p>
                </div>

                {/* Plans */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
                    {plans.map((plan) => (
                        <Card
                            key={plan.id}
                            className={`relative ${plan.popular ? "border-primary shadow-lg md:scale-105" : ""} ${selectedPlan === plan.id ? "ring-2 ring-primary" : ""
                                } cursor-pointer transition-all`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {plan.popular && (
                                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Most Popular
                                </Badge>
                            )}
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl md:text-2xl">{plan.name}</CardTitle>
                                    <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value={plan.id} id={plan.id} />
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-2xl md:text-3xl font-bold">{plan.price}</span>
                                    <span className="text-muted-foreground">/{plan.period}</span>
                                </div>
                                <CardDescription>{plan.description}</CardDescription>
                                <div className="flex items-center space-x-2">
                                    <CreditCard className="w-4 h-4 text-primary" />
                                    <span className="text-sm text-muted-foreground">Polar.sh</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 md:space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="text-center space-y-4">
                    {user?.subscriptionStatus === 'active' ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-center space-x-2 text-green-600">
                                <Check className="w-5 h-5" />
                                <span className="font-medium">You have an active subscription!</span>
                            </div>
                            <Button 
                                size="lg" 
                                variant="outline" 
                                onClick={handleManageSubscription} 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Manage Subscription
                                    </>
                                )}
                            </Button>
                        </div>
                    ) : (
                        <Button size="lg" onClick={handleSubscribe} disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 mr-2" />
                                    Subscribe to {plans.find(p => p.id === selectedPlan)?.name}
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {/* Current Subscription Status */}
                {user?.subscriptionStatus && (
                    <Card className="max-w-md mx-auto mt-6 md:mt-8">
                        <CardHeader>
                            <CardTitle>Current Subscription</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">
                                        {user.subscriptionStatus === 'active' ? 'Active' : 'Free'} Plan
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        via Polar.sh
                                    </p>
                                </div>
                                <Badge 
                                    variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}
                                >
                                    {user.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Plan Comparison */}
                <div className="mt-8 md:mt-12">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-center">Plan Comparison</CardTitle>
                            <CardDescription className="text-center">
                                Choose the plan that best fits your needs
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="font-medium">Feature</div>
                                <div className="font-medium text-center">Basic</div>
                                <div className="font-medium text-center">Pro</div>
                                
                                <div>Price</div>
                                <div className="text-center">$4.99/month</div>
                                <div className="text-center">$59.99/month</div>
                                
                                <div>Recording Time</div>
                                <div className="text-center">Up to 5 min</div>
                                <div className="text-center">Unlimited</div>
                                
                                <div>Export Quality</div>
                                <div className="text-center">HD</div>
                                <div className="text-center">4K</div>
                                
                                <div>Support</div>
                                <div className="text-center">Email</div>
                                <div className="text-center">Dedicated</div>
                                
                                <div>Team Features</div>
                                <div className="text-center">❌</div>
                                <div className="text-center">✅</div>
                                
                                <div>API Access</div>
                                <div className="text-center">❌</div>
                                <div className="text-center">✅</div>
                                
                                <div>Analytics</div>
                                <div className="text-center">❌</div>
                                <div className="text-center">✅</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Security Notice */}
                <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground">
                        🔒 Secure payment processing by Polar.sh
                    </p>
                </div>
            </div>
        </div>
    )
}

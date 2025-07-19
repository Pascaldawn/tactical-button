"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/store/auth-context"
import { toast } from "sonner"
import { Check, Crown, Zap, CreditCard } from "lucide-react"

export default function SubscribePage() {
    const [selectedPlan, setSelectedPlan] = useState("pro")
    const [selectedProvider, setSelectedProvider] = useState("stripe")
    const [isLoading, setIsLoading] = useState(false)
    const { user, updateSubscription } = useAuth()

    const plans = [
        {
            id: "free",
            name: "Free",
            price: "$0",
            period: "forever",
            description: "Perfect for getting started",
            features: ["3 tactical boards per month", "Basic formations", "Standard export quality", "Community support"],
            limitations: ["Watermarked exports", "Limited recording time (2 min)", "No webcam overlay"],
        },
        {
            id: "pro",
            name: "Pro",
            price: "$19",
            period: "month",
            description: "For serious coaches and creators",
            features: [
                "Unlimited tactical boards",
                "All formations and tactics",
                "HD export quality",
                "Webcam overlay recording",
                "Up to 10 min recordings",
                "Priority support",
                "Advanced drawing tools",
                "Team branding options",
            ],
            popular: true,
        },
        {
            id: "team",
            name: "Team",
            price: "$49",
            period: "month",
            description: "For teams and organizations",
            features: [
                "Everything in Pro",
                "Unlimited recording time",
                "4K export quality",
                "Team collaboration",
                "Custom branding",
                "API access",
                "Dedicated support",
                "Analytics dashboard",
            ],
        },
    ]

    const handleSubscribe = async () => {
        setIsLoading(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 2000))

            await updateSubscription(selectedPlan, selectedProvider)

            toast.success("Subscription successful!", {
                description: `You're now subscribed to the ${plans.find((p) => p.id === selectedPlan)?.name} plan.`,
            })
        } catch (error) {
            toast.error("Subscription failed", {
                description: "Please try again or contact support.",
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
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
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 md:space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-center space-x-2">
                                            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                    {plan.limitations?.map((limitation, index) => (
                                        <li key={index} className="flex items-center space-x-2 text-muted-foreground">
                                            <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                                                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                                            </div>
                                            <span className="text-sm">{limitation}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Payment Provider Selection */}
                {selectedPlan !== "free" && (
                    <Card className="max-w-md mx-auto mb-6 md:mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <CreditCard className="w-5 h-5" />
                                <span>Payment Method</span>
                            </CardTitle>
                            <CardDescription>Choose your preferred payment provider</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={selectedProvider} onValueChange={setSelectedProvider}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="stripe" id="stripe" />
                                    <Label htmlFor="stripe" className="flex items-center space-x-2 cursor-pointer">
                                        <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">S</span>
                                        </div>
                                        <span>Stripe</span>
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="paystack" id="paystack" />
                                    <Label htmlFor="paystack" className="flex items-center space-x-2 cursor-pointer">
                                        <div className="w-8 h-5 bg-green-600 rounded flex items-center justify-center">
                                            <span className="text-white text-xs font-bold">P</span>
                                        </div>
                                        <span>Paystack</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </CardContent>
                    </Card>
                )}

                {/* Subscribe Button */}
                <div className="text-center">
                    {selectedPlan === "free" ? (
                        <Button size="lg" variant="outline" disabled>
                            Current Plan
                        </Button>
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
                                    Subscribe to {plans.find((p) => p.id === selectedPlan)?.name}
                                </>
                            )}
                        </Button>
                    )}
                </div>

                {/* Current Subscription Status */}
                {user?.subscription && (
                    <Card className="max-w-md mx-auto mt-6 md:mt-8">
                        <CardHeader>
                            <CardTitle>Current Subscription</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{user.subscription.plan} Plan</p>
                                    <p className="text-sm text-muted-foreground">via {user.subscription.provider}</p>
                                </div>
                                <Badge variant="secondary">Active</Badge>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { ArrowLeft, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            if (!email) {
                throw new Error("Please enter your email address")
            }

            if (!email.includes("@")) {
                throw new Error("Please enter a valid email address")
            }

            // Simulate request delay
            await new Promise((resolve) => setTimeout(resolve, 1500))

            setIsSubmitted(true)
            toast.success("Reset link sent! Check your email.")
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"
            )
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <Play className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-xl font-bold">Tactical Button</span>
                        </div>
                        <CardTitle>Check your email</CardTitle>
                        <CardDescription>
                            We've sent password reset instructions to {email}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the email? Check your spam folder or try again.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setIsSubmitted(false)}
                                className="w-full"
                            >
                                Try again
                            </Button>
                            <Link href="/auth/login">
                                <Button variant="ghost" className="w-full">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to login
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <Play className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold">Tactical Button</span>
                    </div>
                    <CardTitle>Forgot your password?</CardTitle>
                    <CardDescription>
                        Enter your email address and we'll send you a link to reset your
                        password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send reset link"}
                        </Button>
                    </form>
                    <div className="mt-6 text-center">
                        <Link href="/auth/login">
                            <Button variant="ghost" className="w-full">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to login
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

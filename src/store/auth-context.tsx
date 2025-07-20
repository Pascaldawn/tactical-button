"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import api from "@/lib/axios"

interface User {
    id: string
    name: string
    email: string
    subscription?: {
        plan: string
        provider: string
        active: boolean
    }
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<boolean>
    register: (name: string, email: string, password: string) => Promise<boolean>
    logout: () => void
    updateSubscription: (plan: string, provider: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for existing session
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (token && userData) {
            try {
                setUser(JSON.parse(userData))
            } catch (error) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
            }
        }

        setIsLoading(false)
    }, [])

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post("/auth/login", {
                email,
                password
            })
            if (response.status === 200 || response.status === 201) {
                localStorage.setItem("token", response.data.token)
                localStorage.setItem("user", JSON.stringify(response.data.user))
                setUser(response.data.user)
                return true
            }
            else {
                throw new Error("Registration failed")
            }
        } catch (error: unknown) {
            console.error("Registration error:", error)
            throw new Error((error as any)?.response?.data?.message || "Registration failed")
        }
    }

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        try {
            const response = await api.post("/auth/register", {
                fullName: name,
                email,
                password
            })

            if (response.status === 201 || response.status === 200) {
                return true
            }
            else {
                throw new Error("Registration failed")
            }

        } catch (error: unknown) {
            console.error("Registration error:", error)
            throw new Error((error as any)?.response?.data?.message || "Registration failed")
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    }

    const updateSubscription = async (plan: string, provider: string): Promise<void> => {
        if (user) {
            const updatedUser = {
                ...user,
                subscription: {
                    plan,
                    provider,
                    active: true,
                },
            }

            localStorage.setItem("tactical_button_user", JSON.stringify(updatedUser))
            setUser(updatedUser)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                updateSubscription,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

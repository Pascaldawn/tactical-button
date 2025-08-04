"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import api from "@/lib/axios"

interface User {
    id: string
    fullName: string
    email: string
    subscriptionStatus?: "active" | "inactive" | "cancelled" | "expired"
    subscriptionId?: string
    subscriptionPlan?: "basic" | "pro"
    subscriptionProductId?: string
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    login: (email: string, password: string) => Promise<boolean>
    register: (name: string, email: string, password: string) => Promise<boolean>
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshUser = async () => {
        try {
            const token = localStorage.getItem("token")
            if (token) {
                const response = await api.get("/auth/me", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.user) {
                    setUser(response.data.user)
                    localStorage.setItem("user", JSON.stringify(response.data.user))
                }
            }
        } catch (error) {
            console.error("Failed to refresh user:", error)
            // If token is invalid, logout
            logout()
        }
    }

    useEffect(() => {
        // Check for existing session
        const token = localStorage.getItem("token")
        const userData = localStorage.getItem("user")

        if (token && userData) {
            try {
                setUser(JSON.parse(userData))
                // Refresh user data from server to get latest subscription status
                refreshUser()
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
                throw new Error("Login failed")
            }
        } catch (error: unknown) {
            console.error("Login error:", error)
            throw new Error((error as any)?.response?.data?.message || "Login failed")
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

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                refreshUser,
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

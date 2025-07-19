import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/store/auth-context"
import { ThemeProvider } from "../components/theme-provider"
import { Toaster } from "sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Tactical Button - Football Tactics Tool",
  description: "Professional football tactics visualization and recording tool for coaches and content creators",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster /> {/* ✅ Correctly renders toast notifications */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

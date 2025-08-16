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
            {/* Global Footer */}
            <footer className="border-t bg-background/80 backdrop-blur-sm py-6 mt-auto">
              <div className="container mx-auto px-4 text-center text-muted-foreground">
                <p className="text-sm">
                  Need help? Contact our support team at{" "}
                  <a 
                    href="mailto:support@tacticalbutton.com" 
                    className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 underline"
                  >
                    support@tacticalbutton.com
                  </a>
                </p>
              </div>
            </footer>
            <Toaster /> {/* ✅ Correctly renders toast notifications */}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

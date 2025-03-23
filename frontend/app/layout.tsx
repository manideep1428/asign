import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Topbar from "@/components/topbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Investment Dashboard",
  description: "Track and analyze your investment portfolio",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen bg-black">
            <Topbar/>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}


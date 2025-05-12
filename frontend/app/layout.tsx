import type React from "react"
import type { Metadata } from "next"
import { Crete_Round } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { AuthProvider } from '../context/AuthContext'
import { cn } from "@/lib/utils"

const creteRound = Crete_Round({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: '--font-crete-round',
})

export const metadata: Metadata = {
  title: "Au Coeur de la lune",
  description: "Un espace pensé pour les enfants de la lune",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          creteRound.variable
        )}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}

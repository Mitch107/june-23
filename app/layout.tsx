import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TuCupid - Connect with Amazing People from Dominican Republic",
  description:
    "Browse and connect with verified profiles from the Dominican Republic. Safe, secure, and authentic connections.",
  keywords: "Dominican Republic, connections, profiles, contact information, meet people",
  openGraph: {
    title: "TuCupid - Connect with Amazing People",
    description: "Browse and connect with verified profiles from the Dominican Republic",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

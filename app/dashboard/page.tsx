import type { Metadata } from "next"
import { DashboardClient } from "./dashboard-client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Dashboard | HolaCupid - Your Account",
  description: "Manage your HolaCupid account, view your purchases, and access contact information.",
  alternates: {
    canonical: "https://holacupid.com/dashboard",
  },
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <DashboardClient />
      <Footer />
    </div>
  )
}

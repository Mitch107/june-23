import type React from "react"
import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { AdminSidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerClient()

  // Check if user is authenticated and has admin role
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Redirect to login with callback URL
    return redirect("/login?callbackUrl=/admin")
  }

  // Get user profile to check role
  const { data: userProfile, error } = await supabase
    .from("user_profiles")
    .select("role")
    .eq("id", session.user.id)
    .single()

  // Redirect if not admin
  if (error || !userProfile || !["admin", "super_admin"].includes(userProfile.role)) {
    // Sign out the user if they're not an admin
    await supabase.auth.signOut()
    return redirect("/login?error=access_denied")
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}

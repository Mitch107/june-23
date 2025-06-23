import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { AdminDashboard } from "@/components/admin/dashboard"
import { DashboardSkeleton } from "@/components/admin/skeletons"

export const metadata = {
  title: "Admin Dashboard | HolaCupid",
  description: "Admin dashboard for HolaCupid platform",
}

export default async function AdminPage() {
  const supabase = createServerClient()

  // Fetch dashboard statistics
  const { data: profileStats } = await supabase.rpc("get_profile_statistics")
  const { data: userStats } = await supabase.rpc("get_user_statistics")

  // Fetch recent activity
  const { data: recentActivity } = await supabase
    .from("admin_activity_log")
    .select("*, admin_user:admin_user_id(email, full_name)")
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <Suspense fallback={<DashboardSkeleton />}>
        <AdminDashboard
          profileStats={profileStats || {}}
          userStats={userStats || {}}
          recentActivity={recentActivity || []}
        />
      </Suspense>
    </div>
  )
}

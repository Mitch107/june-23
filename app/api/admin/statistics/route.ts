import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Check admin access
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get ACTUAL profile counts from database
    const { data: allProfiles, error: profileError } = await supabase.from("profiles").select("status")

    if (profileError) {
      console.error("Error fetching profiles:", profileError)
      return NextResponse.json({ error: "Failed to fetch profile data" }, { status: 500 })
    }

    // Calculate real counts
    const totalProfiles = allProfiles?.length || 0
    const pendingProfiles = allProfiles?.filter((p) => p.status === "pending").length || 0
    const approvedProfiles = allProfiles?.filter((p) => p.status === "approved").length || 0
    const rejectedProfiles = allProfiles?.filter((p) => p.status === "rejected").length || 0
    const suspendedProfiles = allProfiles?.filter((p) => p.status === "suspended").length || 0

    console.log("Profile counts:", {
      total: totalProfiles,
      pending: pendingProfiles,
      approved: approvedProfiles,
      rejected: rejectedProfiles,
      suspended: suspendedProfiles,
    })

    // Get user statistics
    const { data: allUsers } = await supabase.from("user_profiles").select("id")
    const { data: usersWithFavorites } = await supabase.from("favorites").select("user_id").distinct()
    const { data: usersWithPurchases } = await supabase.from("orders").select("user_id").distinct()

    // Get recent activity
    const { data: recentActivity } = await supabase
      .from("admin_activity_log")
      .select(`
        *,
        user_profiles (
          full_name,
          email
        )
      `)
      .order("timestamp", { ascending: false })
      .limit(10)

    return NextResponse.json({
      profiles: {
        total_profiles: totalProfiles,
        pending_profiles: pendingProfiles,
        approved_profiles: approvedProfiles,
        rejected_profiles: rejectedProfiles,
        suspended_profiles: suspendedProfiles,
      },
      users: {
        total_users: allUsers?.length || 0,
        users_with_favorites: usersWithFavorites?.length || 0,
        users_with_purchases: usersWithPurchases?.length || 0,
      },
      recentActivity: recentActivity || [],
    })
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

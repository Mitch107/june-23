import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

    // Get current user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("Auth error or no user:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Current user ID:", user.id)
    console.log("Current user email:", user.email)

    // Get user profile with role
    const { data: profile, error } = await supabase
      .from("user_profiles")
      .select("role, email")
      .eq("id", user.id)
      .single()

    console.log("Profile query result:", { profile, error })

    if (error) {
      console.error("Profile query error:", error)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (!profile) {
      console.error("No profile found for user:", user.id)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // Check if user has admin access
    if (!["admin", "super_admin"].includes(profile.role)) {
      console.log("User role not admin:", profile.role)
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    console.log("Returning user role:", profile.role)

    return NextResponse.json({
      role: profile.role,
      user_id: user.id,
      email: user.email,
      profile_email: profile.email,
    })
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

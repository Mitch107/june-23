import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Use getUser() for secure authentication check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError?.message)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin role using service role client
    const supabaseAdmin = createServerClient()
    const { data: adminProfile, error: roleError } = await supabaseAdmin
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (roleError || !adminProfile || !["admin", "super_admin"].includes(adminProfile.role)) {
      console.error("Role check failed:", roleError?.message || "Invalid role")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch profile
    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select(`
        *,
        profile_images(
          id,
          image_url,
          is_primary,
          display_order
        )
      `)
      .eq("id", params.id)
      .single()

    if (error || !profile) {
      console.error("Profile fetch error:", error?.message)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerClient()

    // Use getUser() for secure authentication check
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Authentication error:", authError?.message)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin role
    const { data: adminProfile, error: roleError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (roleError || !adminProfile || !["admin", "super_admin"].includes(adminProfile.role)) {
      console.error("Role check failed:", roleError?.message || "Invalid role")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()

    // Extract only the fields that can be updated
    const updateData: any = {}

    if (body.name !== undefined) updateData.name = body.name
    if (body.age !== undefined) updateData.age = body.age
    if (body.location !== undefined) updateData.location = body.location
    if (body.description !== undefined) updateData.description = body.description
    if (body.status !== undefined) updateData.status = body.status
    if (body.admin_notes !== undefined) updateData.admin_notes = body.admin_notes

    // Add updated timestamp
    updateData.updated_at = new Date().toISOString()

    console.log("Updating profile:", params.id, "with data:", updateData)

    // Update profile
    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating profile:", error)
      return NextResponse.json({ error: "Failed to update profile", details: error.message }, { status: 500 })
    }

    console.log("Profile updated successfully:", updatedProfile.id)

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const profileId = params.id
    const body = await request.json()
    const { status, admin_notes } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Create server client
    const supabase = createServerClient()

    // Get current user session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: userProfile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

    if (!userProfile || !["admin", "super_admin"].includes(userProfile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the profile status
    const { data: updatedProfile, error: updateError } = await supabase
      .from("profiles")
      .update({
        status: status,
        admin_notes: admin_notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId)
      .select()
      .single()

    if (updateError) {
      console.error("Profile status update error:", updateError)
      return NextResponse.json(
        {
          error: `Failed to update profile status: ${updateError.message}`,
        },
        { status: 500 },
      )
    }

    // Verify the update actually happened
    if (!updatedProfile || updatedProfile.status !== status) {
      return NextResponse.json(
        {
          error: "Profile status was not updated successfully",
        },
        { status: 500 },
      )
    }

    // Log admin activity
    try {
      await supabase.from("admin_activity_log").insert({
        admin_id: session.user.id,
        action: `profile_${status}`,
        details: {
          profile_id: profileId,
          new_status: status,
          admin_notes: admin_notes,
        },
        timestamp: new Date().toISOString(),
      })
    } catch (logError) {
      console.warn("Failed to log admin activity:", logError)
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
      message: `Profile ${status} successfully`,
    })
  } catch (error) {
    console.error("Update profile status error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

// Also handle POST method for compatibility
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return PATCH(request, { params })
}

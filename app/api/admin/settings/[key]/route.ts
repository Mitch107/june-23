import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PUT(request: Request, { params }: { params: { key: string } }) {
  try {
    const supabase = createServerClient()
    const { value } = await request.json()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: userProfile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

    if (!userProfile || !["admin", "super_admin"].includes(userProfile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Convert value to JSON string for storage
    const jsonValue = JSON.stringify(value)

    // Update the setting
    const { data, error } = await supabase
      .from("admin_settings")
      .update({
        value: jsonValue,
        updated_at: new Date().toISOString(),
      })
      .eq("key", params.key)
      .select()
      .single()

    if (error) {
      console.error("Error updating setting:", error)
      return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
    }

    // Parse the value back for the response
    let parsedValue = data.value
    if (typeof data.value === "string") {
      try {
        parsedValue = JSON.parse(data.value)
      } catch (e) {
        parsedValue = data.value
      }
    }

    return NextResponse.json({
      ...data,
      value: parsedValue,
    })
  } catch (error) {
    console.error("Error in setting update API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

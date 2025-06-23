import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createServerClient()

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

    // Fetch all settings
    const { data: settings, error } = await supabase
      .from("admin_settings")
      .select("key, value, category, description")
      .order("category", { ascending: true })
      .order("key", { ascending: true })

    if (error) {
      console.error("Error fetching settings:", error)
      return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
    }

    // Safely parse JSON values
    const parsedSettings =
      settings?.map((setting) => {
        let parsedValue = setting.value

        // If value is a string, try to parse it as JSON
        if (typeof setting.value === "string") {
          try {
            parsedValue = JSON.parse(setting.value)
          } catch (e) {
            // If parsing fails, treat it as a plain string
            parsedValue = setting.value
          }
        }

        return {
          ...setting,
          value: parsedValue,
        }
      }) || []

    return NextResponse.json(parsedSettings)
  } catch (error) {
    console.error("Error in settings API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

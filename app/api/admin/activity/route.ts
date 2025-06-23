import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)

    // Get query parameters
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const action = searchParams.get("action") || ""
    const entity_type = searchParams.get("entity_type") || ""
    const severity = searchParams.get("severity") || ""
    const date_from = searchParams.get("date_from") || ""
    const date_to = searchParams.get("date_to") || ""

    const offset = (page - 1) * limit

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Build query without joins first
    let query = supabase.from("activity_logs").select("*", { count: "exact" }).order("created_at", { ascending: false })

    // Apply filters
    if (search) {
      query = query.or(`description.ilike.%${search}%,action.ilike.%${search}%`)
    }

    if (action) {
      query = query.eq("action", action)
    }

    if (entity_type) {
      query = query.eq("entity_type", entity_type)
    }

    if (severity) {
      query = query.eq("severity", severity)
    }

    if (date_from) {
      query = query.gte("created_at", date_from)
    }

    if (date_to) {
      query = query.lte("created_at", date_to)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: logs, error, count } = await query

    if (error) {
      console.error("Error fetching activity logs:", error)
      return NextResponse.json({ error: "Failed to fetch activity logs" }, { status: 500 })
    }

    // Manually fetch user emails for admin_user_id and user_id
    const enrichedLogs = await Promise.all(
      (logs || []).map(async (log) => {
        let adminUser = null
        let targetUser = null

        // Fetch admin user email
        if (log.admin_user_id) {
          const { data: adminUserData } = await supabase.auth.admin.getUserById(log.admin_user_id)
          if (adminUserData?.user?.email) {
            adminUser = { email: adminUserData.user.email }
          }
        }

        // Fetch target user email
        if (log.user_id) {
          const { data: targetUserData } = await supabase.auth.admin.getUserById(log.user_id)
          if (targetUserData?.user?.email) {
            targetUser = { email: targetUserData.user.email }
          }
        }

        return {
          ...log,
          admin_user: adminUser,
          target_user: targetUser,
        }
      }),
    )

    return NextResponse.json({
      logs: enrichedLogs,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error in activity logs API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Create new activity log entry
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

    if (!profile || !["admin", "super_admin"].includes(profile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: log, error } = await supabase
      .from("activity_logs")
      .insert({
        admin_user_id: user.id,
        action: body.action,
        entity_type: body.entity_type,
        entity_id: body.entity_id,
        description: body.description,
        severity: body.severity || "info",
        metadata: body.metadata || {},
        old_values: body.old_values,
        new_values: body.new_values,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating activity log:", error)
      return NextResponse.json({ error: "Failed to create activity log" }, { status: 500 })
    }

    return NextResponse.json({ log })
  } catch (error) {
    console.error("Error in activity log creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

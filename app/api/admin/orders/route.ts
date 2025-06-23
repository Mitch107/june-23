import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Check authentication
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check admin role
    const { data: userProfile } = await supabase.from("user_profiles").select("role").eq("id", session.user.id).single()

    if (!userProfile || !["admin", "super_admin"].includes(userProfile.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          profile_name,
          price,
          quantity
        )
      `)
      .order("created_at", { ascending: false })

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`email.ilike.%${search}%,notes.ilike.%${search}%`)
    }

    // Get total count for pagination
    const { count } = await supabase.from("orders").select("*", { count: "exact", head: true })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: orders, error } = await query

    if (error) {
      console.error("Error fetching orders:", error)
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
    }

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error("Error in orders API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

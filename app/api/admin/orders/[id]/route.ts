import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get order details
    const { data: order, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          profile_id,
          profile_name,
          price,
          quantity
        )
      `)
      .eq("id", params.id)
      .single()

    if (error) {
      console.error("Error fetching order:", error)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error in order detail API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const body = await request.json()
    const { status, payment_status, notes } = body

    // Update order
    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status,
        payment_status,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating order:", error)
      return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error("Error in order update API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check if user exists
    const { data: existingUser, error: userError } = await supabase
      .from("user_profiles")
      .select("id, email, role")
      .eq("email", email)
      .single()

    if (userError || !existingUser) {
      return NextResponse.json(
        { error: `User with email ${email} not found. Please make sure they have registered first.` },
        { status: 404 },
      )
    }

    // Check if user is already an admin
    if (existingUser.role === "admin" || existingUser.role === "super_admin") {
      return NextResponse.json({ message: `User ${email} already has admin access!` }, { status: 200 })
    }

    // Grant admin access
    const { error: updateError } = await supabase.from("user_profiles").update({ role: "admin" }).eq("email", email)

    if (updateError) {
      console.error("Error updating user role:", updateError)
      return NextResponse.json({ error: "Failed to grant admin access. Please try again." }, { status: 500 })
    }

    return NextResponse.json({
      message: `Successfully granted admin access to ${email}! They can now access the admin panel.`,
    })
  } catch (error) {
    console.error("Setup admin error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

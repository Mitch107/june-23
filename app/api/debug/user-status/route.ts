import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Check auth status
    const { data: authUser, error: authError } = await supabase.auth.admin.listUsers({
      filter: {
        email: email,
      },
    })

    // Check profile status
    const { data: profileData, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    return NextResponse.json({
      auth: {
        exists: authUser && authUser.users && authUser.users.length > 0,
        error: authError?.message || null,
        data: authUser?.users?.[0]
          ? {
              id: authUser.users[0].id,
              email: authUser.users[0].email,
              created_at: authUser.users[0].created_at,
            }
          : null,
      },
      profile: {
        exists: !!profileData,
        error: profileError?.message || null,
        data: profileData,
      },
    })
  } catch (error: any) {
    console.error("User status check error:", error)
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 })
  }
}

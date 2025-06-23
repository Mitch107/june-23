import { createClient } from "@supabase/supabase-js"
import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()

    // Check what cookies we have
    const allCookies = cookieStore.getAll()
    console.log(
      "All cookies:",
      allCookies.map((c) => ({ name: c.name, hasValue: !!c.value })),
    )

    // Try different possible cookie names
    const possibleTokenNames = [
      "sb-access-token",
      "sb-refresh-token",
      "supabase-auth-token",
      "supabase.auth.token",
      "sb-" + process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0] + "-auth-token",
    ]

    const tokenInfo = possibleTokenNames.map((name) => ({
      name,
      exists: !!cookieStore.get(name)?.value,
      value: cookieStore.get(name)?.value ? "present" : "missing",
    }))

    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({
        authenticated: false,
        error: "No access token found",
        cookies: allCookies.map((c) => c.name),
        tokenInfo,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      })
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken)

    if (userError || !user) {
      return NextResponse.json({
        authenticated: false,
        error: userError?.message,
        cookies: allCookies.map((c) => c.name),
        tokenInfo,
        hasToken: !!accessToken,
      })
    }

    // Check if user is admin using service role client
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data: userData, error: roleError } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
      },
      userData,
      roleError: roleError?.message,
      isAdmin: userData?.role === "admin" || userData?.role === "super_admin",
      cookies: allCookies.map((c) => c.name),
      tokenInfo,
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Unknown error",
      authenticated: false,
    })
  }
}

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function checkAdminAuth() {
  try {
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      },
    )

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.log("No authenticated user:", userError?.message)
      return { isAdmin: false, user: null }
    }

    // Check if user is admin using service role client
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get() {
            return undefined
          },
        },
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    )

    const { data: userData, error: roleError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single()

    if (roleError) {
      console.log("Role check error:", roleError.message)
      return { isAdmin: false, user }
    }

    const isAdmin = userData?.role === "admin" || userData?.role === "super_admin"
    console.log("User role check:", { userId: user.id, role: userData?.role, isAdmin })

    return { isAdmin, user }
  } catch (error) {
    console.error("Auth check error:", error)
    return { isAdmin: false, user: null }
  }
}

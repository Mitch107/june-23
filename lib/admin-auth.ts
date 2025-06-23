import { createServerClient } from "@/lib/supabase/server"

export async function checkAdminAuth() {
  try {
    const supabase = createServerClient()

    // Get the current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return {
        success: false,
        error: "Not authenticated",
        user: null,
        supabase: null,
      }
    }

    // Get user profile to check role
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", session.user.id)
      .single()

    if (profileError || !userProfile || !["admin", "super_admin"].includes(userProfile.role)) {
      return {
        success: false,
        error: "Access denied - admin role required",
        user: session.user,
        supabase: null,
      }
    }

    return {
      success: true,
      error: null,
      user: session.user,
      supabase,
    }
  } catch (error: any) {
    console.error("Admin auth check failed:", error)
    return {
      success: false,
      error: error.message || "Authentication check failed",
      user: null,
      supabase: null,
    }
  }
}

// Service role client for admin operations
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase service role credentials")
  }

  const { createClient } = require("@supabase/supabase-js")
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

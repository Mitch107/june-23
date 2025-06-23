import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    // Create server client that can access cookies
    const supabase = createServerClient()

    // Get current user from session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("Auth error or no user:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Authenticated user:", user.email)

    // Check if user has admin privileges
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      console.log("Profile error:", profileError)
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (!["admin", "super_admin"].includes(profile.role)) {
      console.log("User role not admin:", profile.role)
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    console.log("User has admin access:", profile.role)

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const filter = searchParams.get("filter") || "all"
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("user_profiles")
      .select("id, email, full_name, created_at, role", { count: "exact" })
      .order("created_at", { ascending: false })

    // Apply search filter
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
    }

    // Get total count first
    const { count: totalUsers, error: countError } = await supabase
      .from("user_profiles")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("Count error:", countError)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    // Execute query
    const { data: users, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process users data
    const processedUsers =
      users?.map((user) => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name || "",
        created_at: user.created_at,
        role: user.role,
        favorites_count: 0, // Default for now
        orders_count: 0, // Default for now
        total_spent: 0, // Default for now
        last_login: user.created_at, // Default for now
      })) || []

    console.log("Returning users:", processedUsers.length)

    return NextResponse.json({
      users: processedUsers,
      totalUsers: totalUsers || 0,
      totalPages: Math.ceil((totalUsers || 0) / limit),
      currentPage: page,
    })
  } catch (error) {
    console.error("Error in GET /api/admin/users:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Create server client that can access cookies
    const supabase = createServerClient()

    // Get current user from session
    const {
      data: { user: currentUser },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if current user has admin privileges
    const { data: currentProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single()

    if (profileError || !currentProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    if (!["admin", "super_admin"].includes(currentProfile.role)) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Parse request body
    const body = await request.json()
    const { email, password, fullName, role } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Check role permissions
    if (role === "admin" && currentProfile.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can create admin users" }, { status: 403 })
    }

    // Check environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: "Missing Supabase configuration" }, { status: 500 })
    }

    // Create admin client for user creation
    const { createClient } = await import("@supabase/supabase-js")
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Create user in auth
    const { data: authUser, error: authUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || "",
      },
    })

    if (authUserError) {
      return NextResponse.json({ error: `Auth creation failed: ${authUserError.message}` }, { status: 400 })
    }

    if (!authUser.user) {
      return NextResponse.json({ error: "Failed to create auth user" }, { status: 400 })
    }

    // Create user profile
    const { error: profileInsertError } = await supabaseAdmin.from("user_profiles").insert({
      id: authUser.user.id,
      email: email,
      full_name: fullName || "",
      role: role || "user",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (profileInsertError) {
      // Clean up auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id)

      return NextResponse.json({ error: `Profile creation failed: ${profileInsertError.message}` }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        id: authUser.user.id,
        email: email,
        full_name: fullName,
        role: role || "user",
      },
    })
  } catch (error: any) {
    console.error("Error in POST /api/admin/users:", error)
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 })
  }
}

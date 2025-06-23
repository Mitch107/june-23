import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Step 1: Check if user exists in auth using RPC call instead of admin API
    const { data: authUsers, error: authError } = await supabase.rpc("get_auth_user_by_email", {
      user_email: email,
    })

    const diagnosticInfo: any = {
      authCheck: {
        found: false,
        error: null,
        userData: null,
      },
      profileCheck: {
        found: false,
        error: null,
        profileData: null,
      },
      syncAttempt: {
        success: false,
        error: null,
      },
    }

    // Alternative approach: Check profiles table first, then try to get user ID from auth.users
    const { data: existingProfile, error: profileCheckError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    diagnosticInfo.profileCheck.found = !!existingProfile
    diagnosticInfo.profileCheck.profileData = existingProfile || "No profile found"
    diagnosticInfo.profileCheck.error = profileCheckError?.message || null

    if (existingProfile) {
      return NextResponse.json({
        message: `User profile already exists for ${email}. You can now grant admin access.`,
        diagnosticInfo,
      })
    }

    // Try to get user from auth.users table directly
    const { data: authUserData, error: authUserError } = await supabase
      .from("auth.users")
      .select("id, email, created_at")
      .eq("email", email)
      .maybeSingle()

    if (authUserError || !authUserData) {
      // Try alternative method - check if user is currently signed in
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      if (currentUser && currentUser.email === email) {
        // User is currently signed in, use their data
        const { error: insertError } = await supabase.from("user_profiles").insert({
          user_id: currentUser.id,
          email: email,
          full_name: currentUser.user_metadata?.full_name || "User",
          role: "user",
        })

        if (insertError) {
          diagnosticInfo.syncAttempt.error = insertError.message
          return NextResponse.json(
            {
              error: "Failed to create user profile",
              diagnosticInfo,
            },
            { status: 500 },
          )
        }

        diagnosticInfo.syncAttempt.success = true
        diagnosticInfo.authCheck.found = true
        diagnosticInfo.authCheck.userData = {
          id: currentUser.id,
          email: currentUser.email,
          created_at: currentUser.created_at,
        }

        return NextResponse.json({
          message: `User profile created successfully for ${email}. You can now grant admin access.`,
          diagnosticInfo,
        })
      }

      return NextResponse.json(
        {
          error: `User with email ${email} not found in the authentication system. Please make sure they are registered and try signing in first.`,
          diagnosticInfo,
        },
        { status: 404 },
      )
    }

    diagnosticInfo.authCheck.found = true
    diagnosticInfo.authCheck.userData = authUserData

    // Create user profile
    const { error: insertError } = await supabase.from("user_profiles").insert({
      user_id: authUserData.id,
      email: email,
      full_name: "User",
      role: "user",
    })

    if (insertError) {
      diagnosticInfo.syncAttempt.error = insertError.message
      return NextResponse.json(
        {
          error: "Failed to create user profile",
          diagnosticInfo,
        },
        { status: 500 },
      )
    }

    diagnosticInfo.syncAttempt.success = true
    return NextResponse.json({
      message: `User profile created successfully for ${email}. You can now grant admin access.`,
      diagnosticInfo,
    })
  } catch (error: any) {
    console.error("Sync user error:", error)
    return NextResponse.json(
      {
        error: "An unexpected error occurred",
        details: error.message,
      },
      { status: 500 },
    )
  }
}

import { NextResponse } from "next/server"

export async function GET() {
  const results: any = {
    step: "starting",
    timestamp: new Date().toISOString(),
  }

  try {
    // Step 1: Check environment variables
    results.step = "checking environment"
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    results.environment = {
      hasUrl: !!supabaseUrl,
      hasServiceRole: !!serviceRoleKey,
      urlLength: supabaseUrl?.length || 0,
      serviceRoleLength: serviceRoleKey?.length || 0,
      nodeEnv: process.env.NODE_ENV,
    }

    if (!supabaseUrl) {
      return NextResponse.json({
        error: "Missing NEXT_PUBLIC_SUPABASE_URL",
        results,
      })
    }

    if (!serviceRoleKey) {
      return NextResponse.json({
        error: "Missing SUPABASE_SERVICE_ROLE_KEY",
        results,
      })
    }

    // Step 2: Try to import Supabase
    results.step = "importing supabase"
    let createClient
    try {
      const supabaseModule = await import("@supabase/supabase-js")
      createClient = supabaseModule.createClient
      results.supabaseImport = "success"
    } catch (importError) {
      results.supabaseImport = "failed"
      results.importError = importError instanceof Error ? importError.message : "Unknown import error"
      return NextResponse.json({
        error: "Failed to import Supabase",
        results,
      })
    }

    // Step 3: Create client
    results.step = "creating client"
    let supabase
    try {
      supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
      results.clientCreation = "success"
    } catch (clientError) {
      results.clientCreation = "failed"
      results.clientError = clientError instanceof Error ? clientError.message : "Unknown client error"
      return NextResponse.json({
        error: "Failed to create Supabase client",
        results,
      })
    }

    // Step 4: Simple query
    results.step = "testing connection"
    try {
      const { data, error } = await supabase.from("profiles").select("count", { count: "exact" }).limit(1)
      results.connectionTest = {
        success: !error,
        data,
        error: error?.message || null,
      }

      if (error) {
        return NextResponse.json({
          error: "Database connection failed",
          results,
        })
      }
    } catch (queryError) {
      results.connectionTest = {
        success: false,
        error: queryError instanceof Error ? queryError.message : "Unknown query error",
      }
      return NextResponse.json({
        error: "Query execution failed",
        results,
      })
    }

    // Step 5: Get profiles
    results.step = "fetching profiles"
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10)

      results.profiles = {
        success: !profilesError,
        count: profiles?.length || 0,
        data: profiles || [],
        error: profilesError?.message || null,
      }
    } catch (profilesQueryError) {
      results.profiles = {
        success: false,
        error: profilesQueryError instanceof Error ? profilesQueryError.message : "Unknown profiles query error",
      }
    }

    // Step 6: Get pending profiles
    results.step = "fetching pending profiles"
    try {
      const { data: pending, error: pendingError } = await supabase
        .from("profiles")
        .select("id, name, status, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      results.pendingProfiles = {
        success: !pendingError,
        count: pending?.length || 0,
        data: pending || [],
        error: pendingError?.message || null,
      }
    } catch (pendingQueryError) {
      results.pendingProfiles = {
        success: false,
        error: pendingQueryError instanceof Error ? pendingQueryError.message : "Unknown pending query error",
      }
    }

    results.step = "completed"
    return NextResponse.json({
      success: true,
      message: "Debug completed successfully",
      results,
    })
  } catch (globalError) {
    results.globalError = {
      message: globalError instanceof Error ? globalError.message : "Unknown global error",
      stack: globalError instanceof Error ? globalError.stack : null,
      type: typeof globalError,
      step: results.step,
    }

    return NextResponse.json(
      {
        error: "Global exception caught",
        results,
      },
      { status: 500 },
    )
  }
}

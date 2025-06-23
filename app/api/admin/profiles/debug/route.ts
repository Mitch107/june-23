import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  try {
    // Use service role client
    const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status") || "all"

    console.log("Debug: Fetching profiles with status:", status)

    // Try the exact same query as the admin API
    let query = supabaseAdmin
      .from("profiles")
      .select(`
        *,
        profile_images (
          id,
          image_url,
          is_primary,
          display_order
        )
      `)
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
      console.log("Debug: Filtering by status:", status)
    }

    const { data: profiles, error } = await query

    console.log("Debug: Query result:", {
      profilesCount: profiles?.length || 0,
      error: error?.message || null,
      firstProfile: profiles?.[0] || null,
    })

    // Also check the table structure
    const { data: tableInfo, error: tableError } = await supabaseAdmin.from("profiles").select("*").limit(1)

    return NextResponse.json({
      success: true,
      debug: {
        requestedStatus: status,
        profilesFound: profiles?.length || 0,
        profiles: profiles || [],
        error: error?.message || null,
        tableStructure: tableInfo?.[0] ? Object.keys(tableInfo[0]) : [],
        tableError: tableError?.message || null,
      },
    })
  } catch (error) {
    console.error("Debug admin profiles error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

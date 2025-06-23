import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    // Check if Supabase environment variables are set
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasSupabaseAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Try to create a Supabase client
    let supabaseConnected = false
    let supabaseError = null

    try {
      const supabase = createServerClient()
      const { data, error } = await supabase.from("user_profiles").select("count").limit(1)

      if (!error) {
        supabaseConnected = true
      } else {
        supabaseError = error.message
      }
    } catch (err) {
      supabaseError = err instanceof Error ? err.message : String(err)
    }

    return NextResponse.json({
      environment: process.env.NODE_ENV,
      supabase: {
        hasUrl: hasSupabaseUrl,
        hasAnonKey: hasSupabaseAnonKey,
        connected: supabaseConnected,
        error: supabaseError,
      },
      // Only show partial keys for security
      envVars: {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 8)}...`
          : undefined,
        NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
          ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 5)}...`
          : undefined,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to check environment variables" }, { status: 500 })
  }
}

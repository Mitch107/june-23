import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({
        error: "Missing environment variables",
      })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Try to insert a test profile
    const testProfile = {
      name: "Test Profile " + Date.now(),
      age: 25,
      location: "Test City",
      price: 100,
      status: "pending",
      description: "Test profile for debugging",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log("Attempting to insert test profile:", testProfile)

    const { data, error } = await supabase.from("profiles").insert([testProfile]).select()

    console.log("Insert result:", { data, error })

    if (error) {
      return NextResponse.json({
        error: "Insert failed",
        details: error.message,
        code: error.code,
        hint: error.hint,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Test profile inserted successfully",
      data: data,
    })
  } catch (error) {
    console.error("Test insert error:", error)

    return NextResponse.json(
      {
        error: "Exception during test insert",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

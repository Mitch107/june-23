import { NextResponse } from "next/server"

export async function GET() {
  try {
    const envCheck = {
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nodeEnv: process.env.NODE_ENV,
    }

    return NextResponse.json({
      success: true,
      environment: envCheck,
      message: "Environment check complete",
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Environment check failed",
      details: String(error),
    })
  }
}

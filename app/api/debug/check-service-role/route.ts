import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    serviceRoleLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  })
}

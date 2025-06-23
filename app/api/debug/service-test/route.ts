import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    step: "start",
    env: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
  })
}

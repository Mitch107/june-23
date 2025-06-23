import { NextResponse } from "next/server"

export async function GET() {
  try {
    return NextResponse.json({ message: "Hello World", timestamp: Date.now() })
  } catch (error) {
    return NextResponse.json({ error: "Failed", details: String(error) }, { status: 500 })
  }
}

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./types"

let supabaseClient: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  // Try to get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Check if we have the required environment variables
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables")
    return null
  }

  try {
    // Create new client only if it doesn't exist (singleton pattern)
    if (!supabaseClient) {
      supabaseClient = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          flowType: "pkce",
        },
      })
    }

    return supabaseClient
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return null
  }
}

// Export function to reinitialize (useful after credentials change)
export function reinitializeSupabase() {
  supabaseClient = null
  return createClient()
}

// Export the singleton instance
export const supabase = createClient()

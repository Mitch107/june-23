import { createServerClient as createSupabaseClient } from "@supabase/ssr"
import type { Database } from "./types"

export function createServerClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get() {
          return undefined
        },
        set() {
          // No-op for build compatibility
        },
        remove() {
          // No-op for build compatibility
        },
      },
    },
  )
}

// Export for compatibility
export const createClient = createServerClient

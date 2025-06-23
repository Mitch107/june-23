import { createClient } from "@/lib/supabase/server"
import { createClient as createClientBrowser } from "@/lib/supabase/client"

export async function signIn(email: string, password: string) {
  const supabase = createClientBrowser()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  const supabase = createClientBrowser()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  })

  if (error) {
    throw new Error(error.message)
  }
}

export async function signOut() {
  const supabase = createClientBrowser()
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(error.message)
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createClient()

  const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

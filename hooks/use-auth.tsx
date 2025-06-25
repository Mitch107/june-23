"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    let authListener: { data: { subscription: { unsubscribe: () => void } } } | null = null

    async function getInitialUser() {
      try {
        const supabase = createClient()
        if (!supabase) {
          if (mounted) {
            setUser(null)
            setLoading(false)
          }
          return
        }

        // First check for existing session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Session error:", sessionError)
          // Only clear session for specific errors
          if (
            sessionError.message.includes("Invalid Refresh Token") ||
            sessionError.message.includes("refresh_token_not_found") ||
            sessionError.message.includes("JWT expired")
          ) {
            await supabase.auth.signOut()
          }
        }

        // If we have a session, use the user from it
        // If no session, user will be null (which is correct for logged out state)
        if (mounted) {
          setUser(session?.user ?? null)
          setLoading(false)
        }

        // Listen for auth changes with improved handling
        try {
          authListener = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth state change:", event)

            if (mounted) {
              // Use session.user if available, otherwise null
              setUser(session?.user ?? null)
              setLoading(false)
            }

            // Handle different auth events
            if (event === "SIGNED_OUT") {
              setUser(null)
              // Clear user-specific cart data
              try {
                const userCartKeys = Object.keys(localStorage).filter(
                  (key) => key.startsWith("holacupid_cart_") && key !== "holacupid_cart_guest",
                )
                userCartKeys.forEach((key) => localStorage.removeItem(key))
              } catch (error) {
                console.warn("Error clearing cart data:", error)
              }
            }

            if (event === "TOKEN_REFRESHED") {
              console.log("Token refreshed successfully")
            }
          })
        } catch (listenerError) {
          console.error("Auth listener error:", listenerError)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    getInitialUser()

    return () => {
      mounted = false
      if (authListener?.data?.subscription) {
        authListener.data.subscription.unsubscribe()
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { error: new Error("Supabase not configured") }
      }

      // Clear any existing session first
      await supabase.auth.signOut()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Sign in error:", error)
        return { error }
      }

      // Update user state immediately
      if (data.user) {
        setUser(data.user)
      }

      return { error: null }
    } catch (error) {
      console.error("Sign in catch error:", error)
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const supabase = createClient()
      if (!supabase) {
        return { error: new Error("Supabase not configured") }
      }

      // Clear any existing session first
      await supabase.auth.signOut()

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: undefined, // Disable email confirmation
        },
      })

      if (error) {
        console.error("Sign up error:", error)
        return { error }
      }

      // If user is immediately available (no email confirmation required)
      if (data.user && !data.user.email_confirmed_at) {
        console.log("User created but email not confirmed:", data.user.email)
      }

      return { error: null }
    } catch (error) {
      console.error("Sign up catch error:", error)
      return { error }
    }
  }

  const signOut = async () => {
    try {
      const supabase = createClient()
      if (!supabase) return

      await supabase.auth.signOut()
      setUser(null)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Alias for compatibility
export const useSupabaseAuth = useAuth

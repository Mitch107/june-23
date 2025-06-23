"use client"

import type React from "react"
import { createContext } from "react"
import type { User } from "@supabase/supabase-js"
import { AuthProvider as AuthProviderBase, useAuth as useSupabaseAuthBase } from "./use-auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProviderBase>{children}</AuthProviderBase>
}

export function useSupabaseAuth() {
  return useSupabaseAuthBase()
}

// Bridge file to maintain backward compatibility
// Re-exports everything from the main auth hook
export { useAuth } from "./use-auth"

// For any components that might still be importing the old way
export * from "./use-auth"

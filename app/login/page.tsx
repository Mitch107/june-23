"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin"

  const supabase = createClient()

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Check if user is admin
        const { data: userProfile } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (userProfile && ["admin", "super_admin"].includes(userProfile.role)) {
          // Add a small delay to ensure session is properly set
          setTimeout(() => {
            router.push(callbackUrl)
          }, 500)
        }
      }
    }
    checkUser()
  }, [supabase, router, callbackUrl])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setDebugInfo(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Check if user is admin
        const { data: userProfile, error: profileError } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          setDebugInfo({ message: "Error fetching user profile", error: profileError })
          throw new Error("Error verifying admin privileges")
        }

        if (!userProfile || !["admin", "super_admin"].includes(userProfile.role)) {
          await supabase.auth.signOut()
          throw new Error("Access denied. Admin privileges required.")
        }

        // Add a small delay to ensure session is properly set
        setTimeout(() => {
          // Force a hard navigation to avoid client-side routing issues
          window.location.href = callbackUrl
        }, 500)
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setResetSent(true)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
            <CardDescription>We've sent a password reset link to {email}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => {
                setResetSent(false)
                setResetMode(false)
                setEmail("")
              }}
              variant="outline"
              className="w-full"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">{resetMode ? "Reset Password" : "Admin Login"}</CardTitle>
          <CardDescription>
            {resetMode ? "Enter your email to receive a password reset link" : "Sign in to access the admin dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={resetMode ? handlePasswordReset : handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {!resetMode && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {debugInfo && (
              <div className="text-xs bg-gray-100 p-2 rounded">
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Please wait..." : resetMode ? "Send Reset Link" : "Sign In"}
            </Button>

            <div className="text-center space-y-2">
              {!resetMode ? (
                <button
                  type="button"
                  onClick={() => setResetMode(true)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot your password?
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setResetMode(false)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Back to login
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

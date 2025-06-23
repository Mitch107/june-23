"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServiceRoleTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testServiceRole = async () => {
    setLoading(true)
    setResult(null)

    try {
      // Test environment variables
      const envTest = {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
      }

      setResult({
        step: "Environment Check",
        success: true,
        data: envTest,
        message: "Environment variables checked",
      })
    } catch (error: any) {
      setResult({
        step: "Environment Check",
        success: false,
        error: error.message,
        message: "Failed to check environment",
      })
    } finally {
      setLoading(false)
    }
  }

  const testUserCreation = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "testpass123",
          fullName: "Test User",
          role: "user",
        }),
      })

      const data = await response.json()

      setResult({
        step: "User Creation Test",
        success: response.ok,
        data: data,
        status: response.status,
        message: response.ok ? "User creation test completed" : "User creation failed",
      })
    } catch (error: any) {
      setResult({
        step: "User Creation Test",
        success: false,
        error: error.message,
        message: "Failed to test user creation",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Role Debug Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testServiceRole} disabled={loading}>
              {loading ? "Testing..." : "Test Environment"}
            </Button>

            <Button onClick={testUserCreation} disabled={loading} variant="outline">
              {loading ? "Testing..." : "Test User Creation"}
            </Button>
          </div>

          {result && (
            <div className="mt-6 p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">
                {result.step} - {result.success ? "✅ Success" : "❌ Failed"}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{result.message}</p>

              {result.data && (
                <div className="bg-gray-100 p-3 rounded text-sm">
                  <pre>{JSON.stringify(result.data, null, 2)}</pre>
                </div>
              )}

              {result.error && (
                <div className="bg-red-100 p-3 rounded text-sm text-red-700">
                  <strong>Error:</strong> {result.error}
                </div>
              )}

              {result.status && <div className="text-sm text-gray-500 mt-2">HTTP Status: {result.status}</div>}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

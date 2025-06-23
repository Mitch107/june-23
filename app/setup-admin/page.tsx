"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, User, Shield } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function SetupAdminPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const { user } = useAuth()

  const handleSetupAdmin = async () => {
    if (!email) {
      setMessage("Please enter an email address")
      setSuccess(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/setup-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setSuccess(true)
      } else {
        setMessage(data.error || "Failed to setup admin access")
        setSuccess(false)
      }
    } catch (error) {
      setMessage("An error occurred while setting up admin access")
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  // Debug information
  const debugInfo = (
    <Card className="mt-6 border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-sm text-yellow-800">Debug Information</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-yellow-700">
        <p>Current URL: {typeof window !== "undefined" ? window.location.origin : "Loading..."}</p>
        <p>API Endpoint: /api/setup-admin</p>
        <p>User Status: {user ? `Signed in as ${user.email}` : "Not signed in"}</p>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Setup</h1>
          <p className="text-gray-600">Set up your first admin user to access the admin panel</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Grant Admin Access
            </CardTitle>
            <CardDescription>
              Enter the email address of the user you want to make an admin. The user must already be registered on the
              site.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <Button onClick={handleSetupAdmin} disabled={loading || !email} className="w-full">
              {loading ? "Setting up..." : "Grant Admin Access"}
            </Button>

            {message && (
              <Alert className={success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                {success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={success ? "text-green-800" : "text-red-800"}>{message}</AlertDescription>
              </Alert>
            )}

            {success && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
                  <li>Sign in with the admin email address</li>
                  <li>Look for the Settings (⚙️) icon in the header</li>
                  <li>Click it to access the admin panel</li>
                  <li>
                    Or navigate directly to <code className="bg-blue-100 px-1 rounded">/admin</code>
                  </li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>

        {user && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Current User</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Signed in as: <span className="font-medium">{user.email}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                You can grant admin access to this account or any other registered user.
              </p>
            </CardContent>
          </Card>
        )}
        {debugInfo}
      </div>
    </div>
  )
}

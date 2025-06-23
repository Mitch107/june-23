"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, UserCog, Database, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export default function UserSyncPage() {
  const [email, setEmail] = useState("holacupid7@gmail.com") // Pre-filled with your email
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null)
  const { user } = useAuth()

  const handleSyncUser = async () => {
    if (!email) {
      setMessage("Please enter an email address")
      setSuccess(false)
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/debug/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setDiagnosticInfo(data)

      if (response.ok) {
        setMessage(data.message || "User synchronized successfully!")
        setSuccess(true)
      } else {
        setMessage(data.error || "Failed to synchronize user")
        setSuccess(false)
      }
    } catch (error) {
      setMessage("An error occurred while synchronizing user")
      setSuccess(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <UserCog className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Sync Tool</h1>
          <p className="text-gray-600">Fix user profile synchronization issues</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Synchronize User Profile
            </CardTitle>
            <CardDescription>
              This tool will check if a user exists in Auth but is missing from the profiles table, and fix the issue.
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
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <Button onClick={handleSyncUser} disabled={loading || !email} className="w-full">
              {loading ? (
                <span className="flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Synchronizing...
                </span>
              ) : (
                "Synchronize User"
              )}
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

            {diagnosticInfo && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
                <h3 className="font-semibold text-gray-900 mb-2">Diagnostic Information:</h3>
                <pre className="whitespace-pre-wrap overflow-auto max-h-60 bg-gray-100 p-2 rounded text-xs">
                  {JSON.stringify(diagnosticInfo, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 px-6 py-3">
            <p className="text-xs text-gray-500">
              After synchronizing, you can try granting admin access again from the{" "}
              <a href="/setup-admin" className="text-blue-600 hover:underline">
                Admin Setup
              </a>{" "}
              page.
            </p>
          </CardFooter>
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
                You can synchronize this account by entering your email above.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

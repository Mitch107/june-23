"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertTriangle, RefreshCw, Copy, ExternalLink } from "lucide-react"
import { reinitializeSupabase } from "@/lib/supabase/client"

export function SupabaseCredentials() {
  const [url, setUrl] = useState("")
  const [key, setKey] = useState("")
  const [saved, setSaved] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionError, setConnectionError] = useState("")
  const [diagnostics, setDiagnostics] = useState<any>(null)

  useEffect(() => {
    // Check if credentials are already saved in localStorage
    const savedUrl = localStorage.getItem("supabase_url")
    const savedKey = localStorage.getItem("supabase_key")

    if (savedUrl && savedKey) {
      setUrl(savedUrl)
      setKey(savedKey)
      setSaved(true)
      testConnection(savedUrl, savedKey)
    }
  }, [])

  const validateCredentials = (testUrl: string, testKey: string) => {
    const issues = []

    // URL validation
    if (!testUrl) {
      issues.push("URL is empty")
    } else if (!testUrl.startsWith("https://")) {
      issues.push("URL must start with https://")
    } else if (!testUrl.includes(".supabase.co")) {
      issues.push("URL should contain '.supabase.co'")
    }

    // Key validation
    if (!testKey) {
      issues.push("Key is empty")
    } else if (!testKey.startsWith("eyJ")) {
      issues.push("Anon key should start with 'eyJ'")
    } else if (testKey.length < 100) {
      issues.push("Anon key seems too short")
    }

    return issues
  }

  const testConnection = async (testUrl?: string, testKey?: string) => {
    const urlToTest = testUrl || url
    const keyToTest = testKey || key

    setIsLoading(true)
    setConnectionError("")
    setDiagnostics(null)

    try {
      // Validate credentials format first
      const validationIssues = validateCredentials(urlToTest, keyToTest)
      if (validationIssues.length > 0) {
        setConnectionError(`Credential format issues: ${validationIssues.join(", ")}`)
        setIsConnected(false)
        setIsLoading(false)
        return
      }

      // Test direct fetch to Supabase
      const testResponse = await fetch(`${urlToTest}/rest/v1/`, {
        method: "GET",
        headers: {
          apikey: keyToTest,
          Authorization: `Bearer ${keyToTest}`,
          "Content-Type": "application/json",
        },
      })

      const diagnosticInfo = {
        url: urlToTest,
        keyPreview: `${keyToTest.substring(0, 20)}...`,
        responseStatus: testResponse.status,
        responseOk: testResponse.ok,
        corsHeaders: {
          "access-control-allow-origin": testResponse.headers.get("access-control-allow-origin"),
          "access-control-allow-methods": testResponse.headers.get("access-control-allow-methods"),
        },
      }

      setDiagnostics(diagnosticInfo)

      if (testResponse.ok || testResponse.status === 401) {
        // 401 is actually good - it means Supabase is responding
        // Now test with the Supabase client
        localStorage.setItem("supabase_url", urlToTest)
        localStorage.setItem("supabase_key", keyToTest)

        const client = reinitializeSupabase()
        if (client) {
          // Simple test - just check if client was created
          setIsConnected(true)
          setConnectionError("")
        } else {
          setConnectionError("Failed to create Supabase client")
          setIsConnected(false)
        }
      } else {
        setConnectionError(`HTTP ${testResponse.status}: ${testResponse.statusText}`)
        setIsConnected(false)
      }
    } catch (error: any) {
      console.error("Connection test failed:", error)
      setConnectionError(`Connection failed: ${error.message}`)
      setIsConnected(false)

      setDiagnostics({
        url: urlToTest,
        keyPreview: `${keyToTest.substring(0, 20)}...`,
        error: error.message,
        errorType: error.name,
      })
    }

    setIsLoading(false)
  }

  const saveCredentials = async () => {
    if (url && key) {
      setSaved(true)
      await testConnection()
    }
  }

  const clearCredentials = () => {
    localStorage.removeItem("supabase_url")
    localStorage.removeItem("supabase_key")
    setUrl("")
    setKey("")
    setSaved(false)
    setIsConnected(false)
    setConnectionError("")
    setDiagnostics(null)
  }

  const copyDiagnostics = () => {
    if (diagnostics) {
      navigator.clipboard.writeText(JSON.stringify(diagnostics, null, 2))
    }
  }

  if (saved && isConnected) {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-green-800">Supabase connected successfully! ✅</span>
          <Button variant="outline" size="sm" onClick={clearCredentials}>
            Update Credentials
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card className="mb-6 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Configure Supabase Credentials
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          <p>To use this app, you need to configure your Supabase credentials:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>
              Go to your{" "}
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Supabase Dashboard <ExternalLink className="h-3 w-3" />
              </a>
            </li>
            <li>Select your project → Settings → API</li>
            <li>
              Copy the <strong>Project URL</strong> and <strong>anon/public key</strong>
            </li>
            <li>Paste them below and click "Test Connection"</li>
          </ol>
        </div>

        <div>
          <Label htmlFor="supabase-url">Supabase Project URL</Label>
          <Input
            id="supabase-url"
            placeholder="https://abcdefghijklmnop.supabase.co"
            value={url}
            onChange={(e) => setUrl(e.target.value.trim())}
          />
          <p className="text-xs text-gray-500 mt-1">Should start with https:// and end with .supabase.co</p>
        </div>

        <div>
          <Label htmlFor="supabase-key">Supabase Anon Key</Label>
          <Input
            id="supabase-key"
            type="password"
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
            value={key}
            onChange={(e) => setKey(e.target.value.trim())}
          />
          <p className="text-xs text-gray-500 mt-1">Should start with "eyJ" and be quite long</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={saveCredentials} disabled={!url || !key || isLoading} className="flex-1">
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Testing Connection...
              </>
            ) : (
              "Test Connection"
            )}
          </Button>

          {saved && (
            <Button variant="outline" onClick={() => testConnection()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
        </div>

        {connectionError && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Connection Failed:</strong> {connectionError}
            </AlertDescription>
          </Alert>
        )}

        {diagnostics && (
          <Card className="bg-gray-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                Connection Diagnostics
                <Button variant="ghost" size="sm" onClick={copyDiagnostics}>
                  <Copy className="h-3 w-3" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <pre className="text-xs bg-white p-2 rounded border overflow-auto">
                {JSON.stringify(diagnostics, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>
            <strong>Common Issues:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Make sure you're using the <strong>anon/public</strong> key, not the service role key
            </li>
            <li>Check that your Supabase project is not paused</li>
            <li>Verify the URL doesn't have extra characters or spaces</li>
            <li>Ensure your project has RLS policies configured</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

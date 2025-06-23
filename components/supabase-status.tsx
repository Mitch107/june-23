"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ExternalLink, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react"

interface SupabaseStatusProps {
  showOnSuccess?: boolean
}

export function SupabaseStatus({ showOnSuccess = false }: SupabaseStatusProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({})

  const checkSupabaseConnection = async () => {
    setStatus("loading")
    setErrorMessage(null)

    try {
      // Check environment variables
      const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
      const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setEnvVars({ hasUrl, hasKey })

      if (!hasUrl || !hasKey) {
        throw new Error("Missing required environment variables")
      }

      // Test connection with a simple query
      const { data, error } = await supabase.from("user_profiles").select("count").limit(1)

      if (error) {
        throw new Error(`Supabase query failed: ${error.message}`)
      }

      setStatus("success")
    } catch (err) {
      console.error("Supabase connection failed:", err)
      setStatus("error")
      setErrorMessage(err instanceof Error ? err.message : String(err))
    }
  }

  useEffect(() => {
    checkSupabaseConnection()
  }, [])

  if (status === "loading") {
    return (
      <Alert className="mb-4 bg-blue-50 border-blue-200">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking Supabase connection...</AlertTitle>
        <AlertDescription>Verifying database connectivity and environment variables.</AlertDescription>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Supabase Connection Failed</AlertTitle>
        <AlertDescription>
          <p className="mb-2">Unable to connect to Supabase database.</p>

          <div className="flex gap-2 mb-3">
            <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
              {showDetails ? "Hide Details" : "Show Details"}
            </Button>
            <Button variant="outline" size="sm" onClick={checkSupabaseConnection}>
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>

          {showDetails && (
            <div className="mt-3 p-3 bg-red-50 rounded text-sm">
              <p className="font-semibold mb-2">Error Details:</p>
              <p className="font-mono text-xs mb-3">{errorMessage}</p>

              <p className="font-semibold mb-2">Environment Variables Status:</p>
              <ul className="space-y-1 text-xs">
                <li className={envVars.hasUrl ? "text-green-600" : "text-red-600"}>
                  {envVars.hasUrl ? "✅" : "❌"} NEXT_PUBLIC_SUPABASE_URL
                </li>
                <li className={envVars.hasKey ? "text-green-600" : "text-red-600"}>
                  {envVars.hasKey ? "✅" : "❌"} NEXT_PUBLIC_SUPABASE_ANON_KEY
                </li>
              </ul>

              <div className="mt-3 p-2 bg-gray-100 rounded text-xs">
                <p className="font-semibold mb-1">Quick Fix Steps:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                  <li>Add/verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>Redeploy your project</li>
                  <li>Clear browser cache and refresh</li>
                </ol>
              </div>
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Vercel Dashboard
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Supabase Dashboard
              </a>
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "success" && showOnSuccess) {
    return (
      <Alert className="mb-4 bg-green-50 border-green-200">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-700">Supabase Connected</AlertTitle>
        <AlertDescription className="text-green-600">
          Successfully connected to Supabase database. All systems operational.
        </AlertDescription>
      </Alert>
    )
  }

  return null
}

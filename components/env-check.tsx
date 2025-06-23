"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, RefreshCw, Info } from "lucide-react"

interface EnvStatus {
  hasUrl: boolean
  hasKey: boolean
  urlValid: boolean
  keyValid: boolean
  urlPreview?: string
  keyPreview?: string
  availableVars: string[]
}

export function EnvCheck() {
  const [envStatus, setEnvStatus] = useState<EnvStatus | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  const checkEnvironment = () => {
    // Check multiple possible environment variable names
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

    // Get all available Supabase-related environment variables
    const availableVars = Object.keys(process.env).filter((key) => key.includes("SUPABASE") || key.includes("supabase"))

    const status: EnvStatus = {
      hasUrl: !!url,
      hasKey: !!key,
      urlValid: !!url && url.startsWith("https://") && url.includes(".supabase.co"),
      keyValid: !!key && key.startsWith("eyJ"),
      urlPreview: url ? `${url.substring(0, 30)}...` : undefined,
      keyPreview: key ? `${key.substring(0, 10)}...` : undefined,
      availableVars,
    }

    setEnvStatus(status)
  }

  useEffect(() => {
    checkEnvironment()
  }, [])

  if (!envStatus) {
    return (
      <Alert className="mb-4">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <AlertTitle>Checking environment variables...</AlertTitle>
      </Alert>
    )
  }

  const allValid = envStatus.hasUrl && envStatus.hasKey && envStatus.urlValid && envStatus.keyValid

  return (
    <div className="space-y-4">
      <Alert variant={allValid ? "default" : "destructive"} className="mb-4">
        {allValid ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
        <AlertTitle>{allValid ? "Environment Variables OK" : "Environment Variables Issue"}</AlertTitle>
        <AlertDescription>
          {allValid ? (
            "All Supabase environment variables are properly configured."
          ) : (
            <div>
              <p className="mb-2">Environment variable status:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {!envStatus.hasUrl && <li>SUPABASE_URL is missing</li>}
                {envStatus.hasUrl && !envStatus.urlValid && <li>SUPABASE_URL is invalid</li>}
                {!envStatus.hasKey && <li>SUPABASE_ANON_KEY is missing</li>}
                {envStatus.hasKey && !envStatus.keyValid && <li>SUPABASE_ANON_KEY is invalid</li>}
              </ul>
            </div>
          )}
        </AlertDescription>
      </Alert>

      {!allValid && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Environment Debug Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Available Supabase Environment Variables:</h4>
              {envStatus.availableVars.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {envStatus.availableVars.map((varName) => (
                    <li key={varName} className="font-mono text-xs">
                      {varName}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-red-600">No Supabase environment variables found</p>
              )}
            </div>

            <div>
              <h4 className="font-semibold mb-2">Current Status:</h4>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 ${envStatus.hasUrl ? "text-green-600" : "text-red-600"}`}>
                    {envStatus.hasUrl ? "✅" : "❌"} Supabase URL
                  </div>
                  {envStatus.urlPreview && (
                    <div className="text-xs text-gray-500 font-mono">{envStatus.urlPreview}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className={`flex items-center gap-2 ${envStatus.hasKey ? "text-green-600" : "text-red-600"}`}>
                    {envStatus.hasKey ? "✅" : "❌"} Supabase Key
                  </div>
                  {envStatus.keyPreview && (
                    <div className="text-xs text-gray-500 font-mono">{envStatus.keyPreview}</div>
                  )}
                </div>
              </div>
            </div>

            <Button onClick={checkEnvironment} variant="outline" size="sm">
              <RefreshCw className="h-3 w-3 mr-1" />
              Recheck Environment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

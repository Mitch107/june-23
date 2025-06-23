"use client"

import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle, ExternalLink, Copy, Eye, EyeOff } from "lucide-react"

export function SupabaseSetup() {
  const [supabaseUrl, setSupabaseUrl] = useState("")
  const [supabaseKey, setSupabaseKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const updateCode = () => {
    const updatedCode = `// TEMPORARY: Hardcoded Supabase credentials for v0 environment
const TEMP_SUPABASE_URL = "${supabaseUrl}"
const TEMP_SUPABASE_ANON_KEY = "${supabaseKey}"`

    copyToClipboard(updatedCode)
    alert("Code copied! Update the lib/supabase/client.ts file with these values.")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Supabase Setup Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Missing Supabase Configuration</AlertTitle>
          <AlertDescription>
            The v0 environment doesn't have Supabase environment variables. You need to configure them manually.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-3">Step 1: Get Your Supabase Credentials</h4>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Go to{" "}
                <Button asChild variant="link" className="p-0 h-auto">
                  <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer">
                    Supabase Dashboard <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              </li>
              <li>Select your project</li>
              <li>Go to Settings → API</li>
              <li>Copy the Project URL and anon/public key</li>
            </ol>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="supabase-url">Supabase Project URL</Label>
              <Input
                id="supabase-url"
                placeholder="https://your-project-id.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="supabase-key">Supabase Anon Key</Label>
              <div className="relative">
                <Input
                  id="supabase-key"
                  type={showKey ? "text" : "password"}
                  placeholder="eyJ..."
                  value={supabaseKey}
                  onChange={(e) => setSupabaseKey(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Step 2: Update the Code</h4>
            <p className="text-sm text-gray-600 mb-3">
              Click the button below to copy the updated code, then paste it into the{" "}
              <code className="bg-gray-100 px-1 rounded">lib/supabase/client.ts</code> file.
            </p>
            <Button onClick={updateCode} disabled={!supabaseUrl || !supabaseKey} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              {copied ? "Copied!" : "Copy Updated Code"}
            </Button>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Step 3: Update Supabase Site URL</h4>
            <p className="text-sm text-gray-600 mb-2">
              In your Supabase Dashboard → Authentication → URL Configuration, set:
            </p>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              Site URL: https://kzmlpfp1qdimyex0ys86.lite.vusercontent.net/
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

import { EnvCheck } from "@/components/env-check"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Terminal } from "lucide-react"

export default function EnvDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Environment Variables Debug
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EnvCheck />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Reference</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Required Environment Variables:</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
                    <span className="text-gray-600">Your Supabase project URL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                    <span className="text-gray-600">Your Supabase anon/public key</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Common Issues:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Environment variables not set in Vercel dashboard</li>
                  <li>Typos in variable names (case sensitive)</li>
                  <li>Missing NEXT_PUBLIC_ prefix</li>
                  <li>Build cache not cleared after adding variables</li>
                  <li>Variables not set for all environments (Production, Preview, Development)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

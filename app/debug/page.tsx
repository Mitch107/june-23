import { SupabaseStatus } from "@/components/supabase-status"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DebugPage() {
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

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Supabase Connection Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <SupabaseStatus showOnSuccess={true} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Environment Variables Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Required Variables:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      1
                    </span>
                    <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>
                    <span className="text-gray-600">- Your Supabase project URL</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      2
                    </span>
                    <code className="bg-gray-100 px-2 py-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                    <span className="text-gray-600">- Your Supabase anonymous key</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Setup Instructions:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Go to your Supabase project dashboard</li>
                  <li>Navigate to Settings → API</li>
                  <li>Copy the Project URL and anon/public key</li>
                  <li>Add them to Vercel environment variables</li>
                  <li>Redeploy your project</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SchemaInspector() {
  const [email, setEmail] = useState("holacupid7@gmail.com")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const inspectSchema = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/debug/inspect-schema", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Error:", error)
      setResults({ error: "Failed to inspect schema" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Database Schema Inspector</CardTitle>
          <CardDescription>
            This tool will inspect your database structure to understand the exact table schema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email to Check</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <Button onClick={inspectSchema} disabled={loading}>
            {loading ? "Inspecting..." : "Inspect Database Schema"}
          </Button>

          {results && (
            <div className="mt-6 space-y-4">
              {results.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <h3 className="font-semibold text-red-800">Error</h3>
                  <p className="text-red-600">{results.error}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* User Profiles Table Structure */}
                  {results.userProfilesSchema && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <h3 className="font-semibold text-blue-800 mb-2">user_profiles Table Structure</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Column</th>
                              <th className="text-left p-2">Type</th>
                              <th className="text-left p-2">Nullable</th>
                              <th className="text-left p-2">Default</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.userProfilesSchema.map((col: any, idx: number) => (
                              <tr key={idx} className="border-b">
                                <td className="p-2 font-mono">{col.column_name}</td>
                                <td className="p-2">{col.data_type}</td>
                                <td className="p-2">{col.is_nullable}</td>
                                <td className="p-2 font-mono text-xs">{col.column_default || "NULL"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Available Tables */}
                  {results.availableTables && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                      <h3 className="font-semibold text-green-800 mb-2">Available User-Related Tables</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {results.availableTables.map((table: any, idx: number) => (
                          <li key={idx} className="font-mono text-sm">
                            {table.table_name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Auth User Check */}
                  {results.authUser && (
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                      <h3 className="font-semibold text-purple-800 mb-2">Auth User Status</h3>
                      {results.authUser.length > 0 ? (
                        <div>
                          <p className="text-green-600 font-semibold">✓ User found in auth.users</p>
                          <div className="mt-2 text-sm">
                            <p>
                              <strong>ID:</strong> <code>{results.authUser[0].id}</code>
                            </p>
                            <p>
                              <strong>Email:</strong> {results.authUser[0].email}
                            </p>
                            <p>
                              <strong>Created:</strong> {new Date(results.authUser[0].created_at).toLocaleString()}
                            </p>
                            <p>
                              <strong>Email Confirmed:</strong>{" "}
                              {results.authUser[0].email_confirmed_at ? "✓ Yes" : "✗ No"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-red-600 font-semibold">✗ User not found in auth.users</p>
                      )}
                    </div>
                  )}

                  {/* Profile Check */}
                  {results.profileCheck !== undefined && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                      <h3 className="font-semibold text-yellow-800 mb-2">Profile Status</h3>
                      {results.profileCheck ? (
                        <p className="text-green-600 font-semibold">✓ User profile exists</p>
                      ) : (
                        <p className="text-red-600 font-semibold">✗ User profile missing</p>
                      )}
                    </div>
                  )}

                  {/* Recommended SQL */}
                  {results.recommendedSQL && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
                      <h3 className="font-semibold text-gray-800 mb-2">Recommended SQL Fix</h3>
                      <pre className="text-xs bg-gray-100 p-3 rounded overflow-x-auto">
                        <code>{results.recommendedSQL}</code>
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

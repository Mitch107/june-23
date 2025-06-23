"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DebugInfo {
  totalProfiles: number
  approvedProfiles: number
  pendingProfiles: number
  rejectedProfiles: number
  profilesWithImages: number
  sampleProfiles: any[]
  connectionStatus: string
  lastError: string | null
}

export function DebugProfiles() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [loading, setLoading] = useState(false)

  const runDiagnostics = async () => {
    setLoading(true)
    const supabase = createClient()
    const info: DebugInfo = {
      totalProfiles: 0,
      approvedProfiles: 0,
      pendingProfiles: 0,
      rejectedProfiles: 0,
      profilesWithImages: 0,
      sampleProfiles: [],
      connectionStatus: "Unknown",
      lastError: null,
    }

    try {
      // Test connection
      const { error: connectionError } = await supabase.from("profiles").select("count", { count: "exact", head: true })

      if (connectionError) {
        info.connectionStatus = `Failed: ${connectionError.message}`
        info.lastError = connectionError.message
      } else {
        info.connectionStatus = "Connected"
      }

      // Get total profiles count
      const { count: totalCount, error: totalError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })

      if (!totalError && totalCount !== null) {
        info.totalProfiles = totalCount
      }

      // Get approved profiles count
      const { count: approvedCount, error: approvedError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved")

      if (!approvedError && approvedCount !== null) {
        info.approvedProfiles = approvedCount
      }

      // Get pending profiles count
      const { count: pendingCount, error: pendingError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")

      if (!pendingError && pendingCount !== null) {
        info.pendingProfiles = pendingCount
      }

      // Get rejected profiles count
      const { count: rejectedCount, error: rejectedError } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("status", "rejected")

      if (!rejectedError && rejectedCount !== null) {
        info.rejectedProfiles = rejectedCount
      }

      // Get profiles with images count
      const { data: profilesWithImages, error: imagesError } = await supabase.from("profiles").select(`
          id,
          profile_images (id)
        `)

      if (!imagesError && profilesWithImages) {
        info.profilesWithImages = profilesWithImages.filter(
          (p) => p.profile_images && p.profile_images.length > 0,
        ).length
      }

      // Get sample profiles
      const { data: sampleData, error: sampleError } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          age,
          status,
          created_at,
          profile_images (
            id,
            image_url,
            is_primary
          )
        `)
        .limit(5)

      if (!sampleError && sampleData) {
        info.sampleProfiles = sampleData
      }
    } catch (error) {
      info.lastError = error instanceof Error ? error.message : "Unknown error"
      info.connectionStatus = `Error: ${info.lastError}`
    }

    setDebugInfo(info)
    setLoading(false)
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Running Diagnostics...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!debugInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load debug information</p>
          <Button onClick={runDiagnostics} className="mt-2">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Database Diagnostics
            <Button onClick={runDiagnostics} size="sm" variant="outline">
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Connection Status:</span>
            <Badge variant={debugInfo.connectionStatus === "Connected" ? "default" : "destructive"}>
              {debugInfo.connectionStatus}
            </Badge>
          </div>

          {/* Profile Counts */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-gray-900">{debugInfo.totalProfiles}</div>
              <div className="text-sm text-gray-600">Total Profiles</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{debugInfo.approvedProfiles}</div>
              <div className="text-sm text-gray-600">Approved</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">{debugInfo.pendingProfiles}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">{debugInfo.rejectedProfiles}</div>
              <div className="text-sm text-gray-600">Rejected</div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-medium">Profiles with Images:</span>
            <Badge variant="secondary">{debugInfo.profilesWithImages}</Badge>
          </div>

          {debugInfo.lastError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <div className="font-medium text-red-800">Last Error:</div>
              <div className="text-red-600 text-sm mt-1">{debugInfo.lastError}</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sample Profiles */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          {debugInfo.sampleProfiles.length === 0 ? (
            <p className="text-gray-500">No profiles found in database</p>
          ) : (
            <div className="space-y-3">
              {debugInfo.sampleProfiles.map((profile, index) => (
                <div key={profile.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">{profile.name || "Unnamed"}</div>
                    <div className="text-sm text-gray-600">
                      ID: {profile.id} | Age: {profile.age || "N/A"} | Status: {profile.status}
                    </div>
                    <div className="text-xs text-gray-500">
                      Images: {profile.profile_images?.length || 0} | Created:{" "}
                      {new Date(profile.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <Badge
                    variant={
                      profile.status === "approved"
                        ? "default"
                        : profile.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {profile.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

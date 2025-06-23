"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { DebugProfiles } from "@/components/debug-profiles"

export default function DebugProfilesPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const checkProfiles = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (!supabase) {
        setError("Supabase client not available")
        return
      }

      // Check all profiles
      const { data: allProfiles, error: allError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })

      if (allError) {
        setError(`Error fetching profiles: ${allError.message}`)
        return
      }

      // Check pending profiles
      const { data: pendingProfiles, error: pendingError } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      if (pendingError) {
        setError(`Error fetching pending profiles: ${pendingError.message}`)
        return
      }

      setDebugInfo({
        totalProfiles: allProfiles?.length || 0,
        pendingProfiles: pendingProfiles?.length || 0,
        allProfiles: allProfiles || [],
        pendingOnly: pendingProfiles || [],
        lastProfile: allProfiles?.[0] || null,
      })
    } catch (err) {
      setError(`Unexpected error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  const testInsert = async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      if (!supabase) {
        setError("Supabase client not available")
        return
      }

      const testProfile = {
        name: "Test Profile " + Date.now(),
        age: 25,
        location: "Santo Domingo",
        status: "pending",
        price: 25,
        featured: false,
        verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      const { data, error } = await supabase.from("profiles").insert(testProfile).select().single()

      if (error) {
        setError(`Insert error: ${error.message}`)
        return
      }

      setDebugInfo((prev) => ({
        ...prev,
        lastInsert: data,
        insertSuccess: true,
      }))

      // Refresh the profile list
      await checkProfiles()
    } catch (err) {
      setError(`Insert failed: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkProfiles()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile Debug Dashboard</h1>
        <DebugProfiles />
      </div>
    </div>
  )
}

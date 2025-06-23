"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface Profile {
  id: string
  name: string
  age: number
  location: string
  price: number
  description: string
  status: string
  profile_images: Array<{
    id: string
    image_url: string
    is_primary: boolean
  }>
}

export function ProductGrid() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApprovedProfiles()
    fetchUserFavorites()
  }, [])

  const fetchApprovedProfiles = async () => {
    try {
      console.log("🔍 Starting to fetch approved profiles...")
      const supabase = createClient()

      // First, let's check if we can connect to Supabase
      const { data: testConnection, error: connectionError } = await supabase
        .from("profiles")
        .select("count", { count: "exact", head: true })

      if (connectionError) {
        console.error("❌ Supabase connection error:", connectionError)
        setError("Database connection failed")
        return
      }

      console.log("✅ Supabase connection successful")

      // Query profiles with detailed logging
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select(`
          id,
          name,
          age,
          location,
          price,
          description,
          status,
          profile_images (
            id,
            image_url,
            is_primary
          )
        `)
        .eq("status", "approved")
        .order("created_at", { ascending: false })

      console.log("📊 Raw profiles data:", profilesData)
      console.log("📊 Profiles error:", profilesError)

      if (profilesError) {
        console.error("❌ Error fetching profiles:", profilesError)
        setError(`Failed to fetch profiles: ${profilesError.message}`)
        toast.error("Failed to load profiles")
        return
      }

      if (!profilesData) {
        console.warn("⚠️ No profiles data returned")
        setProfiles([])
        setError("No profiles data returned from database")
        return
      }

      console.log(`✅ Successfully fetched ${profilesData.length} approved profiles`)

      // Log each profile for debugging
      profilesData.forEach((profile, index) => {
        console.log(`Profile ${index + 1}:`, {
          id: profile.id,
          name: profile.name,
          status: profile.status,
          images: profile.profile_images?.length || 0,
        })
      })

      setProfiles(profilesData)
      setError(null)
    } catch (error) {
      console.error("❌ Unexpected error in fetchApprovedProfiles:", error)
      setError(`Unexpected error: ${error instanceof Error ? error.message : "Unknown error"}`)
      toast.error("Failed to load profiles")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserFavorites = async () => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.log("👤 No user logged in, skipping favorites fetch")
        return
      }

      console.log("👤 Fetching favorites for user:", user.id)

      const { data: favoritesData, error: favoritesError } = await supabase
        .from("favorites")
        .select("profile_id")
        .eq("user_id", user.id)

      if (favoritesError) {
        console.error("❌ Error fetching favorites:", favoritesError)
        return
      }

      if (favoritesData) {
        const favoriteIds = favoritesData.map((fav) => fav.profile_id)
        console.log("❤️ User favorites:", favoriteIds)
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error("❌ Error in fetchUserFavorites:", error)
    }
  }

  const toggleFavorite = async (profileId: string) => {
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("Please log in to add favorites")
        return
      }

      const isFavorited = favorites.includes(profileId)

      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("profile_id", profileId)

        if (error) throw error

        setFavorites((prev) => prev.filter((id) => id !== profileId))
        toast.success("Removed from favorites")
      } else {
        // Add to favorites
        const { error } = await supabase.from("favorites").insert({
          user_id: user.id,
          profile_id: profileId,
        })

        if (error) throw error

        setFavorites((prev) => [...prev, profileId])
        toast.success("Added to favorites")
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast.error("Failed to update favorites")
    }
  }

  const getProfileImage = (profile: Profile) => {
    if (!profile.profile_images || profile.profile_images.length === 0) {
      console.log(`📷 No images for profile ${profile.name}, using placeholder`)
      return "/placeholder.svg?height=400&width=300"
    }

    // Find primary image first
    const primaryImage = profile.profile_images.find((img) => img.is_primary)

    if (primaryImage) {
      console.log(`📷 Using primary image for ${profile.name}:`, primaryImage.image_url)
      return primaryImage.image_url
    }

    // Fallback to first image
    const firstImage = profile.profile_images[0]?.image_url || "/placeholder.svg?height=400&width=300"
    console.log(`📷 Using first image for ${profile.name}:`, firstImage)
    return firstImage
  }

  // Loading state
  if (loading) {
    console.log("⏳ Rendering loading state...")
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  // Error state
  if (error) {
    console.log("❌ Rendering error state:", error)
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Profiles</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <Button
            onClick={() => {
              setError(null)
              setLoading(true)
              fetchApprovedProfiles()
            }}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  // Empty state
  if (profiles.length === 0) {
    console.log("📭 Rendering empty state - no profiles found")
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Profiles Available</h3>
          <p className="text-gray-600 mb-4">There are currently no approved profiles to display.</p>
          <Button
            onClick={() => {
              setLoading(true)
              fetchApprovedProfiles()
            }}
            variant="outline"
          >
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  // Success state - render profiles with updated UI layout
  console.log(`🎉 Rendering ${profiles.length} profiles`)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {profiles.map((profile) => {
        const isFavorited = favorites.includes(profile.id)
        const profileImage = getProfileImage(profile)

        console.log(`🎨 Rendering profile: ${profile.name} (ID: ${profile.id})`)

        return (
          <Card
            key={profile.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] bg-white"
          >
            <Link href={`/profile/${profile.id}`} className="block">
              {/* Clean Image Container - No overlays */}
              <div className="relative w-full aspect-[3/4] overflow-hidden cursor-pointer bg-gray-100">
                <Image
                  src={profileImage || "/placeholder.svg"}
                  alt={`${profile.name}, ${profile.age}`}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={false}
                  onError={(e) => {
                    console.error(`❌ Image failed to load for ${profile.name}:`, profileImage)
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=400&width=300"
                  }}
                />

                {/* Removed: Verified Badge - Hidden from UI as requested */}
                {/* Removed: Price Badge - Hidden from UI as requested */}
                {/* Removed: Heart Button from overlay - Moved below as requested */}
              </div>
            </Link>

            {/* Card Content with Heart Button moved here */}
            <CardContent className="p-4">
              {/* Profile Name and Heart Button Row */}
              <div className="flex items-start justify-between mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {profile.name}, {profile.age}
                  </h3>
                </div>

                {/* Heart Button - Moved from overlay to here */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 p-1 hover:bg-gray-100 flex-shrink-0"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleFavorite(profile.id)
                  }}
                >
                  <Heart
                    className={`h-5 w-5 ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`}
                  />
                </Button>
              </div>

              {/* Location */}
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{profile.location}</span>
              </div>

              {/* Description */}
              {profile.description && (
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">{profile.description}</p>
              )}

              {/* View Profile Button */}
              <Link href={`/profile/${profile.id}`}>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 transition-colors duration-200 font-medium">
                  View Profile
                </Button>
              </Link>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

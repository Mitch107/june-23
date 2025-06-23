"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { toast } from "@/components/ui/use-toast"

export type FavoriteProfile = {
  id: number
  name: string
  age: number
  location: string
  price: number
  featured: boolean
  verified: boolean
  description: string | null
  image_url?: string
  slug?: string
}

// Mock profile data that matches the existing profiles
const PROFILES_DATA: Record<number, FavoriteProfile> = {
  1: {
    id: 1,
    name: "Carmen",
    age: 25,
    location: "Santo Domingo, DO",
    price: 2,
    featured: true,
    verified: true,
    description: "Beautiful and charming",
    image_url: "/images/carmen-1.jpg",
  },
  2: {
    id: 2,
    name: "Daniela",
    age: 28,
    location: "Santiago, DO",
    price: 2,
    featured: false,
    verified: true,
    description: "Sweet and caring",
    image_url: "/images/daniela-1.png",
  },
  3: {
    id: 3,
    name: "Sofia",
    age: 23,
    location: "Puerto Plata, DO",
    price: 2,
    featured: true,
    verified: true,
    description: "Fun and adventurous",
    image_url: "/images/sofia-1.jpg",
  },
  4: {
    id: 4,
    name: "Anyelina",
    age: 26,
    location: "La Romana, DO",
    price: 2,
    featured: false,
    verified: true,
    description: "Elegant and sophisticated",
    image_url: "/images/anyelina-1.jpg",
  },
  5: {
    id: 5,
    name: "Valentina",
    age: 24,
    location: "Punta Cana, DO",
    price: 2,
    featured: true,
    verified: true,
    description: "Vibrant and energetic",
    image_url: "/images/valentina-1.png",
  },
  6: {
    id: 6,
    name: "Dina",
    age: 27,
    location: "San Pedro de Macorís, DO",
    price: 2,
    featured: false,
    verified: true,
    description: "Kind and gentle",
    image_url: "/images/dina-1.jpg",
  },
  7: {
    id: 7,
    name: "Idelsy",
    age: 24,
    location: "Santo Domingo, DO",
    price: 2,
    featured: true,
    verified: true,
    description: "Cheerful and bright",
    image_url: "/images/idelsy-1.jpg",
  },
  8: {
    id: 8,
    name: "Osmaily",
    age: 26,
    location: "Santiago, DO",
    price: 2,
    featured: false,
    verified: true,
    description: "Graceful and elegant",
    image_url: "/images/osmaily-1.jpg",
  },
  9: {
    id: 9,
    name: "Perla",
    age: 25,
    location: "Puerto Plata, DO",
    price: 2,
    featured: true,
    verified: true,
    description: "Radiant and lovely",
    image_url: "/images/perla-1.png",
  },
  10: {
    id: 10,
    name: "Yoselin",
    age: 23,
    location: "La Romana, DO",
    price: 2,
    featured: false,
    verified: true,
    description: "Sweet and charming",
    image_url: "/images/yoselin-1.jpg",
  },
  11: {
    id: 11,
    name: "Scarlett",
    age: 25,
    location: "Santo Domingo, DO",
    price: 2,
    featured: true,
    verified: true,
    description: "Stunning and confident",
    image_url: "/images/scarlett-1.jpg",
  },
}

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load favorites from localStorage when component mounts or user changes
  useEffect(() => {
    loadFavorites()
  }, [user])

  // Save favorites to localStorage whenever favoriteIds changes
  useEffect(() => {
    if (!loading && user) {
      saveFavorites()
    }
  }, [favoriteIds, loading, user])

  // Load favorites from localStorage
  const loadFavorites = () => {
    setLoading(true)
    try {
      if (typeof window === "undefined") {
        setFavoriteIds([])
        setLoading(false)
        return
      }

      if (!user) {
        setFavoriteIds([])
        setLoading(false)
        return
      }

      const storageKey = `holacupid_favorites_${user.id}`
      const savedFavorites = localStorage.getItem(storageKey)

      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites)
        if (Array.isArray(parsedFavorites)) {
          setFavoriteIds(parsedFavorites)
        } else {
          setFavoriteIds([])
        }
      } else {
        setFavoriteIds([])
      }
    } catch (error) {
      console.error("Error loading favorites:", error)
      setFavoriteIds([])
    } finally {
      setLoading(false)
    }
  }

  // Save favorites to localStorage
  const saveFavorites = () => {
    try {
      if (typeof window === "undefined" || !user) return

      const storageKey = `holacupid_favorites_${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(favoriteIds))
    } catch (error) {
      console.error("Error saving favorites:", error)
    }
  }

  // Add a profile to favorites
  const addFavorite = async (profileId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add favorites",
        variant: "destructive",
      })
      return { success: false, error: "Authentication required" }
    }

    if (favoriteIds.includes(profileId)) {
      toast({
        title: "Already in favorites",
        description: "This profile is already in your favorites",
        variant: "destructive",
      })
      return { success: false, error: "Already in favorites" }
    }

    try {
      setFavoriteIds((prev) => [...prev, profileId])
      toast({
        title: "Added to favorites",
        description: "Profile has been added to your favorites",
      })
      return { success: true }
    } catch (error: any) {
      console.error("Error in addFavorite:", error)
      return { success: false, error: error.message }
    }
  }

  // Remove a profile from favorites
  const removeFavorite = async (profileId: number) => {
    if (!user) return { success: false, error: "Authentication required" }

    try {
      setFavoriteIds((prev) => prev.filter((id) => id !== profileId))
      toast({
        title: "Removed from favorites",
        description: "Profile has been removed from your favorites",
      })
      return { success: true }
    } catch (error: any) {
      console.error("Error in removeFavorite:", error)
      return { success: false, error: error.message }
    }
  }

  // Check if a profile is in favorites
  const isFavorite = (profileId: number) => {
    return favoriteIds.includes(profileId)
  }

  // Toggle favorite status
  const toggleFavorite = async (profileId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add favorites",
        variant: "destructive",
      })
      return { success: false, error: "Authentication required" }
    }

    if (isFavorite(profileId)) {
      return removeFavorite(profileId)
    } else {
      return addFavorite(profileId)
    }
  }

  // Get favorite profiles with full data
  const getFavoriteProfiles = (): FavoriteProfile[] => {
    return favoriteIds
      .map((id) => PROFILES_DATA[id])
      .filter((profile): profile is FavoriteProfile => profile !== undefined)
  }

  return {
    favoriteIds,
    favoriteProfiles: getFavoriteProfiles(),
    loading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    loadFavorites,
    count: favoriteIds.length,
  }
}

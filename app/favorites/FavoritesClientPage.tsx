"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MapPin, Check, Loader2 } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { toast } from "sonner"

export default function FavoritesClientPage() {
  const { user } = useAuth()
  const { favoriteProfiles, loading, removeFavorite, count } = useFavorites()
  const { addItem, items } = useCart()
  const [addingToCart, setAddingToCart] = useState<number | null>(null)

  // Check if item is in cart
  const isInCart = (profileId: number) => {
    return items.some((item) => item.id === profileId)
  }

  const handleAddToCart = async (profile: any) => {
    if (isInCart(profile.id)) {
      toast.info(`${profile.name} is already in your cart`)
      return
    }

    setAddingToCart(profile.id)
    try {
      await addItem({
        id: profile.id,
        name: profile.name,
        price: profile.price || 2.0,
        image: profile.image_url || `/placeholder.svg?height=300&width=250&query=${profile.name}`,
        location: profile.location,
      })
      toast.success(`${profile.name} added to cart!`)
      setAddingToCart(null)
    } catch (error) {
      toast.error("Failed to add to cart")
      setAddingToCart(null)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to view your favorites</p>
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  if (count === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">No Favorites Yet</h1>
          <p className="text-gray-600 mb-6">Start browsing profiles and add some to your favorites!</p>
          <Button asChild>
            <Link href="/browse">Browse Profiles</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
          <p className="text-gray-600 mt-2">
            {count} {count === 1 ? "profile" : "profiles"} in your favorites
          </p>
        </div>
      </div>

      {/* Updated grid to match browse profiles style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProfiles.map((profile) => (
          <Card key={profile.id} className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <CardContent className="p-0">
              {/* Make entire card clickable to profile page */}
              <Link href={`/profile/${profile.id}`}>
                <div className="relative">
                  {/* Fixed container with consistent aspect ratio */}
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden relative">
                    <Image
                      src={profile.image_url || `/placeholder.svg?height=300&width=250&query=${profile.name}`}
                      alt={profile.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-contain transition-transform duration-300 group-hover:scale-105"
                      priority={profile.featured}
                      style={{
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  {profile.featured && <Badge className="absolute top-2 left-2 bg-pink-500">Featured</Badge>}
                </div>
              </Link>

              <div className="p-4">
                {/* Name and Heart Icon Row */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profile.name}
                    {profile.age ? `, ${profile.age}` : ""}
                  </h3>
                  {/* Heart button for removing from favorites */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 rounded-full text-pink-500 hover:text-pink-600"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeFavorite(profile.id)
                    }}
                  >
                    <Heart className="w-7 h-7 fill-current" />
                  </Button>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{profile.location || "Location not specified"}</span>
                </div>

                {profile.interests && profile.interests.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {profile.interests.slice(0, 3).map((interest: string) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                )}

                <Button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAddToCart(profile)
                  }}
                  disabled={addingToCart === profile.id || isInCart(profile.id)}
                  className={`w-full text-sm ${
                    isInCart(profile.id) ? "bg-green-500 hover:bg-green-600" : "bg-pink-500 hover:bg-pink-600"
                  }`}
                >
                  {addingToCart === profile.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : isInCart(profile.id) ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      In Cart
                    </>
                  ) : (
                    "Add to Cart - $2"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Heart,
  ShoppingCart,
  MapPin,
  Star,
  Shield,
  Camera,
  ChevronLeft,
  ChevronRight,
  Check,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useFavorites } from "@/hooks/use-favorites"
import { toast } from "sonner"
import { AuthModal } from "@/components/auth-modal"
import { EnhancedProfileDetails } from "@/components/enhanced-profile-details"

interface ProfileDetailProps {
  profile: {
    id: string | number
    name: string
    age: number
    location: string
    price: number
    images: string[]
    primaryImage: string
    featured: boolean
    interests: string[]
    description: string
    details: {
      height: string
      education: string
      profession: string
      languages: string[]
      relationship: string
      children: string
      smoking: string
      drinking: string
      body_type?: string
      appearance?: string
      looking_for?: string[]
    }
    // Additional fields that might be available
    contact_info?: {
      email?: string
      phone?: string
      whatsapp?: string
      instagram?: string
      tiktok?: string
      facebook?: string
      telegram?: string
    }
  }
}

export function ProfileDetail({ profile }: ProfileDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [relatedProfilesError, setRelatedProfilesError] = useState<string | null>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { addItem, items } = useCart()
  const { user, signIn, signUp } = useAuth()

  // Use the favorites hook
  const { isFavorite, toggleFavorite, loading: favoritesLoading } = useFavorites()

  // Check if item is in cart
  const isInCart = (profileId: string | number) => {
    return items.some((item) => item.id.toString() === profileId.toString())
  }

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  // Memoized related profiles to prevent re-shuffling on every render
  const relatedProfiles = useMemo(() => {
    console.log("🔍 Generating related profiles for profile ID:", profile.id)

    try {
      // All available profiles for related suggestions
      const allProfiles = [
        { id: "1", name: "Carmen", age: 25, location: "Santo Domingo", image: "/images/carmen-1.jpg" },
        { id: "2", name: "Daniela", age: 28, location: "Santiago", image: "/images/daniela-1.png" },
        { id: "3", name: "Sofia", age: 23, location: "Puerto Plata", image: "/images/sofia-1.jpg" },
        { id: "4", name: "Anyelina", age: 26, location: "La Romana", image: "/images/anyelina-1.jpg" },
        { id: "5", name: "Valentina", age: 24, location: "Punta Cana", image: "/images/valentina-1.png" },
        { id: "6", name: "Dina", age: 27, location: "San Pedro", image: "/images/dina-1.jpg" },
        { id: "11", name: "Scarlett", age: 25, location: "Santo Domingo", image: "/images/scarlett-1.jpg" },
        { id: "12", name: "Isabella", age: 27, location: "Santiago", image: "/images/scarlett-2.jpg" },
        { id: "13", name: "Camila", age: 24, location: "Puerto Plata", image: "/images/scarlett-4.jpg" },
        { id: "14", name: "Lucia", age: 26, location: "La Romana", image: "/images/scarlett-6.jpg" },
        { id: "15", name: "Esperanza", age: 23, location: "Punta Cana", image: "/images/scarlett-7.jpg" },
      ]

      // Filter out current profile (handle both string and number IDs)
      const currentProfileId = profile.id.toString()
      const availableProfiles = allProfiles.filter((p) => p.id !== currentProfileId)

      console.log("📋 Available profiles after filtering:", availableProfiles.length)

      // Use a deterministic shuffle based on current profile ID to ensure consistency
      const seed = currentProfileId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const shuffled = [...availableProfiles].sort((a, b) => {
        const aHash = (a.id + seed).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const bHash = (b.id + seed).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return aHash - bHash
      })

      const selected = shuffled.slice(0, 4)
      console.log(
        "✅ Selected related profiles:",
        selected.map((p) => `${p.name} (ID: ${p.id})`),
      )

      return selected
    } catch (error) {
      console.error("❌ Error generating related profiles:", error)
      setRelatedProfilesError("Failed to load related profiles")
      return []
    }
  }, [profile.id]) // Only recalculate when profile.id changes

  // Handle related profile click with proper error handling
  const handleRelatedProfileClick = useCallback(
    (relatedProfile: { id: string; name: string }) => {
      console.log("🔗 Related profile clicked:", relatedProfile.name, "ID:", relatedProfile.id)

      try {
        // Add loading state feedback
        toast.loading(`Loading ${relatedProfile.name}'s profile...`, { id: "profile-navigation" })

        // Navigate to the profile
        router.push(`/profile/${relatedProfile.id}`)

        // Clear loading toast after a short delay
        setTimeout(() => {
          toast.dismiss("profile-navigation")
        }, 1000)
      } catch (error) {
        console.error("❌ Navigation error:", error)
        toast.error(`Failed to load ${relatedProfile.name}'s profile`)
        toast.dismiss("profile-navigation")
      }
    },
    [router],
  )

  const handleAddToCart = (contactType: "individual" | "bulk") => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (isInCart(profile.id)) {
      toast.info(`${profile.name} is already in your cart`)
      return
    }

    setAddingToCart(true)
    const price = contactType === "individual" ? 2.0 : 1.0

    addItem({
      id: profile.id.toString(),
      name: profile.name,
      price: price,
      image: profile.primaryImage,
      location: profile.location,
    })
      .then(() => {
        toast.success(`${profile.name} added to cart!`)
        setAddingToCart(false)
      })
      .catch(() => {
        toast.error("Failed to add to cart")
        setAddingToCart(false)
      })
  }

  // Handle favorite click
  const handleFavoriteClick = async () => {
    if (!user) {
      toast.error("Please login or register to add to favorites")
      setShowAuthModal(true)
      return
    }

    try {
      await toggleFavorite(profile.id.toString())
    } catch (error) {
      // Error is already handled in the hook with toast
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const { error } = await signIn(email, password)
      if (!error) {
        setShowAuthModal(false)
        toast.success("Welcome back!")
        return { error: null }
      } else {
        toast.error(`Login failed: ${error.message || "Invalid credentials"}`)
        return { error }
      }
    } catch (error: any) {
      toast.error(`Login failed: ${error.message || "Unknown error"}`)
      return { error }
    }
  }

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const { error } = await signUp(email, password, name)
      if (!error) {
        setShowAuthModal(false)
        toast.success("Account created successfully! Welcome to HolaCupid!")
        return { error: null }
      } else {
        toast.error(`Registration failed: ${error.message || "Registration error"}`)
        return { error }
      }
    } catch (error: any) {
      toast.error(`Registration failed: ${error.message || "Unknown error"}`)
      return { error }
    }
  }

  const nextImage = () => {
    if (profile.images.length > 0) {
      setSelectedImage((prev) => (prev + 1) % profile.images.length)
      setImageError(false)
    }
  }

  const prevImage = () => {
    if (profile.images.length > 0) {
      setSelectedImage((prev) => (prev - 1 + profile.images.length) % profile.images.length)
      setImageError(false)
    }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextImage()
    } else if (isRightSwipe) {
      prevImage()
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevImage()
      } else if (e.key === "ArrowRight") {
        nextImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Scroll to top when profile changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [profile.id])

  // Use primary image or first available image
  const displayImages = profile.images.length > 0 ? profile.images : [profile.primaryImage]
  const currentImage = displayImages[selectedImage] || profile.primaryImage

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/browse">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              + Submit Profile
            </Button>
            <Link href="/browse">
              <Button variant="outline" size="sm">
                Browse Profiles
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 gap-6 max-w-7xl mx-auto">
            {/* Photos */}
            <div className="space-y-4">
              {/* Main Image with Swipe */}
              <div className="relative bg-gray-100 rounded-lg group">
                <div
                  ref={imageRef}
                  className="w-full aspect-[3/4] flex items-center justify-center overflow-hidden cursor-pointer select-none relative"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <Image
                    src={imageError ? "/placeholder.svg?height=400&width=300" : currentImage}
                    alt={`${profile.name} - Photo ${selectedImage + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain transition-opacity duration-300"
                    priority
                    draggable={false}
                    onError={() => setImageError(true)}
                    style={{
                      objectPosition: "center",
                    }}
                  />
                </div>

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}

                {/* Badges and Counter */}
                {profile.featured && (
                  <Badge className="absolute top-4 left-4 bg-pink-500">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  <Camera className="w-3 h-3 inline mr-1" />
                  {selectedImage + 1} / {displayImages.length}
                </div>

                {/* Swipe Indicator */}
                {displayImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Swipe or use arrows to navigate
                  </div>
                )}

                {/* Dot Indicators */}
                {displayImages.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {displayImages.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === selectedImage ? "bg-white" : "bg-white/50"
                        }`}
                        onClick={() => setSelectedImage(index)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {displayImages.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {displayImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative rounded-lg overflow-hidden bg-gray-100 transition-all ${
                        selectedImage === index ? "ring-2 ring-pink-500 scale-105" : "hover:scale-105"
                      }`}
                    >
                      <div className="w-full aspect-square relative">
                        <Image
                          src={image || "/placeholder.svg?height=80&width=80"}
                          alt={`${profile.name} - Thumbnail ${index + 1}`}
                          fill
                          sizes="80px"
                          className="object-contain"
                          style={{
                            objectPosition: "center",
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              {/* Profile Header with Heart Icon */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.name}, {profile.age}
                    </h1>
                    {/* Bigger heart button next to name */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFavoriteClick}
                      disabled={favoritesLoading}
                      className={`p-1 rounded-full ${
                        user && isFavorite(profile.id.toString())
                          ? "text-pink-500 hover:text-pink-600"
                          : "text-gray-400 hover:text-pink-500"
                      }`}
                    >
                      <Heart
                        className="w-8 h-8"
                        fill={user && isFavorite(profile.id.toString()) ? "currentColor" : "none"}
                      />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center text-gray-600 mt-2 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{profile.location}</span>
                </div>

                <p className="text-gray-700 leading-relaxed mb-6">{profile.description}</p>
              </div>

              {/* Enhanced Profile Details */}
              <EnhancedProfileDetails profile={profile} />

              {/* Contact Pricing - Mobile */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Contact Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Individual Contact */}
                  <div className="border rounded-lg p-3">
                    <div className="text-center mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">Individual Contact</h3>
                      <div className="text-2xl font-bold text-pink-600">$2</div>
                      <div className="text-xs text-gray-600">1-9 contacts</div>
                    </div>
                    <Button
                      className={`w-full text-sm py-2 ${
                        isInCart(profile.id) ? "bg-green-500 hover:bg-green-600" : "bg-pink-500 hover:bg-pink-600"
                      }`}
                      onClick={() => handleAddToCart("individual")}
                      disabled={addingToCart || isInCart(profile.id)}
                    >
                      {addingToCart ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Adding...
                        </>
                      ) : isInCart(profile.id) ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Bulk Contact */}
                  <div className="border rounded-lg p-3">
                    <div className="text-center mb-3">
                      <h3 className="font-semibold text-gray-900 mb-1 text-sm">10 contacts or more</h3>
                      <div className="text-2xl font-bold text-pink-600">$1</div>
                      <div className="text-xs text-gray-600">per contact</div>
                    </div>
                    <Button
                      variant="outline"
                      className={`w-full text-sm py-2 ${
                        isInCart(profile.id)
                          ? "border-green-500 text-green-600 bg-green-50"
                          : "border-pink-500 text-pink-600 hover:bg-pink-50"
                      }`}
                      onClick={() => handleAddToCart("bulk")}
                      disabled={addingToCart || isInCart(profile.id)}
                    >
                      {addingToCart ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Adding...
                        </>
                      ) : isInCart(profile.id) ? (
                        <>
                          <Check className="w-3 h-3 mr-1" />
                          In Cart
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Secure payment • Instant delivery
                    </div>
                    <p>All contact information is verified and up-to-date</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Similar structure but condensed for brevity */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Left Column - Photos */}
            <div className="col-span-2 space-y-4">
              {/* Main Image */}
              <div className="relative bg-gray-100 rounded-lg group">
                <div className="w-full aspect-[4/5] flex items-center justify-center overflow-hidden cursor-pointer select-none relative">
                  <Image
                    src={imageError ? "/placeholder.svg?height=400&width=300" : currentImage}
                    alt={`${profile.name} - Photo ${selectedImage + 1}`}
                    fill
                    sizes="66vw"
                    className="object-contain transition-opacity duration-300"
                    priority
                    draggable={false}
                    onError={() => setImageError(true)}
                  />
                </div>

                {/* Navigation and indicators similar to mobile */}
                {displayImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={nextImage}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}

                {profile.featured && (
                  <Badge className="absolute top-4 left-4 bg-pink-500">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                  <Camera className="w-3 h-3 inline mr-1" />
                  {selectedImage + 1} / {displayImages.length}
                </div>
              </div>
            </div>

            {/* Right Column - Profile Info (similar to mobile but condensed) */}
            <div className="col-span-1 space-y-6">
              {/* Profile header, details, contact methods, and pricing similar to mobile */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.name}, {profile.age}
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavoriteClick}
                    disabled={favoritesLoading}
                    className={`p-1 rounded-full ${
                      user && isFavorite(profile.id.toString())
                        ? "text-pink-500 hover:text-pink-600"
                        : "text-gray-400 hover:text-pink-500"
                    }`}
                  >
                    <Heart
                      className="w-8 h-8"
                      fill={user && isFavorite(profile.id.toString()) ? "currentColor" : "none"}
                    />
                  </Button>
                </div>
                <div className="flex items-center text-gray-600 mt-2 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
                <p className="text-gray-700 leading-relaxed mb-6">{profile.description}</p>
              </div>

              {/* Enhanced Profile Details */}
              <EnhancedProfileDetails profile={profile} />

              {/* Contact Pricing - Desktop */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Contact Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Individual Contact */}
                    <div className="border rounded-lg p-3">
                      <div className="text-center mb-2">
                        <h3 className="font-semibold text-gray-900 mb-1 text-xs">Individual</h3>
                        <div className="text-xl font-bold text-pink-600">$2</div>
                        <div className="text-xs text-gray-600">1-9 contacts</div>
                      </div>
                      <Button
                        className={`w-full text-xs py-1.5 ${
                          isInCart(profile.id) ? "bg-green-500 hover:bg-green-600" : "bg-pink-500 hover:bg-pink-600"
                        }`}
                        onClick={() => handleAddToCart("individual")}
                        disabled={addingToCart || isInCart(profile.id)}
                      >
                        {addingToCart ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Adding...
                          </>
                        ) : isInCart(profile.id) ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            In Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Bulk Contact */}
                    <div className="border rounded-lg p-3">
                      <div className="text-center mb-2">
                        <h3 className="font-semibold text-gray-900 mb-1 text-xs">Bulk (10+)</h3>
                        <div className="text-xl font-bold text-pink-600">$1</div>
                        <div className="text-xs text-gray-600">each</div>
                      </div>
                      <Button
                        variant="outline"
                        className={`w-full text-xs py-1.5 ${
                          isInCart(profile.id)
                            ? "border-green-500 text-green-600 bg-green-50"
                            : "border-pink-500 text-pink-600 hover:bg-pink-50"
                        }`}
                        onClick={() => handleAddToCart("bulk")}
                        disabled={addingToCart || isInCart(profile.id)}
                      >
                        {addingToCart ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Adding...
                          </>
                        ) : isInCart(profile.id) ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            In Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3 mr-1" />
                            Add to Cart
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 text-center mt-3">
                    <div className="flex items-center justify-center mb-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Secure payment • Instant delivery
                    </div>
                    <p>All contact information is verified and up-to-date</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Related Profiles - FIXED IMPLEMENTATION */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Profiles</h2>

          {relatedProfilesError ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{relatedProfilesError}</p>
              <Button variant="outline" onClick={() => setRelatedProfilesError(null)}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProfiles.map((relatedProfile) => (
                <div
                  key={relatedProfile.id}
                  className="cursor-pointer group"
                  onClick={() => handleRelatedProfileClick(relatedProfile)}
                >
                  <Card className="group-hover:shadow-lg transition-all duration-200 h-full transform group-hover:scale-105">
                    <CardContent className="p-0">
                      <div className="relative bg-gray-100 overflow-hidden rounded-t-lg">
                        <div className="w-full aspect-[3/4] relative">
                          <Image
                            src={relatedProfile.image || "/placeholder.svg?height=300&width=225"}
                            alt={`${relatedProfile.name} - Related Profile`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-contain transition-transform duration-200 group-hover:scale-110"
                            style={{
                              objectPosition: "center",
                            }}
                          />
                        </div>
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">
                            View Profile
                          </span>
                        </div>
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                          {relatedProfile.name}, {relatedProfile.age}
                        </h3>
                        <p className="text-sm text-gray-600">{relatedProfile.location}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </>
  )
}

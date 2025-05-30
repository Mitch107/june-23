"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, ShoppingCart, MapPin, Star, Shield, Camera, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"

interface ProfileDetailProps {
  profile: {
    id: number
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
    }
  }
}

export function ProfileDetail({ profile }: ProfileDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()
  const { user, isFavorite, addToFavorites, removeFromFavorites } = useAuth()

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const handleAddToCart = (contactType: "individual" | "bulk") => {
    const price = contactType === "individual" ? 2.0 : 1.0
    addItem({
      id: profile.id,
      name: profile.name,
      price: price,
      image: profile.primaryImage,
      location: profile.location,
    })
  }

  const handleFavoriteClick = () => {
    if (!user) return

    if (isFavorite(profile.id)) {
      removeFromFavorites(profile.id)
    } else {
      addToFavorites(profile.id)
    }
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % profile.images.length)
    setImageError(false)
  }

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + profile.images.length) % profile.images.length)
    setImageError(false)
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

  return (
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

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {/* Left Column - Photos (Larger) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Image with Swipe */}
          <div className="relative bg-gray-100 rounded-lg group">
            <div
              ref={imageRef}
              className="w-full aspect-[3/4] md:aspect-[2/3] lg:aspect-[3/4] flex items-center justify-center overflow-hidden cursor-pointer select-none relative"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <Image
                src={imageError ? "/placeholder.svg" : profile.images[selectedImage] || "/placeholder.svg"}
                alt={`${profile.name} - Photo ${selectedImage + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 40vw"
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
            {profile.images.length > 1 && (
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
              {selectedImage + 1} / {profile.images.length}
            </div>

            {/* Swipe Indicator */}
            {profile.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                Swipe or use arrows to navigate
              </div>
            )}

            {/* Dot Indicators */}
            {profile.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {profile.images.map((_, index) => (
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
          <div className="grid grid-cols-5 gap-2">
            {profile.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative rounded-lg overflow-hidden bg-gray-100 transition-all ${
                  selectedImage === index ? "ring-2 ring-pink-500 scale-105" : "hover:scale-105"
                }`}
              >
                <div className="w-full aspect-square relative">
                  <Image
                    src={image || "/placeholder.svg"}
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
        </div>

        {/* Middle Column - Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Header */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profile.name}, {profile.age}
                </h1>
                <div className="flex items-center text-gray-600 mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
              </div>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFavoriteClick}
                  className={isFavorite(profile.id) ? "text-pink-500" : "text-gray-400"}
                >
                  <Heart className="w-5 h-5" fill={isFavorite(profile.id) ? "currentColor" : "none"} />
                </Button>
              )}
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">{profile.description}</p>
          </div>

          {/* Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Height</span>
                  <div className="text-gray-600">{profile.details.height}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Languages</span>
                  <div className="text-gray-600">
                    {profile.details.languages.map((lang, index) => (
                      <span key={lang}>
                        ★ {lang}
                        {index < profile.details.languages.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Education</span>
                  <div className="text-gray-600">{profile.details.education}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Interests</span>
                  <div className="text-gray-600">
                    {profile.interests.map((interest, index) => (
                      <span key={interest}>
                        ☆ {interest}
                        {index < profile.interests.length - 1 ? " " : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Contact Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Contact Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">WhatsApp</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Instagram</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Email</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Compact Pricing */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Contact Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Individual Contact */}
              <div className="border rounded-lg p-3">
                <div className="text-center mb-3">
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">Individual Contact</h3>
                  <div className="text-2xl font-bold text-pink-600">$2</div>
                </div>
                <Button
                  className="w-full bg-pink-500 hover:bg-pink-600 text-sm py-2"
                  onClick={() => handleAddToCart("individual")}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Add to Cart
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
                  className="w-full border-pink-500 text-pink-600 hover:bg-pink-50 text-sm py-2"
                  onClick={() => handleAddToCart("bulk")}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  Add to Cart
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

      {/* Related Profiles */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Profiles</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "Isabella", age: 27, location: "Santiago", image: "/images/daniela-1.png" },
            { name: "Camila", age: 22, location: "Punta Cana", image: "/images/perla-1.png" },
            { name: "Valentina", age: 26, location: "La Romana", image: "/images/valentina-1.png" },
            { name: "Lucia", age: 25, location: "Puerto Plata", image: "/images/yoselin-1.jpg" },
          ].map((relatedProfile, index) => (
            <Card key={index} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="relative bg-gray-100">
                  <div className="w-full aspect-[3/4] relative">
                    <Image
                      src={relatedProfile.image || "/placeholder.svg"}
                      alt={relatedProfile.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-contain"
                      style={{
                        objectPosition: "center",
                      }}
                    />
                  </div>
                </div>
                <div className="p-3 text-center">
                  <h3 className="font-semibold text-gray-900">
                    {relatedProfile.name}, {relatedProfile.age}
                  </h3>
                  <p className="text-sm text-gray-600">{relatedProfile.location}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}

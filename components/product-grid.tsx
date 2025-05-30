"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import Link from "next/link"

// Sample data with real photos - prices removed from display
const profiles = [
  {
    id: 1,
    name: "Carmen",
    age: 25,
    location: "Santo Domingo, DO",
    price: 29.99,
    images: [
      "/images/carmen-1.jpg",
      "/images/daniela-1.png",
      "/images/sofia-1.jpg",
      "/images/anyelina-1.jpg",
      "/images/valentina-1.png",
    ],
    primaryImage: "/images/carmen-1.jpg",
    featured: true,
    interests: ["Travel", "Music", "Dancing", "Fashion", "Photography"],
    description: "Outgoing and adventurous, loves exploring new places and meeting new people.",
  },
  {
    id: 2,
    name: "Daniela",
    age: 28,
    location: "Santiago, DO",
    price: 24.99,
    images: [
      "/images/daniela-1.png",
      "/images/dina-1.jpg",
      "/images/perla-1.png",
      "/images/osmaily-1.jpg",
      "/images/idelsy-1.jpg",
    ],
    primaryImage: "/images/daniela-1.png",
    featured: false,
    interests: ["Art", "Cooking", "Reading", "Fitness", "Movies"],
    description: "Creative soul with a passion for art and culinary adventures.",
  },
  {
    id: 3,
    name: "Sofia",
    age: 23,
    location: "Puerto Plata, DO",
    price: 34.99,
    images: [
      "/images/sofia-1.jpg",
      "/images/yoselin-1.jpg",
      "/images/carmen-1.jpg",
      "/images/valentina-1.png",
      "/images/anyelina-1.jpg",
    ],
    primaryImage: "/images/sofia-1.jpg",
    featured: true,
    interests: ["Fitness", "Beach", "Photography", "Travel", "Hiking"],
    description: "Adventure seeker who loves staying active and exploring beautiful destinations.",
  },
  {
    id: 4,
    name: "Anyelina",
    age: 26,
    location: "La Romana, DO",
    price: 27.99,
    images: [
      "/images/anyelina-1.jpg",
      "/images/perla-1.png",
      "/images/dina-1.jpg",
      "/images/daniela-1.png",
      "/images/osmaily-1.jpg",
    ],
    primaryImage: "/images/anyelina-1.jpg",
    featured: false,
    interests: ["Movies", "Nature", "Yoga", "Music", "Dancing"],
    description: "Peaceful and mindful, enjoys connecting with nature and inner wellness.",
  },
  {
    id: 5,
    name: "Valentina",
    age: 24,
    location: "Punta Cana, DO",
    price: 31.99,
    images: [
      "/images/valentina-1.png",
      "/images/idelsy-1.jpg",
      "/images/yoselin-1.jpg",
      "/images/sofia-1.jpg",
      "/images/carmen-1.jpg",
    ],
    primaryImage: "/images/valentina-1.png",
    featured: true,
    interests: ["Swimming", "Salsa", "Languages", "Travel", "Culture"],
    description: "Multilingual dancer who loves water sports and cultural experiences.",
  },
  {
    id: 6,
    name: "Dina",
    age: 27,
    location: "San Pedro, DO",
    price: 26.99,
    images: [
      "/images/dina-1.jpg",
      "/images/osmaily-1.jpg",
      "/images/anyelina-1.jpg",
      "/images/perla-1.png",
      "/images/daniela-1.png",
    ],
    primaryImage: "/images/dina-1.jpg",
    featured: false,
    interests: ["Fashion", "Business", "Travel", "Photography", "Art"],
    description: "Ambitious entrepreneur with an eye for style and business opportunities.",
  },
  // NEW PROFILES USING SCARLETT'S PHOTOS
  {
    id: 11,
    name: "Scarlett",
    age: 25,
    location: "Santo Domingo, DO",
    price: 28.99,
    images: [
      "/images/scarlett-1.jpg",
      "/images/scarlett-2.jpg",
      "/images/scarlett-3.jpg",
      "/images/scarlett-4.jpg",
      "/images/scarlett-5.jpg",
    ],
    primaryImage: "/images/scarlett-1.jpg", // Pink crop top with jeans
    featured: true,
    interests: ["Fashion", "Photography", "Music", "Shopping", "Social Media"],
    description:
      "Fashion-forward and stylish, loves capturing the perfect selfie and staying on top of the latest trends.",
  },
  {
    id: 12,
    name: "Isabella",
    age: 27,
    location: "Santiago, DO",
    price: 32.99,
    images: [
      "/images/scarlett-2.jpg",
      "/images/scarlett-4.jpg",
      "/images/scarlett-5.jpg",
      "/images/scarlett-7.jpg",
      "/images/scarlett-8.jpg",
    ],
    primaryImage: "/images/scarlett-2.jpg", // Blue dress indoors
    featured: false,
    interests: ["Elegance", "Fine Dining", "Travel", "Luxury", "Events"],
    description:
      "Sophisticated and elegant, enjoys the finer things in life and loves dressing up for special occasions.",
  },
  {
    id: 13,
    name: "Camila",
    age: 24,
    location: "Puerto Plata, DO",
    price: 30.99,
    images: [
      "/images/scarlett-4.jpg",
      "/images/scarlett-5.jpg",
      "/images/scarlett-6.jpg",
      "/images/scarlett-9.jpg",
      "/images/scarlett-10.jpg",
    ],
    primaryImage: "/images/scarlett-4.jpg", // Blue dress at sunset
    featured: true,
    interests: ["Sunsets", "Photography", "Nature", "Romance", "Beauty"],
    description: "Romantic soul who loves golden hour photography and finding beauty in everyday moments.",
  },
  {
    id: 14,
    name: "Lucia",
    age: 26,
    location: "La Romana, DO",
    price: 29.99,
    images: [
      "/images/scarlett-6.jpg",
      "/images/scarlett-9.jpg",
      "/images/scarlett-10.jpg",
      "/images/scarlett-1.jpg",
      "/images/scarlett-3.jpg",
    ],
    primaryImage: "/images/scarlett-6.jpg", // Red top with jeans outdoors
    featured: false,
    interests: ["Casual Style", "Outdoor Activities", "Comfort", "Simplicity", "Authenticity"],
    description: "Down-to-earth and genuine, prefers comfortable casual style and enjoys spending time outdoors.",
  },
  {
    id: 15,
    name: "Esperanza",
    age: 23,
    location: "Punta Cana, DO",
    price: 27.99,
    images: [
      "/images/scarlett-7.jpg",
      "/images/scarlett-8.jpg",
      "/images/scarlett-2.jpg",
      "/images/scarlett-4.jpg",
      "/images/scarlett-5.jpg",
    ],
    primaryImage: "/images/scarlett-7.jpg", // White dress mirror selfie
    featured: true,
    interests: ["Elegance", "White Fashion", "Minimalism", "Self-Care", "Confidence"],
    description:
      "Confident and poised, loves classic white outfits and believes in the power of simplicity and elegance.",
  },
]

export function ProductGrid() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isFavorite, addToFavorites, removeFromFavorites, login, register } = useAuth()

  const handleFavoriteClick = (profileId: number) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (isFavorite(profileId)) {
      removeFromFavorites(profileId)
    } else {
      addToFavorites(profileId)
    }
  }

  const handleLogin = (email: string, password: string) => {
    if (login(email, password)) {
      setShowAuthModal(false)
    } else {
      alert("Invalid credentials")
    }
  }

  const handleRegister = (email: string, password: string, name: string) => {
    if (register(email, password, name)) {
      setShowAuthModal(false)
    } else {
      alert("Registration failed")
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id} className="group hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            <CardContent className="p-0">
              <Link href={`/profile/${profile.id}`}>
                <div className="relative">
                  {/* Fixed container with consistent aspect ratio */}
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden relative">
                    <Image
                      src={profile.primaryImage || "/placeholder.svg"}
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

              <Button
                variant="ghost"
                size="sm"
                className={`absolute top-2 right-2 w-8 h-8 rounded-full ${
                  user && isFavorite(profile.id) ? "bg-pink-500 text-white" : "bg-white/80 text-gray-600"
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleFavoriteClick(profile.id)
                }}
              >
                <Heart className="w-4 h-4" fill={user && isFavorite(profile.id) ? "currentColor" : "none"} />
              </Button>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {profile.name}, {profile.age}
                  </h3>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{profile.location}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {profile.interests.slice(0, 3).map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </>
  )
}

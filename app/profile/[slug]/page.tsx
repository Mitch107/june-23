import { notFound } from "next/navigation"
import { ProfileDetail } from "@/components/profile-detail"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"

interface Profile {
  id: string
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

// Fallback sample profiles
const sampleProfiles: Profile[] = [
  {
    id: "1",
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
    interests: ["Dancing", "Beach", "Music", "Travel"],
    description:
      "I love dancing bachata and exploring the beautiful beaches of my country. Looking for someone who appreciates life's simple pleasures.",
    details: {
      height: "5'6\"",
      education: "Not specified",
      profession: "Marketing Specialist",
      languages: ["Spanish", "English"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "Socially",
    },
  },
  {
    id: "2",
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
    interests: ["Art", "Cooking", "Reading", "Fitness"],
    description:
      "Creative soul with a passion for art and culinary adventures. I love experimenting in the kitchen and creating new recipes.",
    details: {
      height: "5'4\"",
      education: "Art School Graduate",
      profession: "Graphic Designer",
      languages: ["Spanish", "English", "French"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "Occasionally",
    },
  },
  {
    id: "3",
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
    interests: ["Fitness", "Beach", "Photography", "Travel"],
    description:
      "Adventure seeker who loves staying active and exploring beautiful destinations. Fitness is a big part of my life.",
    details: {
      height: "5'7\"",
      education: "Tourism Management",
      profession: "Travel Blogger",
      languages: ["Spanish", "English"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "No",
    },
  },
  {
    id: "4",
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
    description:
      "Peaceful and mindful, enjoys connecting with nature and inner wellness. I love practicing yoga and finding balance in life.",
    details: {
      height: "5'3\"",
      education: "Wellness Studies",
      profession: "Yoga Instructor",
      languages: ["Spanish", "English"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "No",
    },
  },
  {
    id: "5",
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
    description:
      "Multilingual dancer who loves water sports and cultural experiences. I speak three languages and love teaching salsa dancing.",
    details: {
      height: "5'6\"",
      education: "International Relations",
      profession: "Dance Instructor",
      languages: ["Spanish", "English", "Portuguese"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "Socially",
    },
  },
]

async function getProfile(slug: string): Promise<Profile | null> {
  console.log("=== PROFILE LOOKUP START ===")
  console.log("Looking for profile with slug:", slug)

  // Check what type of identifier we have
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)
  const isNumeric = /^\d+$/.test(slug)

  console.log("Slug type - UUID:", isUUID, "Numeric:", isNumeric)

  // If it's a numeric ID, use sample profiles directly (don't query database)
  if (isNumeric) {
    console.log("Numeric ID detected, using sample profiles...")
    const numericId = Number.parseInt(slug)
    const sampleProfile = sampleProfiles.find((p) => Number.parseInt(p.id) === numericId)

    if (sampleProfile) {
      console.log("Found sample profile:", sampleProfile.name)
      console.log("=== PROFILE LOOKUP SUCCESS (SAMPLE) ===")
      return sampleProfile
    } else {
      console.log("No sample profile found for ID:", numericId)
      console.log(
        "Available sample IDs:",
        sampleProfiles.map((p) => p.id),
      )
      // Return first sample profile as fallback
      console.log("Using first sample profile as fallback:", sampleProfiles[0].name)
      return sampleProfiles[0]
    }
  }

  // For UUIDs and name-based slugs, try database lookup
  try {
    const supabase = createClient()
    console.log("Attempting database lookup...")

    let query = supabase
      .from("profiles")
      .select(`
        id,
        name,
        age,
        location,
        description,
        interests,
        height,
        education,
        profession,
        languages,
        relationship_status,
        children,
        smoking,
        drinking,
        status,
        profile_images (
          id,
          image_url,
          is_primary
        )
      `)
      .eq("status", "approved")

    if (isUUID) {
      console.log("Querying by UUID:", slug)
      query = query.eq("id", slug)
    } else {
      console.log("Querying by name-based slug:", slug)
      const nameFromSlug = slug.split("-")[0]
      query = query.ilike("name", `${nameFromSlug}%`)
    }

    const { data: profiles, error } = await query

    if (error) {
      console.error("Database query error:", error)
      // Fallback to sample profiles
      console.log("Database error, falling back to sample profiles...")
      return sampleProfiles[0]
    }

    console.log("Database query successful. Results:", profiles?.length || 0)

    const profile = Array.isArray(profiles) ? profiles[0] : profiles

    if (profile) {
      console.log("Found database profile:", profile.name)

      // Transform database profile
      const transformedProfile: Profile = {
        id: profile.id,
        name: profile.name || "Unknown",
        age: profile.age || 25,
        location: profile.location || "Dominican Republic",
        price: 29.99,
        images: profile.profile_images?.map((img: any) => img.image_url) || [],
        primaryImage:
          profile.profile_images?.find((img: any) => img.is_primary)?.image_url ||
          profile.profile_images?.[0]?.image_url ||
          "/placeholder.svg?height=400&width=300",
        featured: false,
        interests: Array.isArray(profile.interests)
          ? profile.interests
          : profile.interests
            ? profile.interests.split(",").map((i: string) => i.trim())
            : [],
        description: profile.description || "No description available.",
        details: {
          height: profile.height || "Not specified",
          education: profile.education || "Not specified",
          profession: profile.profession || "Not specified",
          languages: Array.isArray(profile.languages)
            ? profile.languages
            : profile.languages
              ? profile.languages.split(",").map((l: string) => l.trim())
              : ["Spanish"],
          relationship: profile.relationship_status || "Single",
          children: profile.children || "No",
          smoking: profile.smoking || "No",
          drinking: profile.drinking || "Socially",
        },
      }

      console.log("=== PROFILE LOOKUP SUCCESS (DATABASE) ===")
      return transformedProfile
    }
  } catch (error) {
    console.error("Database connection error:", error)
  }

  // Final fallback to sample profiles
  console.log("No database profile found, using sample profile fallback...")
  const nameFromSlug = slug.split("-")[0].toLowerCase()
  const sampleProfile = sampleProfiles.find((p) => p.name.toLowerCase().includes(nameFromSlug)) || sampleProfiles[0]

  console.log("Using sample profile:", sampleProfile.name)
  console.log("=== PROFILE LOOKUP SUCCESS (SAMPLE FALLBACK) ===")
  return sampleProfile
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const profile = await getProfile(params.slug)

  if (!profile) {
    return {
      title: "Profile Not Found | HolaCupid",
      description: "The requested profile could not be found.",
    }
  }

  const city = profile.location.split(",")[0].trim()
  const firstName = profile.name.split(" ")[0]
  const seoTitle = `${firstName} - Single Dominican Woman from ${city} | Contact Info Available`

  return {
    title: seoTitle,
    description: `Meet ${profile.name}, a ${profile.age}-year-old single Dominican woman from ${city}. ${profile.description} Get verified contact information and connect today.`,
    keywords: [
      `${firstName} Dominican woman`,
      `single Dominican woman ${city}`,
      `Dominican dating ${city}`,
      `${firstName} contact information`,
      ...profile.interests.map((interest) => `${interest} Dominican woman`),
      "verified contact information",
      "Dominican Republic dating",
    ],
    openGraph: {
      title: seoTitle,
      description: `Meet ${profile.name}, a ${profile.age}-year-old single Dominican woman from ${city}. ${profile.description}`,
      images: [
        {
          url: profile.primaryImage,
          width: 800,
          height: 1067,
          alt: `${profile.name} - Single Dominican woman from ${city}`,
        },
      ],
      type: "profile",
      url: `https://holacupid.com/profile/${params.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: `Meet ${profile.name}, a ${profile.age}-year-old single Dominican woman from ${city}.`,
      images: [profile.primaryImage],
    },
    alternates: {
      canonical: `https://holacupid.com/profile/${params.slug}`,
    },
  }
}

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  console.log("ProfilePage rendering for slug:", params.slug)

  const profile = await getProfile(params.slug)

  if (!profile) {
    console.log("No profile found, showing 404")
    notFound()
  }

  console.log("Rendering profile:", profile.name)

  const city = profile.location.split(",")[0].trim()
  const firstName = profile.name.split(" ")[0]

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `https://holacupid.com/profile/${params.slug}#person`,
    name: `${profile.name} - Single Dominican woman from ${city}`,
    description: profile.description,
    age: profile.age,
    nationality: "Dominican",
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: "Dominican Republic",
    },
    image: profile.primaryImage,
    url: `https://holacupid.com/profile/${params.slug}`,
    knowsLanguage: profile.details.languages,
    height: profile.details.height,
    jobTitle: profile.details.profession,
    alumniOf: profile.details.education,
    interestIn: profile.interests,
    offers: {
      "@type": "Offer",
      name: "Contact Information",
      description: "Verified contact information including phone, email, and social media",
      price: "2.00",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "HolaCupid",
      },
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }} />

      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <h1 className="sr-only">
            {firstName} - Single Dominican Woman from {city} | Contact Information Available
          </h1>
          <ProfileDetail profile={profile} />
        </main>
        <Footer />
      </div>
    </>
  )
}

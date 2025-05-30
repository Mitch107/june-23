import { notFound } from "next/navigation"
import { ProfileDetail } from "@/components/profile-detail"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

// Sample data - in a real app, this would come from a database
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
    description:
      "Ambitious entrepreneur with an eye for style and business opportunities. I run my own fashion boutique and love discovering new trends.",
    details: {
      height: "5'5\"",
      education: "Business Administration",
      profession: "Fashion Boutique Owner",
      languages: ["Spanish", "English"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "Wine with dinner",
    },
  },
  // NEW PROFILES
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
    primaryImage: "/images/scarlett-1.jpg",
    featured: true,
    interests: ["Fashion", "Photography", "Music", "Shopping"],
    description:
      "Fashion-forward and stylish, I love capturing the perfect selfie and staying on top of the latest trends. Always looking for new styles to try.",
    details: {
      height: "5'5\"",
      education: "Fashion Design",
      profession: "Fashion Influencer",
      languages: ["Spanish", "English"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "Socially",
    },
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
    primaryImage: "/images/scarlett-2.jpg",
    featured: false,
    interests: ["Elegance", "Fine Dining", "Travel", "Luxury"],
    description:
      "Sophisticated and elegant, I enjoy the finer things in life and love dressing up for special occasions. Quality over quantity is my motto.",
    details: {
      height: "5'6\"",
      education: "Business Administration",
      profession: "Event Coordinator",
      languages: ["Spanish", "English", "Italian"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "Wine occasionally",
    },
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
    primaryImage: "/images/scarlett-4.jpg",
    featured: true,
    interests: ["Sunsets", "Photography", "Nature", "Romance"],
    description:
      "Romantic soul who loves golden hour photography and finding beauty in everyday moments. I believe in love and magic in simple things.",
    details: {
      height: "5'5\"",
      education: "Photography",
      profession: "Photographer",
      languages: ["Spanish", "English"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "No",
    },
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
    primaryImage: "/images/scarlett-6.jpg",
    featured: false,
    interests: ["Casual Style", "Outdoor Activities", "Comfort", "Authenticity"],
    description:
      "Down-to-earth and genuine, I prefer comfortable casual style and enjoy spending time outdoors. Authenticity is what matters most to me.",
    details: {
      height: "5'4\"",
      education: "Environmental Science",
      profession: "Park Ranger",
      languages: ["Spanish", "English"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "Rarely",
    },
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
    primaryImage: "/images/scarlett-7.jpg",
    featured: true,
    interests: ["Elegance", "White Fashion", "Minimalism", "Self-Care"],
    description:
      "Confident and poised, I love classic white outfits and believe in the power of simplicity and elegance. Less is always more.",
    details: {
      height: "5'5\"",
      education: "Psychology",
      profession: "Wellness Coach",
      languages: ["Spanish", "English"],
      relationship: "Single",
      children: "No",
      smoking: "No",
      drinking: "Occasionally",
    },
  },
]

export default function ProfilePage({ params }: { params: { id: string } }) {
  const profile = profiles.find((p) => p.id === Number.parseInt(params.id))

  if (!profile) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ProfileDetail profile={profile} />
      <Footer />
    </div>
  )
}

export function generateStaticParams() {
  return profiles.map((profile) => ({
    id: profile.id.toString(),
  }))
}

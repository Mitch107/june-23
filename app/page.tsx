import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "HolaCupid - Connect with Amazing People from Dominican Republic",
  description:
    "Discover verified profiles from the Dominican Republic. Connect with amazing people from Santo Domingo, Santiago, Puerto Plata, and more cities. Authentic connections start here.",
  keywords: [
    "Dominican Republic dating",
    "Santo Domingo connections",
    "Santiago profiles",
    "Puerto Plata dating",
    "Dominican women",
    "Caribbean connections",
    "verified profiles",
    "authentic dating",
  ],
  openGraph: {
    title: "HolaCupid - Connect with Amazing People from Dominican Republic",
    description:
      "Discover verified profiles from the Dominican Republic. Authentic connections with amazing people from major cities.",
    images: ["/images/og-home.jpg"],
    type: "website",
  },
  alternates: {
    canonical: "https://holacupid.com",
  },
}

const homePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://holacupid.com/#website",
  url: "https://holacupid.com",
  name: "HolaCupid",
  description: "Connect with amazing people from Dominican Republic",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://holacupid.com/browse?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageJsonLd) }} />

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="relative text-white py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {/* Dark overlay for text contrast */}
            <div className="absolute inset-0 bg-black/50 z-10"></div>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000 ease-out"
              style={{
                backgroundImage: `url('/images/hero-collage-new.jpg')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 text-center relative z-20">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-2xl text-shadow-lg">
              Connect with Amazing People
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto drop-shadow-xl text-shadow">
              Discover verified profiles from the Dominican Republic and beyond. Authentic connections start here.
            </p>
            <div className="flex justify-center">
              <Link href="/browse">
                <Button
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-gray-100 shadow-xl border-2 border-white/20 transition-all duration-300 hover:scale-105"
                >
                  Browse Profiles
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Profiles */}
        <main className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Profiles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Meet amazing people from the Dominican Republic. All profiles are verified for authenticity.
            </p>
          </div>

          <Suspense fallback={<LoadingSkeleton />}>
            <ProductGrid />
          </Suspense>

          <div className="text-center mt-12">
            <Link href="/browse">
              <Button size="lg" className="bg-pink-600 hover:bg-pink-700">
                View All Profiles
              </Button>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

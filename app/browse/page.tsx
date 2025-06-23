import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { SearchFilters } from "@/components/search-filters"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Verified Profiles | HolaCupid - Dominican Republic Connections",
  description:
    "Browse verified profiles from the Dominican Republic. Find amazing people from Santo Domingo, Santiago, Puerto Plata, and more. Instant access to contact information.",
  keywords: [
    "browse profiles Dominican Republic",
    "verified Dominican women",
    "Santo Domingo profiles",
    "Santiago connections",
    "Puerto Plata contacts",
    "Dominican Republic dating",
    "authentic profiles",
    "verified contact information",
  ],
  openGraph: {
    title: "Browse Verified Profiles | HolaCupid",
    description:
      "Browse verified profiles from the Dominican Republic. Find amazing people and get instant access to contact information.",
    images: ["/images/og-browse.jpg"],
  },
  alternates: {
    canonical: "https://holacupid.com/browse",
  },
}

const browsePageJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://holacupid.com/browse#webpage",
  url: "https://holacupid.com/browse",
  name: "Browse Verified Profiles - HolaCupid",
  description: "Browse verified profiles from the Dominican Republic",
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://holacupid.com/#website",
  },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: 15,
    itemListElement: [
      {
        "@type": "Person",
        name: "Verified Profile",
        description: "Authentic profile from Dominican Republic",
      },
    ],
  },
}

function LoadingSkeleton() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      role="status"
      aria-label="Loading profiles"
    >
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

export default function BrowsePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(browsePageJsonLd) }} />

      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="container mx-auto px-4 py-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Verified Profiles</h1>
            <p className="text-gray-600">
              Discover and connect with amazing people from the Dominican Republic and beyond
            </p>
          </header>

          <section className="mb-8" aria-label="Search and filter options">
            <SearchFilters />
          </section>

          <section aria-label="Profile listings">
            <Suspense fallback={<LoadingSkeleton />}>
              <ProductGrid />
            </Suspense>
          </section>
        </main>
        <Footer />
      </div>
    </>
  )
}

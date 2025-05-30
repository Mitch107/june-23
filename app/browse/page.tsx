import { Suspense } from "react"
import { ProductGrid } from "@/components/product-grid"
import { SearchFilters } from "@/components/search-filters"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Profiles</h1>
          <p className="text-gray-600">Discover and connect with amazing people from around the world</p>
        </div>

        <div className="mb-8">
          <SearchFilters />
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <ProductGrid />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

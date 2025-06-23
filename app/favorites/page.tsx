import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import FavoritesClientPage from "./FavoritesClientPage"

export const metadata: Metadata = {
  title: "Your Favorites | HolaCupid",
  description: "View and manage your favorite profiles on HolaCupid",
}

export default function FavoritesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <FavoritesClientPage />
      </main>
      <Footer />
    </>
  )
}

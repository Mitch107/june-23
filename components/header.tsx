"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Search, Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { AuthModal } from "@/components/auth-modal"
import { useFavorites } from "@/hooks/use-favorites"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { items } = useCart()
  const { user, signOut, signIn, signUp, loading } = useAuth()
  const { favorites } = useFavorites()
  const favoritesCount = favorites?.length || 0

  const scrollToHowItWorks = () => {
    const element = document.getElementById("how-it-works")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const { error } = await signIn(email, password)
      if (!error) {
        setShowAuthModal(false)
        return { error: null }
      } else {
        return { error }
      }
    } catch (error) {
      return { error }
    }
  }

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const { error } = await signUp(email, password, name)
      if (!error) {
        setShowAuthModal(false)
        return { error: null }
      } else {
        return { error }
      }
    } catch (error) {
      return { error }
    }
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">HC</span>
              </div>
              <span className="text-xl font-bold text-gray-900">HolaCupid</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input type="search" placeholder="Search profiles..." className="pl-10 w-full" />
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/browse" className="text-gray-700 hover:text-pink-600 transition-colors">
                Browse
              </Link>
              <button onClick={scrollToHowItWorks} className="text-gray-700 hover:text-pink-600 transition-colors">
                How It Works
              </button>
              {/* Favorites link in main nav */}
              <Link href="/favorites" className="text-gray-700 hover:text-pink-600 transition-colors relative">
                Favorites
                {favoritesCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs min-w-[18px] h-4 flex items-center justify-center rounded-full">
                    {favoritesCount}
                  </Badge>
                )}
              </Link>
              <Link href="/submit-profile">
                <Button variant="outline" size="sm">
                  + Submit Profile
                </Button>
              </Link>
            </nav>

            {/* User Actions - NO ADMIN BUTTON */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Hi, {user.email}</span>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setShowAuthModal(true)}>
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )}

              {/* Cart button - ALWAYS SHOWS QUANTITY */}
              <Link href="/cart" className="relative">
                <Button variant="outline" size="sm" className="relative bg-pink-50 border-pink-200 hover:bg-pink-100">
                  <ShoppingCart className="w-4 h-4 text-pink-600" />
                  <span className="ml-2 text-pink-600">Cart</span>
                  {items.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs bg-pink-500">
                      {items.length}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input type="search" placeholder="Search profiles..." className="pl-10 w-full" />
                </div>
                <Link href="/browse" className="text-gray-700 hover:text-pink-600 transition-colors">
                  Browse
                </Link>
                <button
                  onClick={scrollToHowItWorks}
                  className="text-gray-700 hover:text-pink-600 transition-colors text-left"
                >
                  How It Works
                </button>
                {/* Favorites in mobile menu */}
                <Link href="/favorites" className="text-gray-700 hover:text-pink-600 transition-colors">
                  Favorites {favoritesCount > 0 && `(${favoritesCount})`}
                </Link>
                <Link href="/submit-profile">
                  <Button variant="outline" size="sm">
                    + Submit Profile
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    </>
  )
}

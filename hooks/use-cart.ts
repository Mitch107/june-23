"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

// Define types
interface CartItem {
  id: number
  name: string
  price: number
  image: string
  location: string
}

interface CartTotal {
  item_count: number
  subtotal: number
  processing_fee: number
  total: number
}

export function useCart() {
  const { user } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  // Calculate cart totals
  const calculateTotal = (cartItems: CartItem[]): CartTotal => {
    const itemCount = cartItems.length
    const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0)

    // Apply bulk discount: $2 each for 1-9 items, $1 each for 10+ items
    const discountedSubtotal = itemCount >= 10 ? itemCount : subtotal

    const processingFee = Math.round((discountedSubtotal * 0.029 + 0.3) * 100) / 100
    const total = Math.round((discountedSubtotal + processingFee) * 100) / 100

    return {
      item_count: itemCount,
      subtotal: discountedSubtotal,
      processing_fee: processingFee,
      total,
    }
  }

  // Load cart from localStorage with better session handling
  useEffect(() => {
    const loadCart = () => {
      try {
        if (typeof window === "undefined") return

        setLoading(true)

        // Use a more persistent storage key
        const storageKey = user ? `holacupid_cart_${user.id}` : "holacupid_cart_guest"
        const savedCart = localStorage.getItem(storageKey)

        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          // Validate cart data structure
          if (Array.isArray(parsedCart)) {
            setItems(parsedCart)
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error)
        // Clear corrupted cart data
        if (user) {
          localStorage.removeItem(`holacupid_cart_${user.id}`)
        } else {
          localStorage.removeItem("holacupid_cart_guest")
        }
      } finally {
        setLoading(false)
      }
    }

    loadCart()
  }, [user])

  // Save cart to localStorage with better error handling
  useEffect(() => {
    try {
      if (typeof window === "undefined" || loading) return

      const storageKey = user ? `holacupid_cart_${user.id}` : "holacupid_cart_guest"
      localStorage.setItem(storageKey, JSON.stringify(items))

      // Also save timestamp for session tracking
      localStorage.setItem(`${storageKey}_timestamp`, Date.now().toString())
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }, [items, user, loading])

  // Add item to cart
  const addItem = async (item: { id: number; name: string; price: number; image: string; location: string }) => {
    try {
      // Check if item already exists in cart
      if (items.some((cartItem) => cartItem.id === item.id)) {
        throw new Error("Profile is already in your cart")
      }

      // Add item to cart
      setItems((prev) => [...prev, item])
      return true
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }

  // Remove item from cart
  const removeItem = async (id: number) => {
    try {
      setItems((prev) => prev.filter((item) => item.id !== id))
      return true
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    }
  }

  // Clear entire cart
  const clearAllItems = async () => {
    try {
      setItems([])
      return true
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    }
  }

  // Legacy compatibility method
  const getTotalPrice = () => calculateTotal(items).total

  return {
    items,
    total: calculateTotal(items),
    loading,
    addItem,
    removeItem,
    clearCart: clearAllItems,
    getTotalPrice,
    refreshCart: () => {}, // No-op since we're using client-side storage
  }
}

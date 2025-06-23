"use client"

import { useState, useEffect } from "react"
import { addToCart, removeFromCart, getCartItems, getCartTotal, clearCart } from "@/lib/supabase/cart"
import { useSupabaseAuth } from "./use-supabase-auth"

export function useSupabaseCart() {
  const { user } = useSupabaseAuth()
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState({
    item_count: 0,
    subtotal: 0,
    processing_fee: 0,
    total: 0,
  })
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    if (!user) {
      setItems([])
      setTotal({ item_count: 0, subtotal: 0, processing_fee: 0, total: 0 })
      return
    }

    setLoading(true)
    try {
      const [cartItems, cartTotal] = await Promise.all([getCartItems(), getCartTotal()])
      setItems(cartItems)
      setTotal(cartTotal)
    } catch (error) {
      console.error("Error fetching cart:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [user])

  const addItem = async (profileId: string, price: number) => {
    try {
      await addToCart(profileId, price)
      await fetchCart()
    } catch (error) {
      console.error("Error adding to cart:", error)
      throw error
    }
  }

  const removeItem = async (profileId: string) => {
    try {
      await removeFromCart(profileId)
      await fetchCart()
    } catch (error) {
      console.error("Error removing from cart:", error)
      throw error
    }
  }

  const clearAllItems = async () => {
    try {
      await clearCart()
      await fetchCart()
    } catch (error) {
      console.error("Error clearing cart:", error)
      throw error
    }
  }

  return {
    items,
    total,
    loading,
    addItem,
    removeItem,
    clearAllItems,
    refreshCart: fetchCart,
  }
}

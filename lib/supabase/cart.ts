import { createClient } from "./client"
import { getProfileIdFromSlug } from "@/lib/utils/slug"

export async function addToCart(profileIdentifier: string, price: number) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  // Handle both slug and numeric ID formats
  let profileId: string

  // Check if it's a slug format (contains hyphens)
  if (profileIdentifier.includes("-")) {
    const id = getProfileIdFromSlug(profileIdentifier)
    if (!id) {
      throw new Error(`Profile with slug ${profileIdentifier} not found`)
    }
    profileId = id.toString()
  } else {
    // It's a numeric ID, validate it
    const numericId = Number.parseInt(profileIdentifier, 10)
    if (isNaN(numericId) || numericId < 1 || numericId > 11) {
      throw new Error(`Invalid profile ID: ${profileIdentifier}`)
    }
    profileId = profileIdentifier
  }

  // Validate profile exists in our mock data
  const mockProfiles = [
    { id: "1", name: "Carmen" },
    { id: "2", name: "Daniela" },
    { id: "3", name: "Sofia" },
    { id: "4", name: "Anyelina" },
    { id: "5", name: "Valentina" },
    { id: "6", name: "Dina" },
    { id: "7", name: "Idelsy" },
    { id: "8", name: "Osmaily" },
    { id: "9", name: "Perla" },
    { id: "10", name: "Yoselin" },
    { id: "11", name: "Scarlett" },
  ]

  const profile = mockProfiles.find((p) => p.id === profileId)
  if (!profile) {
    throw new Error(`Profile with ID ${profileId} not found`)
  }

  try {
    // Check if item is already in cart
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id")
      .eq("user_id", user.id)
      .eq("profile_id", profileId)
      .maybeSingle()

    if (existingItem) {
      throw new Error("Profile is already in your cart")
    }

    // Add to cart
    const { data, error } = await supabase
      .from("cart_items")
      .insert({
        user_id: user.id,
        profile_id: profileId,
        price: price,
      })
      .select()
      .single()

    if (error) {
      console.error("Cart insert error:", error)
      throw new Error(`Failed to add profile to cart: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error("Add to cart error:", error)
    throw error
  }
}

export async function removeFromCart(profileIdentifier: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  // Handle both slug and numeric ID formats
  let profileId: string

  if (profileIdentifier.includes("-")) {
    const id = getProfileIdFromSlug(profileIdentifier)
    if (!id) {
      throw new Error(`Profile with slug ${profileIdentifier} not found`)
    }
    profileId = id.toString()
  } else {
    profileId = profileIdentifier
  }

  try {
    const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id).eq("profile_id", profileId)

    if (error) {
      console.error("Cart remove error:", error)
      throw new Error(`Failed to remove profile from cart: ${error.message}`)
    }
  } catch (error) {
    console.error("Remove from cart error:", error)
    throw error
  }
}

export async function getCartItems() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  try {
    // Get cart items
    const { data: cartItems, error } = await supabase.from("cart_items").select("*").eq("user_id", user.id)

    if (error) {
      console.error("Cart fetch error:", error)
      return []
    }

    // Mock profile data to match cart items
    const mockProfiles = [
      { id: "1", name: "Carmen", location: "Santo Domingo, DO", image_url: "/images/carmen-1.jpg" },
      { id: "2", name: "Daniela", location: "Santiago, DO", image_url: "/images/daniela-1.png" },
      { id: "3", name: "Sofia", location: "Puerto Plata, DO", image_url: "/images/sofia-1.jpg" },
      { id: "4", name: "Anyelina", location: "La Romana, DO", image_url: "/images/anyelina-1.jpg" },
      { id: "5", name: "Valentina", location: "Punta Cana, DO", image_url: "/images/valentina-1.png" },
      { id: "6", name: "Dina", location: "San Pedro de Macorís, DO", image_url: "/images/dina-1.jpg" },
      { id: "7", name: "Idelsy", location: "Barahona, DO", image_url: "/images/idelsy-1.jpg" },
      { id: "8", name: "Osmaily", location: "Moca, DO", image_url: "/images/osmaily-1.jpg" },
      { id: "9", name: "Perla", location: "Higüey, DO", image_url: "/images/perla-1.png" },
      { id: "10", name: "Yoselin", location: "Bonao, DO", image_url: "/images/yoselin-1.jpg" },
      { id: "11", name: "Scarlett", location: "Santo Domingo, DO", image_url: "/images/scarlett-1.jpg" },
    ]

    // Combine cart items with profile data
    const enrichedItems = cartItems
      .map((item) => {
        const profile = mockProfiles.find((p) => p.id === item.profile_id)
        return {
          ...item,
          profiles: profile
            ? {
                id: profile.id,
                name: profile.name,
                location: profile.location,
                profile_images: [{ image_url: profile.image_url }],
              }
            : null,
        }
      })
      .filter((item) => item.profiles) // Remove items without matching profiles

    return enrichedItems
  } catch (error) {
    console.error("Get cart items error:", error)
    return []
  }
}

export async function getCartTotal() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { item_count: 0, subtotal: 0, processing_fee: 0, total: 0 }

  try {
    // Get cart items and calculate total manually
    const { data: cartItems, error } = await supabase.from("cart_items").select("price").eq("user_id", user.id)

    if (error) {
      console.error("Cart total error:", error)
      return { item_count: 0, subtotal: 0, processing_fee: 0, total: 0 }
    }

    const itemCount = cartItems.length
    const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0)
    const processingFee = Math.round((subtotal * 0.029 + 0.3) * 100) / 100 // 2.9% + $0.30, rounded to 2 decimals
    const total = Math.round((subtotal + processingFee) * 100) / 100

    return {
      item_count: itemCount,
      subtotal: Math.round(subtotal * 100) / 100,
      processing_fee: processingFee,
      total: total,
    }
  } catch (error) {
    console.error("Get cart total error:", error)
    return { item_count: 0, subtotal: 0, processing_fee: 0, total: 0 }
  }
}

export async function clearCart() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  try {
    const { error } = await supabase.from("cart_items").delete().eq("user_id", user.id)

    if (error) {
      console.error("Cart clear error:", error)
      throw new Error(`Failed to clear cart: ${error.message}`)
    }
  } catch (error) {
    console.error("Clear cart error:", error)
    throw error
  }
}

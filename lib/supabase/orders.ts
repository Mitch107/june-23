import { createClient } from "./client"
import { createServerClient } from "./server"

export async function createOrder(billingEmail: string, billingName: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase.rpc("create_order_from_cart", {
    user_uuid: user.id,
    billing_email_param: billingEmail,
    billing_name_param: billingName,
  })

  if (error) throw error
  return data
}

export async function updateOrderPayment(orderId: string, paymentIntentId: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_intent_id: paymentIntentId,
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deliverContactInfo(orderId: string) {
  const supabase = createClient()

  const { error } = await supabase.rpc("deliver_contact_info", {
    order_uuid: orderId,
  })

  if (error) throw error
}

export async function getUserOrders() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (
        *,
        profiles (
          name,
          location
        )
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function getContactDeliveries() {
  const supabase = createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from("contact_deliveries")
    .select(`
      *,
      profiles (
        name,
        location
      )
    `)
    .eq("user_id", user.id)
    .order("delivered_at", { ascending: false })

  if (error) throw error
  return data || []
}

export async function markContactAccessed(deliveryId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from("contact_deliveries")
    .update({
      accessed_at: new Date().toISOString(),
    })
    .eq("id", deliveryId)

  if (error) throw error
}

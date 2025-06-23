import { createClient } from "@/lib/supabase/client"
import { createServerClient } from "@/lib/supabase/server"
import type { Database } from "@/lib/supabase/types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]
type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"]

export async function getProfiles(filters?: {
  status?: string
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = createServerClient()

  let query = supabase
    .from("profiles")
    .select(`
      *,
      profile_photos (
        id,
        photo_url,
        is_primary
      )
    `)
    .order("created_at", { ascending: false })

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  if (filters?.limit) {
    query = query.limit(filters.limit)
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch profiles: ${error.message}`)
  }

  return data
}

export async function getProfileById(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .select(`
      *,
      profile_photos (
        id,
        photo_url,
        is_primary,
        created_at
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch profile: ${error.message}`)
  }

  return data
}

export async function updateProfileStatus(id: string, status: string, adminId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update profile status: ${error.message}`)
  }

  // Log the admin action
  await supabase.from("admin_activity_log").insert({
    admin_id: adminId,
    action: "update_profile_status",
    details: { profile_id: id, new_status: status },
    timestamp: new Date().toISOString(),
  })

  return data
}

export async function updateProfile(id: string, updates: any, adminId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`)
  }

  // Log the admin action
  await supabase.from("admin_activity_log").insert({
    admin_id: adminId,
    action: "update_profile",
    details: { profile_id: id, updates },
    timestamp: new Date().toISOString(),
  })

  return data
}

export async function createProfile(profile: ProfileInsert) {
  const supabase = createClient()

  const { data, error } = await supabase.from("profiles").insert(profile).select().single()

  if (error) throw error
  return data
}

export async function uploadProfileImage(profileId: string, file: File, isPrimary = false) {
  const supabase = createClient()

  // Upload to Supabase Storage
  const fileExt = file.name.split(".").pop()
  const fileName = `${profileId}/${Date.now()}.${fileExt}`

  const { data: uploadData, error: uploadError } = await supabase.storage.from("profile-images").upload(fileName, file)

  if (uploadError) throw uploadError

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from("profile-images").getPublicUrl(fileName)

  // Save to database
  const { data, error } = await supabase
    .from("profile_photos")
    .insert({
      profile_id: profileId,
      photo_url: publicUrl,
      is_primary: isPrimary,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

// Client-side functions for favorites
export async function toggleFavorite(profileId: string) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  // Check if favorite exists
  const { data: existing } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("profile_id", profileId)
    .single()

  if (existing) {
    // Remove favorite
    const { error } = await supabase.from("user_favorites").delete().eq("user_id", user.id).eq("profile_id", profileId)

    if (error) throw error
    return false
  } else {
    // Add favorite
    const { error } = await supabase.from("user_favorites").insert({
      user_id: user.id,
      profile_id: profileId,
    })

    if (error) throw error
    return true
  }
}

export async function getUserFavorites() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase.from("user_favorites").select("profile_id").eq("user_id", user.id)

  if (error) throw error
  return data.map((fav) => fav.profile_id)
}

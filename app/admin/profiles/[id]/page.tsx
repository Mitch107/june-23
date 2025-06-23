import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import { ProfileDetailAdmin } from "@/components/admin/profile-detail-admin"

export const metadata = {
  title: "Profile Details | Admin | HolaCupid",
  description: "View and edit profile details",
}

export default async function ProfileDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  // Check admin access first
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    notFound()
  }

  const { data: adminProfile } = await supabase.from("user_profiles").select("role").eq("id", user.id).single()

  if (!adminProfile || !["admin", "super_admin"].includes(adminProfile.role)) {
    notFound()
  }

  // Fetch profile details
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`
      *,
      profile_images(
        id, 
        image_url, 
        is_primary, 
        display_order
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !profile) {
    console.error("Profile fetch error:", error)
    notFound()
  }

  // Get the user who created this profile
  const { data: createdByUser } = await supabase
    .from("user_profiles")
    .select("email, full_name")
    .eq("id", profile.created_by)
    .single()

  const profileWithCreator = {
    ...profile,
    created_by_user: createdByUser,
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Details</h1>
      </div>
      <ProfileDetailAdmin profile={profileWithCreator} />
    </div>
  )
}

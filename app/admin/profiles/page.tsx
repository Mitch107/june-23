import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { ProfilesTable } from "@/components/admin/profiles-table"
import { ProfilesTableSkeleton } from "@/components/admin/skeletons"

export const metadata = {
  title: "Profile Management | Admin | HolaCupid",
  description: "Manage profiles on HolaCupid platform",
}

export default async function ProfilesPage({
  searchParams,
}: {
  searchParams: { status?: string; page?: string; query?: string }
}) {
  const supabase = createServerClient()

  const status = searchParams.status || "all"
  const page = Number.parseInt(searchParams.page || "1")
  const query = searchParams.query || ""
  const pageSize = 10

  // Build query
  let profilesQuery = supabase
    .from("profiles")
    .select("*, profile_images(image_url, is_primary)", { count: "exact" })
    .order("created_at", { ascending: false })

  // Apply filters
  if (status !== "all") {
    profilesQuery = profilesQuery.eq("status", status)
  }

  if (query) {
    profilesQuery = profilesQuery.textSearch("search_vector", query)
  }

  // Apply pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data: profiles, count } = await profilesQuery.range(from, to)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Management</h1>

      <Suspense fallback={<ProfilesTableSkeleton />}>
        <ProfilesTable
          profiles={profiles || []}
          totalCount={count || 0}
          currentPage={page}
          pageSize={pageSize}
          status={status}
          query={query}
        />
      </Suspense>
    </div>
  )
}

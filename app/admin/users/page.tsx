import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/server"
import { UsersTable } from "@/components/admin/users-table"
import { UsersTableSkeleton } from "@/components/admin/skeletons"

export const metadata = {
  title: "User Management | Admin | HolaCupid",
  description: "Manage users on HolaCupid platform",
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: { filter?: string; page?: string; query?: string }
}) {
  const supabase = createServerClient()

  const filter = searchParams.filter || "all"
  const page = Number.parseInt(searchParams.page || "1")
  const query = searchParams.query || ""
  const pageSize = 10

  // Build query
  let usersQuery = supabase
    .from("user_profiles")
    .select("*, orders(id, status)", { count: "exact" })
    .order("created_at", { ascending: false })

  // Apply filters
  if (filter === "with_favorites") {
    usersQuery = usersQuery.not("favorite_profiles", "is", null)
  } else if (filter === "with_purchases") {
    usersQuery = usersQuery.not("orders.id", "is", null)
  } else if (filter === "favorites_no_purchases") {
    usersQuery = usersQuery.not("favorite_profiles", "is", null).is("orders.id", null)
  }

  if (query) {
    usersQuery = usersQuery.ilike("email", `%${query}%`)
  }

  // Apply pagination
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data: users, count } = await usersQuery.range(from, to)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>

      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersTable
          users={users || []}
          totalCount={count || 0}
          currentPage={page}
          pageSize={pageSize}
          filter={filter}
          query={query}
        />
      </Suspense>
    </div>
  )
}

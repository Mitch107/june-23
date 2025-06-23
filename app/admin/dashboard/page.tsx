import { createServerClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Admin Dashboard | HolaCupid",
  description: "Admin dashboard for HolaCupid platform",
}

export default async function AdminDashboardPage() {
  const supabase = createServerClient()

  // Get basic stats
  const { count: profileCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: userCount } = await supabase.from("user_profiles").select("*", { count: "exact", head: true })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-500">Total Profiles</h2>
          <p className="text-3xl font-bold">{profileCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold">{userCount || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-500">Admin Status</h2>
          <p className="text-xl font-medium text-green-600">Active</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a href="/admin/profiles" className="bg-blue-50 hover:bg-blue-100 p-4 rounded-md transition-colors">
            <h3 className="font-medium">Manage Profiles</h3>
            <p className="text-sm text-gray-500">Review and approve profiles</p>
          </a>
          <a href="/admin/users" className="bg-purple-50 hover:bg-purple-100 p-4 rounded-md transition-colors">
            <h3 className="font-medium">Manage Users</h3>
            <p className="text-sm text-gray-500">View and manage user accounts</p>
          </a>
          <a href="/admin/orders" className="bg-green-50 hover:bg-green-100 p-4 rounded-md transition-colors">
            <h3 className="font-medium">Manage Orders</h3>
            <p className="text-sm text-gray-500">View and process orders</p>
          </a>
        </div>
      </div>
    </div>
  )
}

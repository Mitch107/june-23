"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, ShoppingCart, FileText } from "lucide-react"
import { ProfileManagement } from "./profile-management"
import { UserManagement } from "./user-management"

interface Statistics {
  profiles: {
    total_profiles: number
    pending_profiles: number
    approved_profiles: number
    rejected_profiles: number
    suspended_profiles: number
  }
  users: {
    total_users: number
    users_with_favorites: number
    users_with_purchases: number
    users_with_favorites_no_purchases: number
  }
  recentActivity: Array<{
    id: string
    action_type: string
    target_type: string
    created_at: string
    user_profiles: {
      full_name: string
      email: string
    }
  }>
}

export function AdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    try {
      const response = await fetch("/api/admin/statistics")
      if (response.ok) {
        const data = await response.json()
        setStatistics(data)
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage profiles, users, and site content</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Profiles</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics?.profiles.total_profiles || 0}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
              <div className="mt-4 flex space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {statistics?.profiles.pending_profiles || 0} pending
                </Badge>
                <Badge variant="default" className="text-xs bg-green-500">
                  {statistics?.profiles.approved_profiles || 0} approved
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics?.users.total_users || 0}</p>
                </div>
                <Users className="w-8 h-8 text-green-500" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  {statistics?.users.users_with_purchases || 0} with purchases
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Users with Favorites</p>
                  <p className="text-3xl font-bold text-gray-900">{statistics?.users.users_with_favorites || 0}</p>
                </div>
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <div className="mt-4">
                <Badge variant="outline" className="text-xs">
                  {statistics?.users.users_with_favorites_no_purchases || 0} no purchases yet
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {statistics?.users.users_with_favorites
                      ? Math.round(
                          (statistics.users.users_with_purchases / statistics.users.users_with_favorites) * 100,
                        )
                      : 0}
                    %
                  </p>
                </div>
                <ShoppingCart className="w-8 h-8 text-purple-500" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  Favorites → Purchases
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="profiles" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profiles">Profile Management</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profiles">
            <ProfileManagement />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Admin Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statistics?.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">
                            {activity.user_profiles.full_name || activity.user_profiles.email}
                          </p>
                          <p className="text-sm text-gray-600">
                            {activity.action_type.replace("_", " ")} a {activity.target_type}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{new Date(activity.created_at).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

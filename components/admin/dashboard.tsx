"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck, UserX, Clock, Users, ShoppingCart, Heart } from "lucide-react"
import { Activity } from "lucide-react" // Declaring the Activity variable

interface DashboardProps {
  profileStats: {
    total_profiles: number
    pending_profiles: number
    approved_profiles: number
    rejected_profiles: number
    suspended_profiles: number
  }
  userStats: {
    total_users: number
    users_with_favorites: number
    users_with_purchases: number
    users_with_favorites_no_purchases: number
  }
  recentActivity: Array<{
    id: string
    action: string
    target_type: string
    created_at: string
    admin_user: {
      email: string
      full_name: string
    }
  }>
}

export function AdminDashboard({ profileStats, userStats, recentActivity }: DashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileStats.total_profiles || 0}</div>
            <p className="text-xs text-muted-foreground">{profileStats.pending_profiles || 0} pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userStats.total_users || 0}</div>
            <p className="text-xs text-muted-foreground">{userStats.users_with_purchases || 0} with purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.total_users ? Math.round((userStats.users_with_purchases / userStats.total_users) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Of users made purchases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites to Purchase</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userStats.users_with_favorites
                ? Math.round(
                    ((userStats.users_with_favorites - userStats.users_with_favorites_no_purchases) /
                      userStats.users_with_favorites) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Users who favorited and purchased</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
            <CardDescription>Distribution of profile statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-amber-500" />
                      <span>Pending</span>
                    </div>
                    <span className="text-sm font-medium">{profileStats.pending_profiles || 0}</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-amber-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{
                        width: `${
                          profileStats.total_profiles
                            ? (profileStats.pending_profiles / profileStats.total_profiles) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserCheck className="mr-2 h-4 w-4 text-green-500" />
                      <span>Approved</span>
                    </div>
                    <span className="text-sm font-medium">{profileStats.approved_profiles || 0}</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-green-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${
                          profileStats.total_profiles
                            ? (profileStats.approved_profiles / profileStats.total_profiles) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserX className="mr-2 h-4 w-4 text-red-500" />
                      <span>Rejected</span>
                    </div>
                    <span className="text-sm font-medium">{profileStats.rejected_profiles || 0}</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-red-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${
                          profileStats.total_profiles
                            ? (profileStats.rejected_profiles / profileStats.total_profiles) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserX className="mr-2 h-4 w-4 text-gray-500" />
                      <span>Suspended</span>
                    </div>
                    <span className="text-sm font-medium">{profileStats.suspended_profiles || 0}</span>
                  </div>
                  <div className="mt-1 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gray-500 rounded-full"
                      style={{
                        width: `${
                          profileStats.total_profiles
                            ? (profileStats.suspended_profiles / profileStats.total_profiles) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest admin actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center">
                    <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{activity.action.replace(/_/g, " ")}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.admin_user?.full_name || activity.admin_user?.email} •{" "}
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

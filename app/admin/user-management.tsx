"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Users, Heart, ShoppingCart, Mail, Calendar } from "lucide-react"

interface User {
  id: string
  email: string
  full_name: string
  created_at: string
  favorite_profiles: string[]
  orders: Array<{
    id: string
    total_amount: number
    status: string
    created_at: string
  }>
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState("all")

  useEffect(() => {
    fetchUsers()
  }, [userType])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        type: userType,
        limit: "50",
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const getUserStats = (user: User) => {
    const completedOrders = user.orders?.filter((order) => order.status === "completed") || []
    const totalSpent = completedOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const favoriteCount = user.favorite_profiles?.length || 0

    return {
      favoriteCount,
      orderCount: completedOrders.length,
      totalSpent,
      lastOrderDate:
        completedOrders.length > 0
          ? new Date(Math.max(...completedOrders.map((o) => new Date(o.created_at).getTime())))
          : null,
    }
  }

  return (
    <div className="space-y-6">
      {/* User Type Filter */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={userType} onValueChange={setUserType}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Filter users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="favorites_no_purchases">Favorites but No Purchases</SelectItem>
              <SelectItem value="with_purchases">Users with Purchases</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading users...</p>
            </div>
          ) : (
            <div className="divide-y">
              {users.map((user) => {
                const stats = getUserStats(user)
                return (
                  <div key={user.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{user.full_name || user.email.split("@")[0]}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex space-x-2">
                          {stats.favoriteCount > 0 && (
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              <Heart className="w-3 h-3 mr-1" />
                              {stats.favoriteCount} favorites
                            </Badge>
                          )}
                          {stats.orderCount > 0 && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <ShoppingCart className="w-3 h-3 mr-1" />
                              {stats.orderCount} orders
                            </Badge>
                          )}
                        </div>
                        {stats.totalSpent > 0 && (
                          <div className="text-sm text-gray-600">
                            Total spent: <span className="font-semibold">${stats.totalSpent.toFixed(2)}</span>
                          </div>
                        )}
                        {stats.lastOrderDate && (
                          <div className="text-xs text-gray-500">
                            Last order: {stats.lastOrderDate.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              {users.length === 0 && (
                <div className="p-8 text-center text-gray-500">No users found for the selected filter.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

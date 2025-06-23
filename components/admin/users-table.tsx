"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Eye, Mail, ShoppingCart, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "./pagination"
import { UsersTableSkeleton } from "./skeletons"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus } from "lucide-react"

interface User {
  id: string
  email: string
  full_name: string
  created_at: string
  role: string
  favorites_count: number
  orders_count: number
  total_spent: number
  last_login: string
}

interface UsersTableProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
}

export function UsersTable({ searchQuery = "", onSearchChange }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [filterType, setFilterType] = useState<"all" | "with_favorites" | "with_purchases">("all")
  const [error, setError] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [currentUserRole, setCurrentUserRole] = useState<string>("")
  const [currentUserData, setCurrentUserData] = useState<any>(null)
  const [createUserData, setCreateUserData] = useState({
    email: "",
    fullName: "",
    password: "",
    role: "user",
  })
  const [isCreating, setIsCreating] = useState(false)

  const itemsPerPage = 10

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchQuery, filterType])

  useEffect(() => {
    fetchCurrentUserRole()
  }, [])

  const fetchCurrentUserRole = async () => {
    try {
      console.log("Fetching current user role...")
      const response = await fetch("/api/admin/current-user")
      console.log("Response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("Current user data:", data)
        setCurrentUserRole(data.role)
        setCurrentUserData(data)
      } else {
        const errorData = await response.json()
        console.error("Error response:", errorData)
      }
    } catch (error) {
      console.error("Error fetching current user role:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        search: searchQuery,
        filter: filterType,
      })

      const response = await fetch(`/api/admin/users?${params}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server responded with ${response.status}`)
      }

      const data = await response.json()
      setUsers(data.users || [])
      setTotalPages(data.totalPages || 1)
      setTotalUsers(data.totalUsers || 0)
    } catch (error) {
      console.error("Error fetching users:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch users")
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "super_admin":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUserTypeColor = (user: User) => {
    if (user.orders_count > 0) {
      return "bg-green-100 text-green-800"
    } else if (user.favorites_count > 0) {
      return "bg-blue-100 text-blue-800"
    }
    return "bg-gray-100 text-gray-800"
  }

  const getUserType = (user: User) => {
    if (user.orders_count > 0) {
      return "Customer"
    } else if (user.favorites_count > 0) {
      return "Browser"
    }
    return "New User"
  }

  const handleCreateUser = async () => {
    if (!createUserData.email || !createUserData.password) {
      setError("Email and password are required")
      return
    }

    // Clear any previous errors
    setError(null)
    setIsCreating(true)

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createUserData),
      })

      const responseData = await response.json()

      if (response.ok) {
        setShowCreateDialog(false)
        setCreateUserData({ email: "", fullName: "", password: "", role: "user" })
        fetchUsers() // Refresh the users list
        setError(null)
      } else {
        setError(responseData.error || "Failed to create user")
      }
    } catch (error) {
      console.error("Error creating user:", error)
      setError("Failed to create user")
    } finally {
      setIsCreating(false)
    }
  }

  if (loading) {
    return <UsersTableSkeleton />
  }

  const isSuperAdmin = currentUserRole === "super_admin"
  console.log("Current user role:", currentUserRole, "Is super admin:", isSuperAdmin)

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Users</h3>
            {/* Debug info - remove in production */}
            <div className="text-xs text-gray-500 mt-1">
              Current role: {currentUserRole || "Loading..."}
              {currentUserData && ` (${currentUserData.email})`}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{totalUsers} total users</Badge>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Debug info */}
                  <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
                    Debug: Role = {currentUserRole}, Is Super Admin = {isSuperAdmin ? "Yes" : "No"}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@example.com"
                      value={createUserData.email}
                      onChange={(e) => setCreateUserData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      value={createUserData.fullName}
                      onChange={(e) => setCreateUserData((prev) => ({ ...prev, fullName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={createUserData.password}
                      onChange={(e) => setCreateUserData((prev) => ({ ...prev, password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={createUserData.role}
                      onValueChange={(value) => setCreateUserData((prev) => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Standard User</SelectItem>
                        {isSuperAdmin && <SelectItem value="admin">Admin User</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setShowCreateDialog(false)} disabled={isCreating}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateUser} disabled={isCreating} className="bg-pink-600 hover:bg-pink-700">
                      {isCreating ? "Creating..." : "Create User"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Users</option>
              <option value="with_favorites">With Favorites</option>
              <option value="with_purchases">With Purchases</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-100">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-700">
                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.full_name || "No name"}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge className={getUserTypeColor(user)}>{getUserType(user)}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <ShoppingCart className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{user.orders_count}</span>
                    </div>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{formatCurrency(user.total_spent)}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.created_at)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => window.open(`mailto:${user.email}`, "_blank")}>
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // View user details
                        console.log("View user:", user.id)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {users.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="text-gray-500">No users found</div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalUsers}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

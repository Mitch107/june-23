"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Eye, Edit, CheckCircle, XCircle, Clock, Pause, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface Profile {
  id: string
  name: string
  age: number
  location: string
  status: string
  description: string
  created_at: string
  profile_images: Array<{
    id: string
    image_url: string
    is_primary: boolean
  }>
  user_profiles: {
    email: string
    full_name: string
  }
}

export function ProfileManagement() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    status: "all",
    search: "",
    page: 1,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchProfiles()
  }, [filters])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        status: filters.status,
        page: filters.page.toString(),
        limit: "20",
      })

      const response = await fetch(`/api/admin/profiles?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProfiles(data.profiles)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
      toast.error("Failed to fetch profiles")
    } finally {
      setLoading(false)
    }
  }

  const updateProfileStatus = async (profileId: string, status: string, notes?: string) => {
    try {
      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, admin_notes: notes }),
      })

      if (response.ok) {
        toast.success(`Profile ${status} successfully`)
        fetchProfiles()
        setSelectedProfile(null)
      } else {
        const errorData = await response.json()
        toast.error(`Failed to update profile: ${errorData.error}`)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    }
  }

  const updateProfileContent = async (profileId: string, updates: Partial<Profile>) => {
    try {
      console.log("Updating profile content:", profileId, updates)

      const response = await fetch(`/api/admin/profiles/${profileId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      const responseData = await response.json()

      if (response.ok) {
        toast.success("Profile updated successfully")
        fetchProfiles()
        handleCloseEditDialog()
      } else {
        console.error("Update failed:", responseData)
        toast.error(`Failed to update profile: ${responseData.error}`)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile")
    }
  }

  const handleEditButtonClick = (profile: Profile) => {
    console.log("🔧 Edit button clicked for profile:", {
      id: profile.id,
      name: profile.name,
      age: profile.age,
      location: profile.location,
    })

    setEditingProfile(profile)
    setIsEditDialogOpen(true)

    console.log("🔧 Edit dialog state set:", {
      editingProfile: profile.name,
      isEditDialogOpen: true,
    })
  }

  const handleCloseEditDialog = () => {
    console.log("🔧 Closing edit dialog")
    setIsEditDialogOpen(false)
    setEditingProfile(null)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "suspended":
        return <Pause className="w-4 h-4 text-orange-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "suspended":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search profiles..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full"
              />
            </div>
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value, page: 1 })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Profiles List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading profiles...</p>
            </div>
          ) : (
            <div className="divide-y">
              {profiles.map((profile) => (
                <div key={profile.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                        {profile.profile_images.find((img) => img.is_primary) && (
                          <Image
                            src={profile.profile_images.find((img) => img.is_primary)?.image_url || ""}
                            alt={profile.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {profile.name}, {profile.age}
                        </h3>
                        <p className="text-gray-600">{profile.location}</p>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          By: {profile.user_profiles?.full_name || profile.user_profiles?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge className={getStatusColor(profile.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(profile.status)}
                          <span className="capitalize">{profile.status}</span>
                        </div>
                      </Badge>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedProfile(profile)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Profile Details: {profile.name}</DialogTitle>
                            </DialogHeader>
                            <ProfileDetailView profile={profile} onStatusUpdate={updateProfileStatus} />
                          </DialogContent>
                        </Dialog>

                        <Button variant="outline" size="sm" onClick={() => handleEditButtonClick(profile)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} profiles
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Controlled Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProfile ? `Edit Profile: ${editingProfile.name}` : "Edit Profile"}</DialogTitle>
          </DialogHeader>

          {editingProfile && (
            <ProfileEditForm profile={editingProfile} onSave={updateProfileContent} onCancel={handleCloseEditDialog} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function ProfileDetailView({
  profile,
  onStatusUpdate,
}: {
  profile: Profile
  onStatusUpdate: (id: string, status: string, notes?: string) => void
}) {
  const [notes, setNotes] = useState("")

  return (
    <div className="space-y-6">
      {/* Profile Images */}
      <div>
        <h3 className="font-semibold mb-3">Profile Images</h3>
        <div className="grid grid-cols-3 gap-4">
          {profile.profile_images.map((image) => (
            <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={image.image_url || "/placeholder.svg"}
                alt={`${profile.name} photo`}
                fill
                className="object-cover"
              />
              {image.is_primary && <Badge className="absolute top-2 left-2 bg-pink-500">Primary</Badge>}
            </div>
          ))}
        </div>
      </div>

      {/* Profile Information */}
      <div>
        <h3 className="font-semibold mb-3">Profile Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <Label>Name & Age</Label>
            <p>
              {profile.name}, {profile.age}
            </p>
          </div>
          <div>
            <Label>Location</Label>
            <p>{profile.location}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold mb-3">Description</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{profile.description}</p>
      </div>

      {/* Status Actions */}
      <div>
        <h3 className="font-semibold mb-3">Status Actions</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="admin-notes">Admin Notes</Label>
            <Textarea
              id="admin-notes"
              placeholder="Add notes about this profile..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1"
            />
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => onStatusUpdate(profile.id, "approved", notes)}
              className="bg-green-500 hover:bg-green-600"
              disabled={profile.status === "approved"}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={() => onStatusUpdate(profile.id, "rejected", notes)}
              variant="destructive"
              disabled={profile.status === "rejected"}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button
              onClick={() => onStatusUpdate(profile.id, "suspended", notes)}
              variant="outline"
              disabled={profile.status === "suspended"}
            >
              <Pause className="w-4 h-4 mr-2" />
              Suspend
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileEditForm({
  profile,
  onSave,
  onCancel,
}: {
  profile: Profile
  onSave: (id: string, updates: Partial<Profile>) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: profile.name,
    age: profile.age,
    location: profile.location,
    description: profile.description,
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(profile.id, formData)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="edit-name">Name</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={saving}
          />
        </div>
        <div>
          <Label htmlFor="edit-age">Age</Label>
          <Input
            id="edit-age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: Number.parseInt(e.target.value) || 0 })}
            disabled={saving}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="edit-location">Location</Label>
        <Input
          id="edit-location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          disabled={saving}
        />
      </div>
      <div>
        <Label htmlFor="edit-description">Description</Label>
        <Textarea
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={6}
          disabled={saving}
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button onClick={handleSave} className="bg-pink-500 hover:bg-pink-600" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}

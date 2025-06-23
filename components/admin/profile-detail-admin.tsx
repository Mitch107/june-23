"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  XCircle,
  Clock,
  Pause,
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  Mail,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Star,
  Save,
  Upload,
} from "lucide-react"
import { toast } from "sonner"

// Define all the options for select fields
const EDUCATION_OPTIONS = [
  "High School",
  "Some College",
  "Associate's Degree",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate",
  "Other",
]

const OCCUPATION_OPTIONS = [
  "Student",
  "Own my business",
  "Employed",
  "Part Time",
  "Full Time",
  "Domestic / Stay at Home",
  "Unemployed",
  "Looking for work",
]

// Options that trigger the conditional "Please specify your occupation" field
const OCCUPATION_OPTIONS_WITH_DETAILS = ["Employed", "Part Time", "Full Time", "Own my business"]

const LANGUAGES = ["Spanish", "English", "Italian", "German", "French", "Portuguese", "Chinese", "Japanese"]

const RELATIONSHIP_STATUS = ["Single", "Divorced", "Separated", "Widowed", "It's complicated"]

const CHILDREN_OPTIONS = [
  "No children",
  "Have children, not living with me",
  "Have children, living with me",
  "Don't want children",
  "Want children",
]

const SMOKING_OPTIONS = ["Non-smoker", "Light smoker", "Heavy smoker", "Trying to quit"]

const DRINKING_OPTIONS = ["Non-drinker", "Social drinker", "Regular drinker"]

const BODY_TYPE_OPTIONS = [
  "Slim",
  "Athletic",
  "Average",
  "Curvy",
  "Very Curvy with Large Butt",
  "Big and Curvy (not big and fat)",
]

const APPEARANCE_OPTIONS = ["Average", "Attractive", "Very Attractive"]

const GENDER_OPTIONS = ["Female", "Male", "Non-binary", "Other"]

const HEIGHT_OPTIONS = Array.from({ length: 61 }, (_, i) => {
  const feet = Math.floor((i + 48) / 12)
  const inches = (i + 48) % 12
  return {
    value: `${feet}'${inches}"`,
    label: `${feet}'${inches}"`,
  }
})

const CITIES = [
  "Santo Domingo",
  "Santiago",
  "Puerto Plata",
  "La Romana",
  "Punta Cana",
  "San Pedro de Macorís",
  "Barahona",
  "Moca",
  "San Francisco de Macorís",
  "Higüey",
  "Azua",
  "Bonao",
  "Mao",
  "Bani",
  "Nagua",
]

interface ProfileDetailAdminProps {
  profile: {
    id: string
    name: string
    first_name?: string
    last_name?: string
    age: number
    birth_date?: string
    location: string
    gender?: string
    height?: string
    education?: string
    occupation?: string | string[]
    occupation_details?: string
    languages?: string[]
    relationship_status?: string
    children?: string
    smoking?: string
    drinking?: string
    body_type?: string
    appearance?: string
    status: string
    description: string
    price: number
    created_at: string
    updated_at: string
    admin_notes?: string
    created_by?: string
    contact_methods?: {
      whatsapp?: string
      instagram?: string
      tiktok?: string
      facebook?: string
      telegram?: string
      email?: string
    }
    profile_images: Array<{
      id: string
      image_url: string
      is_primary: boolean
      display_order?: number
      is_visible?: boolean
    }>
    created_by_user?: {
      email: string
      full_name: string
    }
    contact_whatsapp?: string
    contact_instagram?: string
    contact_tiktok?: string
    contact_facebook?: string
    contact_telegram?: string
    contact_email?: string
    profession?: string
  }
}

export function ProfileDetailAdmin({ profile }: ProfileDetailAdminProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [adminNotes, setAdminNotes] = useState(profile.admin_notes || "")
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Parse occupation from string or array
  const parseOccupation = (occupation: string | string[] | undefined): string[] => {
    if (!occupation) return []
    if (Array.isArray(occupation)) return occupation
    if (typeof occupation === "string") {
      // Handle case where occupation might be a comma-separated string
      if (occupation.includes(",")) {
        return occupation.split(",").map((item) => item.trim())
      }
      // Single occupation as string
      return [occupation]
    }
    return []
  }

  // Initialize form with all profile fields, properly mapping from database
  const [editForm, setEditForm] = useState({
    first_name: profile.first_name || profile.name?.split(" ")[0] || "",
    last_name: profile.last_name || profile.name?.split(" ").slice(1).join(" ") || "",
    age: profile.age,
    birth_date: profile.birth_date || "",
    location: profile.location || "",
    gender: profile.gender || "",
    height: profile.height || "",
    education: profile.education || "",
    occupation: parseOccupation(profile.occupation || profile.profession),
    occupation_details: profile.occupation_details || "",
    languages: profile.languages || [],
    relationship_status: profile.relationship_status || "",
    children: profile.children || "",
    smoking: profile.smoking || "",
    drinking: profile.drinking || "",
    body_type: profile.body_type || "",
    appearance: profile.appearance || "",
    description: profile.description || "",
    price: profile.price || 25,
    contact_methods: {
      whatsapp: profile.contact_whatsapp || "",
      instagram: profile.contact_instagram || "",
      tiktok: profile.contact_tiktok || "",
      facebook: profile.contact_facebook || "",
      telegram: profile.contact_telegram || "",
      email: profile.contact_email || "",
    },
  })

  // State for profile images
  const [profileImages, setProfileImages] = useState(profile.profile_images || [])

  const updateProfileStatus = async (newStatus: string, notes?: string) => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/admin/profiles/${profile.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: notes || adminNotes,
        }),
      })

      const responseText = await response.text()

      // Check if response is JSON
      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", responseText)
        throw new Error("Server returned invalid response")
      }

      if (!response.ok) {
        throw new Error(result.error || `HTTP ${response.status}`)
      }

      // Verify the status was actually updated
      if (!result.success) {
        throw new Error(result.error || "Status update failed")
      }

      toast.success(`Profile ${newStatus} successfully`)
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update profile status")
    } finally {
      setIsUpdating(false)
    }
  }

  const updateProfileContent = async () => {
    setIsUpdating(true)
    try {
      // Combine first and last name for the name field
      const fullName = `${editForm.first_name} ${editForm.last_name}`.trim()

      // Convert occupation array to string for the API
      const occupationString = Array.isArray(editForm.occupation)
        ? editForm.occupation.join(", ")
        : editForm.occupation || ""

      const formData = {
        // Personal Information
        name: fullName,
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        age: editForm.age,
        birth_date: editForm.birth_date,
        location: editForm.location,
        gender: editForm.gender,
        height: editForm.height,
        description: editForm.description,
        price: editForm.price,

        // Profile Details
        education: editForm.education,
        profession: occupationString, // Map to profession field
        occupation_details: editForm.occupation_details,
        languages: editForm.languages,
        relationship_status: editForm.relationship_status,
        children: editForm.children,
        smoking: editForm.smoking,
        drinking: editForm.drinking,
        body_type: editForm.body_type,
        appearance: editForm.appearance,

        // Contact Methods
        contact_methods: editForm.contact_methods,
      }

      console.log("Sending profile data:", formData)

      const response = await fetch(`/api/admin/profiles/${profile.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("API error response:", errorData)
        throw new Error(`Failed to update profile: ${errorData.error || response.statusText}`)
      }

      toast.success("Profile updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsUpdating(false)
    }
  }

  const toggleImageVisibility = async (imageId: string, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/admin/profiles/${profile.id}/images`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId,
          is_visible: isVisible,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to update image visibility")
      }

      // Update local state
      setProfileImages(profileImages.map((img) => (img.id === imageId ? { ...img, is_visible: isVisible } : img)))

      toast.success(`Image ${isVisible ? "visible" : "hidden"} successfully`)
    } catch (error) {
      console.error("Error updating image visibility:", error)
      toast.error("Failed to update image visibility")
    }
  }

  const deleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/profiles/${profile.id}/images`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to delete image")
      }

      // Update local state
      setProfileImages(profileImages.filter((img) => img.id !== imageId))

      toast.success("Image deleted successfully")
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error("Failed to delete image")
    }
  }

  const uploadImage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedImage) {
      toast.error("Please select an image or video to upload")
      return
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/mov",
    ]

    if (!allowedTypes.includes(selectedImage.type)) {
      toast.error("Invalid file type. Only images (JPG, PNG, GIF, WebP) and videos (MP4, WebM, MOV) are allowed.")
      return
    }

    // Check file size (limit to 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB in bytes
    if (selectedImage.size > maxSize) {
      toast.error("File size too large. Maximum size is 50MB.")
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("file", selectedImage)

      console.log("Uploading file:", {
        name: selectedImage.name,
        type: selectedImage.type,
        size: selectedImage.size,
      })

      const response = await fetch(`/api/admin/profiles/${profile.id}/images`, {
        method: "POST",
        body: formData,
      })

      const responseText = await response.text()
      console.log("Upload response:", responseText)

      let result
      try {
        result = JSON.parse(responseText)
      } catch (parseError) {
        console.error("Failed to parse upload response:", responseText)
        throw new Error("Server returned invalid response")
      }

      if (!response.ok) {
        throw new Error(result.error || result.details || `Upload failed with status ${response.status}`)
      }

      if (!result.success) {
        throw new Error(result.error || "Upload failed")
      }

      // Update local state with the new image
      if (result.image) {
        setProfileImages([...profileImages, result.image])
        toast.success("Media uploaded successfully")
      } else {
        console.warn("Upload successful but no image data returned:", result)
        toast.success("Media uploaded successfully")
        // Refresh the page to show the new image
        router.refresh()
      }

      // Reset form
      setSelectedImage(null)
      setIsPhotoDialogOpen(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload file")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleLanguageChange = (language: string) => {
    setEditForm((prev) => {
      const currentLanguages = prev.languages || []
      if (currentLanguages.includes(language)) {
        return {
          ...prev,
          languages: currentLanguages.filter((l) => l !== language),
        }
      } else {
        return {
          ...prev,
          languages: [...currentLanguages, language],
        }
      }
    })
  }

  const handleOccupationChange = (occupation: string) => {
    setEditForm((prev) => {
      const currentOccupations = prev.occupation || []

      if (currentOccupations.includes(occupation)) {
        // Remove the occupation if it's already selected
        const newOccupations = currentOccupations.filter((occ) => occ !== occupation)
        return {
          ...prev,
          occupation: newOccupations,
          // Clear occupation_details if no selected occupations require it
          occupation_details: newOccupations.some((occ) => OCCUPATION_OPTIONS_WITH_DETAILS.includes(occ))
            ? prev.occupation_details
            : "",
        }
      } else {
        // Add the occupation to the selection
        const newOccupations = [...currentOccupations, occupation]
        return {
          ...prev,
          occupation: newOccupations,
        }
      }
    })
  }

  // Check if the conditional occupation details field should be shown
  const shouldShowOccupationDetails =
    editForm.occupation && editForm.occupation.some((occ) => OCCUPATION_OPTIONS_WITH_DETAILS.includes(occ))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />
      case "suspended":
        return <Pause className="w-5 h-5 text-orange-500" />
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "suspended":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const setPrimaryImage = async (imageId: string) => {
    try {
      const response = await fetch(`/api/admin/profiles/${profile.id}/images`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageId,
          is_primary: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Set primary error:", errorData)
        throw new Error(errorData.error || "Failed to set primary image")
      }

      // Update local state - set all images to not primary, then set the selected one as primary
      setProfileImages(
        profileImages.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        })),
      )

      toast.success("Primary image updated successfully")
    } catch (error) {
      console.error("Error setting primary image:", error)
      toast.error("Failed to set primary image")
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log("File selected:", {
        name: file.name,
        type: file.type,
        size: file.size,
      })
      setSelectedImage(file)
    }
  }

  // Handle clicking the empty media slot
  const handleAddMediaClick = () => {
    setIsPhotoDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Profiles
        </Button>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className={getStatusColor(profile.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(profile.status)}
              <span className="capitalize">{profile.status}</span>
            </div>
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Images */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Images & Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Existing Images */}
                {profileImages.map((image) => {
                  const isVideo =
                    image.image_url.includes(".mp4") ||
                    image.image_url.includes(".mov") ||
                    image.image_url.includes(".webm") ||
                    image.image_url.includes("video")

                  return (
                    <div key={image.id} className="relative rounded-lg overflow-hidden bg-gray-100">
                      <div className="aspect-[3/4] relative">
                        {isVideo ? (
                          <video src={image.image_url} className="w-full h-full object-cover" controls />
                        ) : (
                          <Image
                            src={image.image_url || "/placeholder.svg"}
                            alt={`${profile.name} media`}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="absolute top-2 left-2 flex gap-1">
                        {image.is_primary && <Badge className="bg-pink-500">Primary</Badge>}
                        {isVideo && (
                          <Badge variant="outline" className="bg-blue-500 text-white">
                            Video
                          </Badge>
                        )}
                        {image.is_visible === false && (
                          <Badge variant="outline" className="bg-gray-800 text-white">
                            Hidden
                          </Badge>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 flex justify-between items-center">
                        <div className="flex gap-1">
                          {!image.is_primary && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-white hover:text-white hover:bg-black/30"
                              onClick={() => setPrimaryImage(image.id)}
                            >
                              <Star className="w-4 h-4 mr-1" /> Set Primary
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:text-white hover:bg-black/30"
                            onClick={() => toggleImageVisibility(image.id, image.is_visible === false)}
                          >
                            {image.is_visible === false ? (
                              <>
                                <Eye className="w-4 h-4 mr-1" /> Show
                              </>
                            ) : (
                              <>
                                <EyeOff className="w-4 h-4 mr-1" /> Hide
                              </>
                            )}
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:text-white hover:bg-black/30"
                          onClick={() => deleteImage(image.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  )
                })}

                {/* Empty Media Slot - Add Media Container */}
                <div
                  className="aspect-[3/4] relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 cursor-pointer group"
                  onClick={handleAddMediaClick}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-gray-600">
                    <div className="w-16 h-16 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center mb-3 transition-colors duration-200">
                      <Plus className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium mb-1">Add Photo/Video</p>
                    <p className="text-xs text-gray-400 text-center px-4">Click to upload images or MP4 videos</p>
                  </div>
                </div>
              </div>

              {/* Show message when no images exist */}
              {profileImages.length === 0 && (
                <div className="text-center py-8">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Upload className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">No media uploaded yet</p>
                  <p className="text-sm text-gray-400">Click the container above to upload your first photo or video</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Profile Information - Now Editable */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="first_name" className="text-xs text-gray-500">
                        First Name
                      </Label>
                      <Input
                        id="first_name"
                        value={editForm.first_name}
                        onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="last_name" className="text-xs text-gray-500">
                        Last Name
                      </Label>
                      <Input
                        id="last_name"
                        value={editForm.last_name}
                        onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <Label htmlFor="age" className="text-xs text-gray-500">
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={editForm.age}
                    onChange={(e) => setEditForm({ ...editForm, age: Number.parseInt(e.target.value) })}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div className="flex-1">
                  <Label htmlFor="location" className="text-xs text-gray-500">
                    Location
                  </Label>
                  <Select
                    value={editForm.location}
                    onValueChange={(value) => setEditForm({ ...editForm, location: value })}
                  >
                    <SelectTrigger className="h-8">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-pink-600">$</span>
                <div className="flex-1">
                  <Label htmlFor="price" className="text-xs text-gray-500">
                    Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number.parseFloat(e.target.value) })}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium">{new Date(profile.created_at).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-500">Created</p>
                </div>
              </div>

              {profile.created_by_user && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{profile.created_by_user.full_name || profile.created_by_user.email}</p>
                    <p className="text-sm text-gray-500">Created by</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Status Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Status Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="admin-notes">Admin Notes</Label>
                <Textarea
                  id="admin-notes"
                  placeholder="Add notes about this profile..."
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => updateProfileStatus("approved")}
                  disabled={isUpdating || profile.status === "approved"}
                  className="bg-green-500 hover:bg-green-600 w-full"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Profile
                </Button>

                <Button
                  onClick={() => updateProfileStatus("rejected")}
                  disabled={isUpdating || profile.status === "rejected"}
                  variant="destructive"
                  className="w-full"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Profile
                </Button>

                <Button
                  onClick={() => updateProfileStatus("suspended")}
                  disabled={isUpdating || profile.status === "suspended"}
                  variant="outline"
                  className="w-full"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Suspend Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Dialog - Hidden but functional */}
      <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Photo or Video</DialogTitle>
          </DialogHeader>
          <form onSubmit={uploadImage} className="space-y-4">
            <div>
              <Label htmlFor="photo">Select Photo or Video</Label>
              <Input
                id="photo"
                type="file"
                ref={fileInputRef}
                accept="image/*,video/mp4,video/webm,video/quicktime"
                onChange={handleFileSelect}
                disabled={uploadingImage}
              />
              <p className="text-sm text-gray-500 mt-1">
                Supported formats: JPG, PNG, GIF, WebP, MP4, WebM, MOV (Max: 50MB)
              </p>
              {selectedImage && (
                <p className="text-sm text-green-600 mt-1">
                  Selected: {selectedImage.name} ({(selectedImage.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsPhotoDialogOpen(false)
                  setSelectedImage(null)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
                disabled={uploadingImage}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={uploadingImage || !selectedImage}>
                {uploadingImage ? "Uploading..." : "Upload Media"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Editable Profile Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="details">Profile Details</TabsTrigger>
              <TabsTrigger value="contact">Contact Methods</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="birth_date">Birth Date</Label>
                  <Input
                    id="birth_date"
                    type="date"
                    value={editForm.birth_date}
                    onChange={(e) => setEditForm({ ...editForm, birth_date: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={editForm.gender}
                    onValueChange={(value) => setEditForm({ ...editForm, gender: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="height">Height</Label>
                <Select value={editForm.height} onValueChange={(value) => setEditForm({ ...editForm, height: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select height" />
                  </SelectTrigger>
                  <SelectContent>
                    {HEIGHT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* Profile Details Tab */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="education">Education</Label>
                  <Select
                    value={editForm.education}
                    onValueChange={(value) => setEditForm({ ...editForm, education: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      {EDUCATION_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Occupation</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {OCCUPATION_OPTIONS.map((occupation) => (
                      <div key={occupation} className="flex items-center space-x-2">
                        <Checkbox
                          id={`occupation-${occupation}`}
                          checked={editForm.occupation?.includes(occupation)}
                          onCheckedChange={() => handleOccupationChange(occupation)}
                        />
                        <Label htmlFor={`occupation-${occupation}`} className="text-sm">
                          {occupation}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {shouldShowOccupationDetails && (
                    <div className="mt-3">
                      <Label htmlFor="occupation_details">Please specify your occupation</Label>
                      <Input
                        id="occupation_details"
                        value={editForm.occupation_details}
                        onChange={(e) => setEditForm({ ...editForm, occupation_details: e.target.value })}
                        placeholder="Enter occupation details"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label>Languages Spoken</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {LANGUAGES.map((language) => (
                    <div key={language} className="flex items-center space-x-2">
                      <Checkbox
                        id={`language-${language}`}
                        checked={editForm.languages?.includes(language)}
                        onCheckedChange={() => handleLanguageChange(language)}
                      />
                      <Label htmlFor={`language-${language}`}>{language}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="relationship_status">Relationship Status</Label>
                  <Select
                    value={editForm.relationship_status}
                    onValueChange={(value) => setEditForm({ ...editForm, relationship_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {RELATIONSHIP_STATUS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="children">Children</Label>
                  <Select
                    value={editForm.children}
                    onValueChange={(value) => setEditForm({ ...editForm, children: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {CHILDREN_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="smoking">Smoking</Label>
                  <Select
                    value={editForm.smoking}
                    onValueChange={(value) => setEditForm({ ...editForm, smoking: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {SMOKING_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="drinking">Drinking</Label>
                  <Select
                    value={editForm.drinking}
                    onValueChange={(value) => setEditForm({ ...editForm, drinking: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {DRINKING_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="body_type">Body Type</Label>
                  <Select
                    value={editForm.body_type}
                    onValueChange={(value) => setEditForm({ ...editForm, body_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BODY_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="appearance">Appearance</Label>
                  <Select
                    value={editForm.appearance}
                    onValueChange={(value) => setEditForm({ ...editForm, appearance: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {APPEARANCE_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Contact Methods Tab */}
            <TabsContent value="contact" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <span>WhatsApp</span>
                  </Label>
                  <Input
                    id="whatsapp"
                    value={editForm.contact_methods?.whatsapp || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        contact_methods: {
                          ...editForm.contact_methods,
                          whatsapp: e.target.value,
                        },
                      })
                    }
                    placeholder="Share WhatsApp contact"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram" className="flex items-center gap-2">
                    <span>Instagram</span>
                  </Label>
                  <Input
                    id="instagram"
                    value={editForm.contact_methods?.instagram || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        contact_methods: {
                          ...editForm.contact_methods,
                          instagram: e.target.value,
                        },
                      })
                    }
                    placeholder="Share Instagram handle"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tiktok" className="flex items-center gap-2">
                    <span>TikTok</span>
                  </Label>
                  <Input
                    id="tiktok"
                    value={editForm.contact_methods?.tiktok || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        contact_methods: {
                          ...editForm.contact_methods,
                          tiktok: e.target.value,
                        },
                      })
                    }
                    placeholder="Share TikTok handle"
                  />
                </div>
                <div>
                  <Label htmlFor="facebook" className="flex items-center gap-2">
                    <span>Facebook</span>
                  </Label>
                  <Input
                    id="facebook"
                    value={editForm.contact_methods?.facebook || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        contact_methods: {
                          ...editForm.contact_methods,
                          facebook: e.target.value,
                        },
                      })
                    }
                    placeholder="Share Facebook profile"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telegram" className="flex items-center gap-2">
                    <span>Telegram</span>
                  </Label>
                  <Input
                    id="telegram"
                    value={editForm.contact_methods?.telegram || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        contact_methods: {
                          ...editForm.contact_methods,
                          telegram: e.target.value,
                        },
                      })
                    }
                    placeholder="Share Telegram username"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <span>Email</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.contact_methods?.email || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        contact_methods: {
                          ...editForm.contact_methods,
                          email: e.target.value,
                        },
                      })
                    }
                    placeholder="Share email address"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Save Changes Button */}
          <div className="mt-6 pt-4 border-t">
            <Button
              onClick={updateProfileContent}
              disabled={isUpdating}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

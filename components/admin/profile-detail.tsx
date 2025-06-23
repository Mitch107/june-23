"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Check, X, AlertTriangle, Edit, Save, Mail, Phone, Instagram, Facebook, MessageCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

interface ProfileDetailProps {
  profile: any
}

export function ProfileDetail({ profile }: ProfileDetailProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProfile((prev: any) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value
    setEditedProfile((prev: any) => ({
      ...prev,
      [field]: value.split(",").map((item: string) => item.trim()),
    }))
  }

  const saveChanges = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/profiles/${profile.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProfile),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast.success("Profile updated successfully")
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast.error("Failed to update profile")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const openStatusDialog = (status: string) => {
    setNewStatus(status)
    setAdminNotes("")
    setIsStatusDialogOpen(true)
  }

  const updateProfileStatus = async () => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/profiles/${profile.id}/status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          notes: adminNotes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile status")
      }

      toast.success(`Profile status updated to ${newStatus}`)
      setIsStatusDialogOpen(false)
      router.refresh()
    } catch (error) {
      toast.error("Failed to update profile status")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Rejected</Badge>
      case "suspended":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">Suspended</Badge>
      case "pending":
      default:
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold">{profile.name}</h2>
          {getStatusBadge(profile.status)}
        </div>

        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={() => setIsEditing(false)} variant="outline">
                Cancel
              </Button>
              <Button onClick={saveChanges} disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>

              {profile.status !== "approved" && (
                <Button onClick={() => openStatusDialog("approved")} variant="default">
                  <Check className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              )}

              {profile.status !== "rejected" && (
                <Button onClick={() => openStatusDialog("rejected")} variant="destructive">
                  <X className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              )}

              {profile.status === "approved" && (
                <Button
                  onClick={() => openStatusDialog("suspended")}
                  variant="outline"
                  className="border-amber-500 text-amber-500 hover:bg-amber-50"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Suspend
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Profile Details</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
          <TabsTrigger value="admin">Admin Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
                        Name
                      </label>
                      <Input id="name" name="name" value={editedProfile.name} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="age" className="text-sm font-medium">
                        Age
                      </label>
                      <Input id="age" name="age" type="number" value={editedProfile.age} onChange={handleInputChange} />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium">
                        Location
                      </label>
                      <Input
                        id="location"
                        name="location"
                        value={editedProfile.location}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="price" className="text-sm font-medium">
                        Price
                      </label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={editedProfile.price}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="featured" className="text-sm font-medium">
                        Featured
                      </label>
                      <select
                        id="featured"
                        name="featured"
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                        value={editedProfile.featured.toString()}
                        onChange={(e) =>
                          setEditedProfile((prev: any) => ({
                            ...prev,
                            featured: e.target.value === "true",
                          }))
                        }
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Name:</div>
                      <div>{profile.name}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Age:</div>
                      <div>{profile.age}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Location:</div>
                      <div>{profile.location}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Price:</div>
                      <div>${profile.price}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Featured:</div>
                      <div>{profile.featured ? "Yes" : "No"}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Created:</div>
                      <div>{new Date(profile.created_at).toLocaleString()}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    name="description"
                    value={editedProfile.description || ""}
                    onChange={handleInputChange}
                    rows={8}
                  />
                ) : (
                  <div className="prose max-w-none">{profile.description || "No description provided."}</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interests & Languages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <label htmlFor="interests" className="text-sm font-medium">
                        Interests (comma separated)
                      </label>
                      <Input
                        id="interests"
                        value={editedProfile.interests?.join(", ") || ""}
                        onChange={(e) => handleArrayInputChange(e, "interests")}
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="languages" className="text-sm font-medium">
                        Languages (comma separated)
                      </label>
                      <Input
                        id="languages"
                        value={editedProfile.languages?.join(", ") || ""}
                        onChange={(e) => handleArrayInputChange(e, "languages")}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Interests:</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.interests?.length > 0 ? (
                          profile.interests.map((interest: string, index: number) => (
                            <Badge key={index} variant="secondary">
                              {interest}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None specified</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">Languages:</h4>
                      <div className="flex flex-wrap gap-2">
                        {profile.languages?.length > 0 ? (
                          profile.languages.map((language: string, index: number) => (
                            <Badge key={index} variant="outline">
                              {language}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">None specified</span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Height:</div>
                    <div>{profile.height || "Not specified"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Education:</div>
                    <div>{profile.education || "Not specified"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Profession:</div>
                    <div>{profile.profession || "Not specified"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium">Relationship Status:</div>
                    <div>{profile.relationship_status || "Not specified"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="photos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Photos</CardTitle>
              <CardDescription>{profile.profile_images?.length || 0} photos uploaded</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profile.profile_images?.length > 0 ? (
                  profile.profile_images.map((image: any) => (
                    <div key={image.id} className="relative group">
                      <div className="aspect-square rounded-md overflow-hidden bg-gray-100">
                        <Image
                          src={image.image_url || "/placeholder.svg"}
                          alt={`Photo of ${profile.name}`}
                          width={300}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      {image.is_primary && <Badge className="absolute top-2 left-2 bg-blue-500">Primary</Badge>}
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">No photos uploaded</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>This information is shared with users who purchase contact details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div>{profile.contact_email || "Not provided"}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div>{profile.contact_phone || "Not provided"}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">WhatsApp</div>
                    <div>{profile.contact_whatsapp || "Not provided"}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Instagram className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Instagram</div>
                    <div>{profile.contact_instagram || "Not provided"}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Facebook className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Facebook</div>
                    <div>{profile.contact_facebook || "Not provided"}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
              <CardDescription>Internal notes about this profile (not visible to users)</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  name="admin_notes"
                  value={editedProfile.admin_notes || ""}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Add internal notes about this profile..."
                />
              ) : (
                <div className="prose max-w-none">{profile.admin_notes || "No admin notes."}</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === "approved" && "Approve Profile"}
              {newStatus === "rejected" && "Reject Profile"}
              {newStatus === "suspended" && "Suspend Profile"}
            </DialogTitle>
            <DialogDescription>
              You are about to change the status of <strong>{profile.name}</strong> to <strong>{newStatus}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="admin-notes" className="text-sm font-medium">
                Admin Notes (optional)
              </label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add a note about this status change..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={updateProfileStatus}
              disabled={isSubmitting}
              variant={newStatus === "rejected" ? "destructive" : "default"}
            >
              {isSubmitting
                ? "Updating..."
                : `${newStatus === "approved" ? "Approve" : newStatus === "rejected" ? "Reject" : "Suspend"} Profile`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

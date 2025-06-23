"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Check, X, AlertTriangle, Clock, Search, Filter, MoreHorizontal, Eye, Edit } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/admin/pagination"

interface ProfilesTableProps {
  profiles: Array<any>
  totalCount: number
  currentPage: number
  pageSize: number
  status: string
  query: string
}

export function ProfilesTable({ profiles, totalCount, currentPage, pageSize, status, query }: ProfilesTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState(query)
  const [statusFilter, setStatusFilter] = useState(status)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [newStatus, setNewStatus] = useState("")
  const [adminNotes, setAdminNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPages = Math.ceil(totalCount / pageSize)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/admin/profiles?status=${statusFilter}&query=${searchQuery}&page=1`)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    router.push(`/admin/profiles?status=${value}&query=${searchQuery}&page=1`)
  }

  const handlePageChange = (page: number) => {
    router.push(`/admin/profiles?status=${statusFilter}&query=${searchQuery}&page=${page}`)
  }

  const openStatusDialog = (profile: any, status: string) => {
    setSelectedProfile(profile)
    setNewStatus(status)
    setAdminNotes("")
    setIsStatusDialogOpen(true)
  }

  const updateProfileStatus = async () => {
    if (!selectedProfile || !newStatus) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/admin/profiles/${selectedProfile.id}/status`, {
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

      // Refresh the data
      router.refresh()
    } catch (error) {
      toast.error("Failed to update profile status")
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusIcon = (profileStatus: string) => {
    switch (profileStatus) {
      case "approved":
        return <Check className="h-4 w-4 text-green-500" />
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />
      case "suspended":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "pending":
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (profileStatus: string) => {
    switch (profileStatus) {
      case "approved":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Rejected
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Suspended
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="search"
            placeholder="Search profiles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Button type="submit" size="icon" variant="ghost">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>

        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Profiles</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Profile</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        {profile.profile_images?.length > 0 ? (
                          <Image
                            src={
                              profile.profile_images.find((img: any) => img.is_primary)?.image_url ||
                              profile.profile_images[0].image_url ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt={profile.name}
                            width={40}
                            height={40}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">N/A</div>
                        )}
                      </div>
                      <div>
                        <Link href={`/admin/profiles/${profile.id}`} className="hover:underline">
                          {profile.name}
                        </Link>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{profile.age}</TableCell>
                  <TableCell>{profile.location}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(profile.status)}
                      {getStatusBadge(profile.status)}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(profile.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/profiles/${profile.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/profiles/${profile.id}?edit=true`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </Link>
                        </DropdownMenuItem>
                        {profile.status !== "approved" && (
                          <DropdownMenuItem onClick={() => openStatusDialog(profile, "approved")}>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {profile.status !== "rejected" && (
                          <DropdownMenuItem onClick={() => openStatusDialog(profile, "rejected")}>
                            <X className="mr-2 h-4 w-4 text-red-500" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        {profile.status !== "suspended" && profile.status === "approved" && (
                          <DropdownMenuItem onClick={() => openStatusDialog(profile, "suspended")}>
                            <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                            Suspend
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No profiles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newStatus === "approved" && "Approve Profile"}
              {newStatus === "rejected" && "Reject Profile"}
              {newStatus === "suspended" && "Suspend Profile"}
            </DialogTitle>
            <DialogDescription>
              {selectedProfile && (
                <span>
                  You are about to change the status of <strong>{selectedProfile.name}</strong> to{" "}
                  <strong>{newStatus}</strong>.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="admin-notes" className="text-sm font-medium">
                Admin Notes (optional)
              </label>
              <Textarea
                id="admin-notes"
                placeholder="Add notes about this decision..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
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
              variant={newStatus === "approved" ? "default" : "destructive"}
            >
              {isSubmitting ? "Updating..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

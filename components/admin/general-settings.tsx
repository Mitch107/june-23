"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Setting {
  key: string
  value: any
  description: string
}

interface GeneralSettingsProps {
  settings: Setting[]
  onUpdate: (key: string, value: any) => void
  saving: boolean
}

export function GeneralSettings({ settings, onUpdate, saving }: GeneralSettingsProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})

  const getSetting = (key: string) => {
    const setting = settings.find((s) => s.key === key)
    return setting ? setting.value : ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    Object.entries(formData).forEach(([key, value]) => {
      onUpdate(key, value)
    })
    setFormData({})
  }

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Site Information</CardTitle>
          <CardDescription>Basic information about your site</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="site_name">Site Name</Label>
            <Input
              id="site_name"
              defaultValue={getSetting("site_name")}
              onChange={(e) => updateFormData("site_name", e.target.value)}
              placeholder="Enter site name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_description">Site Description</Label>
            <Textarea
              id="site_description"
              defaultValue={getSetting("site_description")}
              onChange={(e) => updateFormData("site_description", e.target.value)}
              placeholder="Enter site description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="site_logo">Site Logo URL</Label>
            <Input
              id="site_logo"
              defaultValue={getSetting("site_logo")}
              onChange={(e) => updateFormData("site_logo", e.target.value)}
              placeholder="https://example.com/logo.png"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Settings</CardTitle>
          <CardDescription>Configure how content is displayed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="max_profiles_per_page">Profiles Per Page</Label>
            <Input
              id="max_profiles_per_page"
              type="number"
              defaultValue={getSetting("max_profiles_per_page")}
              onChange={(e) => updateFormData("max_profiles_per_page", Number.parseInt(e.target.value))}
              min="1"
              max="100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="featured_profiles_count">Featured Profiles Count</Label>
            <Input
              id="featured_profiles_count"
              type="number"
              defaultValue={getSetting("featured_profiles_count")}
              onChange={(e) => updateFormData("featured_profiles_count", Number.parseInt(e.target.value))}
              min="1"
              max="20"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance</CardTitle>
          <CardDescription>Site maintenance and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="maintenance_mode"
              checked={getSetting("maintenance_mode")}
              onCheckedChange={(checked) => updateFormData("maintenance_mode", checked)}
            />
            <Label htmlFor="maintenance_mode">Maintenance Mode</Label>
          </div>
          <p className="text-sm text-gray-500 mt-1">When enabled, only admins can access the site</p>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving || Object.keys(formData).length === 0}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

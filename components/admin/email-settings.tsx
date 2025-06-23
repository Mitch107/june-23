"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Setting {
  key: string
  value: any
  description: string
}

interface EmailSettingsProps {
  settings: Setting[]
  onUpdate: (key: string, value: any) => void
  saving: boolean
}

export function EmailSettings({ settings, onUpdate, saving }: EmailSettingsProps) {
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
          <CardTitle>SMTP Configuration</CardTitle>
          <CardDescription>Configure email server settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_host">SMTP Host</Label>
              <Input
                id="smtp_host"
                defaultValue={getSetting("smtp_host")}
                onChange={(e) => updateFormData("smtp_host", e.target.value)}
                placeholder="smtp.gmail.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_port">SMTP Port</Label>
              <Input
                id="smtp_port"
                type="number"
                defaultValue={getSetting("smtp_port")}
                onChange={(e) => updateFormData("smtp_port", Number.parseInt(e.target.value))}
                placeholder="587"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_username">SMTP Username</Label>
            <Input
              id="smtp_username"
              defaultValue={getSetting("smtp_username")}
              onChange={(e) => updateFormData("smtp_username", e.target.value)}
              placeholder="your-email@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_password">SMTP Password</Label>
            <Input
              id="smtp_password"
              type="password"
              defaultValue={getSetting("smtp_password")}
              onChange={(e) => updateFormData("smtp_password", e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Defaults</CardTitle>
          <CardDescription>Default sender information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="smtp_from_email">From Email</Label>
            <Input
              id="smtp_from_email"
              type="email"
              defaultValue={getSetting("smtp_from_email")}
              onChange={(e) => updateFormData("smtp_from_email", e.target.value)}
              placeholder="noreply@tucupid.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="smtp_from_name">From Name</Label>
            <Input
              id="smtp_from_name"
              defaultValue={getSetting("smtp_from_name")}
              onChange={(e) => updateFormData("smtp_from_name", e.target.value)}
              placeholder="Tucupid"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Verification</CardTitle>
          <CardDescription>User email verification settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="email_verification_required"
              checked={getSetting("email_verification_required")}
              onCheckedChange={(checked) => updateFormData("email_verification_required", checked)}
            />
            <Label htmlFor="email_verification_required">Require Email Verification</Label>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Require users to verify their email address before accessing the platform
          </p>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving || Object.keys(formData).length === 0}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

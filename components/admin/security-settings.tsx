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

interface SecuritySettingsProps {
  settings: Setting[]
  onUpdate: (key: string, value: any) => void
  saving: boolean
}

export function SecuritySettings({ settings, onUpdate, saving }: SecuritySettingsProps) {
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
          <CardTitle>Password Requirements</CardTitle>
          <CardDescription>Configure password strength requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password_min_length">Minimum Password Length</Label>
            <Input
              id="password_min_length"
              type="number"
              defaultValue={getSetting("password_min_length")}
              onChange={(e) => updateFormData("password_min_length", Number.parseInt(e.target.value))}
              min="6"
              max="50"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="password_require_uppercase"
                checked={getSetting("password_require_uppercase")}
                onCheckedChange={(checked) => updateFormData("password_require_uppercase", checked)}
              />
              <Label htmlFor="password_require_uppercase">Require Uppercase Letters</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="password_require_lowercase"
                checked={getSetting("password_require_lowercase")}
                onCheckedChange={(checked) => updateFormData("password_require_lowercase", checked)}
              />
              <Label htmlFor="password_require_lowercase">Require Lowercase Letters</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="password_require_numbers"
                checked={getSetting("password_require_numbers")}
                onCheckedChange={(checked) => updateFormData("password_require_numbers", checked)}
              />
              <Label htmlFor="password_require_numbers">Require Numbers</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="password_require_symbols"
                checked={getSetting("password_require_symbols")}
                onCheckedChange={(checked) => updateFormData("password_require_symbols", checked)}
              />
              <Label htmlFor="password_require_symbols">Require Symbols</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>Configure user session settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="session_timeout">Session Timeout (seconds)</Label>
            <Input
              id="session_timeout"
              type="number"
              defaultValue={getSetting("session_timeout")}
              onChange={(e) => updateFormData("session_timeout", Number.parseInt(e.target.value))}
              min="300"
              max="86400"
            />
            <p className="text-sm text-gray-500">Current: {Math.floor(getSetting("session_timeout") / 3600)} hours</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Login Security</CardTitle>
          <CardDescription>Configure login attempt limits</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
            <Input
              id="max_login_attempts"
              type="number"
              defaultValue={getSetting("max_login_attempts")}
              onChange={(e) => updateFormData("max_login_attempts", Number.parseInt(e.target.value))}
              min="3"
              max="10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lockout_duration">Lockout Duration (seconds)</Label>
            <Input
              id="lockout_duration"
              type="number"
              defaultValue={getSetting("lockout_duration")}
              onChange={(e) => updateFormData("lockout_duration", Number.parseInt(e.target.value))}
              min="60"
              max="3600"
            />
            <p className="text-sm text-gray-500">Current: {Math.floor(getSetting("lockout_duration") / 60)} minutes</p>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving || Object.keys(formData).length === 0}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

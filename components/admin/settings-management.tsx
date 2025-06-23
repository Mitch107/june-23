"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralSettings } from "./general-settings"
import { EmailSettings } from "./email-settings"
import { SecuritySettings } from "./security-settings"
import { PaymentSettings } from "./payment-settings"
import { useToast } from "@/hooks/use-toast"

interface Setting {
  key: string
  value: any
  category: string
  description: string
}

export function SettingsManagement() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: string, value: any) => {
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/settings/${key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      })

      if (response.ok) {
        setSettings((prev) => prev.map((setting) => (setting.key === key ? { ...setting, value } : setting)))
        toast({
          title: "Success",
          description: "Setting updated successfully",
        })
      } else {
        throw new Error("Failed to update setting")
      }
    } catch (error) {
      console.error("Error updating setting:", error)
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getSettingsByCategory = (category: string) => {
    return settings.filter((setting) => setting.category === category)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure your application settings and preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <GeneralSettings settings={getSettingsByCategory("general")} onUpdate={updateSetting} saving={saving} />
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <EmailSettings settings={getSettingsByCategory("email")} onUpdate={updateSetting} saving={saving} />
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <SecuritySettings settings={getSettingsByCategory("security")} onUpdate={updateSetting} saving={saving} />
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <PaymentSettings settings={getSettingsByCategory("payment")} onUpdate={updateSetting} saving={saving} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

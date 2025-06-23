"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Setting {
  key: string
  value: any
  description: string
}

interface PaymentSettingsProps {
  settings: Setting[]
  onUpdate: (key: string, value: any) => void
  saving: boolean
}

export function PaymentSettings({ settings, onUpdate, saving }: PaymentSettingsProps) {
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
          <CardTitle>Payment Gateway</CardTitle>
          <CardDescription>Configure your primary payment processor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payment_gateway">Primary Gateway</Label>
            <Select
              value={getSetting("payment_gateway")}
              onValueChange={(value) => updateFormData("payment_gateway", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="square">Square</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select value={getSetting("currency")} onValueChange={(value) => updateFormData("currency", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD - US Dollar</SelectItem>
                <SelectItem value="EUR">EUR - Euro</SelectItem>
                <SelectItem value="GBP">GBP - British Pound</SelectItem>
                <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stripe Configuration</CardTitle>
          <CardDescription>Stripe payment gateway settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stripe_public_key">Publishable Key</Label>
            <Input
              id="stripe_public_key"
              defaultValue={getSetting("stripe_public_key")}
              onChange={(e) => updateFormData("stripe_public_key", e.target.value)}
              placeholder="pk_test_..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stripe_secret_key">Secret Key</Label>
            <Input
              id="stripe_secret_key"
              type="password"
              defaultValue={getSetting("stripe_secret_key")}
              onChange={(e) => updateFormData("stripe_secret_key", e.target.value)}
              placeholder="sk_test_..."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>PayPal Configuration</CardTitle>
          <CardDescription>PayPal payment gateway settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="paypal_client_id">Client ID</Label>
            <Input
              id="paypal_client_id"
              defaultValue={getSetting("paypal_client_id")}
              onChange={(e) => updateFormData("paypal_client_id", e.target.value)}
              placeholder="PayPal Client ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="paypal_client_secret">Client Secret</Label>
            <Input
              id="paypal_client_secret"
              type="password"
              defaultValue={getSetting("paypal_client_secret")}
              onChange={(e) => updateFormData("paypal_client_secret", e.target.value)}
              placeholder="PayPal Client Secret"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
          <CardDescription>Configure fees and pricing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tax_rate">Tax Rate (%)</Label>
            <Input
              id="tax_rate"
              type="number"
              step="0.01"
              defaultValue={getSetting("tax_rate") * 100}
              onChange={(e) => updateFormData("tax_rate", Number.parseFloat(e.target.value) / 100)}
              min="0"
              max="50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="processing_fee">Processing Fee ($)</Label>
            <Input
              id="processing_fee"
              type="number"
              step="0.01"
              defaultValue={getSetting("processing_fee")}
              onChange={(e) => updateFormData("processing_fee", Number.parseFloat(e.target.value))}
              min="0"
              max="100"
            />
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving || Object.keys(formData).length === 0}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}

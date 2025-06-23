"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CheckCircle, Send } from "lucide-react"

export function ReportForm() {
  const [formData, setFormData] = useState({
    reportType: "",
    profileId: "",
    reporterEmail: "",
    description: "",
    evidence: "",
    anonymous: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.reportType) newErrors.reportType = "Report type is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.anonymous && !formData.reporterEmail.trim()) {
      newErrors.reporterEmail = "Email is required for non-anonymous reports"
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.reporterEmail && !emailRegex.test(formData.reporterEmail)) {
      newErrors.reporterEmail = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Report Submitted</h3>
          <p className="text-gray-600 mb-6">
            Thank you for your report. We take all reports seriously and will investigate this matter promptly. You
            should receive a follow-up email within 24 hours.
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false)
              setFormData({
                reportType: "",
                profileId: "",
                reporterEmail: "",
                description: "",
                evidence: "",
                anonymous: false,
              })
            }}
            variant="outline"
          >
            Submit Another Report
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Submit a Report</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="reportType">Type of Report *</Label>
            <Select value={formData.reportType} onValueChange={(value) => handleInputChange("reportType", value)}>
              <SelectTrigger className={errors.reportType ? "border-red-500" : ""}>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harassment">Harassment or Threats</SelectItem>
                <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                <SelectItem value="fake-profile">Fake Profile</SelectItem>
                <SelectItem value="scam">Scam or Fraud</SelectItem>
                <SelectItem value="safety">Safety Concern</SelectItem>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="payment">Payment Problem</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.reportType && <p className="text-sm text-red-500 mt-1">{errors.reportType}</p>}
          </div>

          <div>
            <Label htmlFor="profileId">Profile ID or Name (if applicable)</Label>
            <Input
              id="profileId"
              value={formData.profileId}
              onChange={(e) => handleInputChange("profileId", e.target.value)}
              placeholder="Enter profile ID or name"
            />
            <p className="text-xs text-gray-500 mt-1">
              If reporting about a specific profile, please provide the profile ID or name
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
              placeholder="Please provide detailed information about the issue..."
              rows={6}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="evidence">Additional Evidence</Label>
            <Textarea
              id="evidence"
              value={formData.evidence}
              onChange={(e) => handleInputChange("evidence", e.target.value)}
              placeholder="Any additional information, URLs, or evidence that might help with the investigation..."
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={formData.anonymous}
              onCheckedChange={(checked) => handleInputChange("anonymous", !!checked)}
            />
            <Label htmlFor="anonymous" className="text-sm">
              Submit this report anonymously
            </Label>
          </div>

          {!formData.anonymous && (
            <div>
              <Label htmlFor="reporterEmail">Your Email Address *</Label>
              <Input
                id="reporterEmail"
                type="email"
                value={formData.reporterEmail}
                onChange={(e) => handleInputChange("reporterEmail", e.target.value)}
                className={errors.reporterEmail ? "border-red-500" : ""}
                placeholder="your.email@example.com"
              />
              {errors.reporterEmail && <p className="text-sm text-red-500 mt-1">{errors.reporterEmail}</p>}
              <p className="text-xs text-gray-500 mt-1">We'll use this to follow up on your report</p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full bg-red-500 hover:bg-red-600">
            {isSubmitting ? (
              "Submitting Report..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Report
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            All reports are reviewed by our team. False reports may result in account restrictions.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

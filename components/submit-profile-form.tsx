"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Star, Shield, Clock, CheckCircle, Video } from "lucide-react"

interface FormData {
  // Personal Information
  firstName: string
  lastName: string
  age: string
  gender: string
  location: string
  height: string

  // Contact Information
  email: string
  whatsapp: string
  instagram: string
  tiktok?: string
  facebook?: string
  telegram?: string

  // Contact method selections
  contactMethods: {
    email: boolean
    whatsapp: boolean
    instagram: boolean
    tiktok: boolean
    facebook: boolean
    telegram: boolean
  }

  // Profile Details
  education: string
  occupation: string[]
  actualOccupation: string
  languages: string[]
  relationship: string
  children: string
  smoking: string
  drinking: string
  bodyType: string
  appearance: string
  lookingFor: string[]

  // About
  description: string
  interests: string[]

  // Photos and Videos
  media: File[]

  // Agreement
  agreeToTerms: boolean
  agreeToVerification: boolean
  over18: boolean
}

const initialFormData: FormData = {
  firstName: "",
  lastName: "",
  age: "",
  gender: "",
  location: "",
  height: "",
  email: "",
  whatsapp: "",
  instagram: "",
  tiktok: "",
  facebook: "",
  telegram: "",
  contactMethods: {
    email: false,
    whatsapp: false,
    instagram: false,
    tiktok: false,
    facebook: false,
    telegram: false,
  },
  education: "",
  occupation: [],
  actualOccupation: "",
  languages: [],
  relationship: "",
  children: "",
  smoking: "",
  drinking: "",
  bodyType: "",
  appearance: "",
  lookingFor: [],
  description: "",
  interests: [],
  media: [],
  agreeToTerms: false,
  agreeToVerification: false,
  over18: false,
}

const availableLanguages = ["Spanish", "English", "French", "Portuguese", "Italian", "German", "Chinese", "Japanese"]

const availableInterests = [
  "Travel",
  "Music",
  "Dancing",
  "Art",
  "Cooking",
  "Reading",
  "Fitness",
  "Beach",
  "Photography",
  "Movies",
  "Nature",
  "Yoga",
  "Fashion",
  "Business",
  "Sports",
  "Gaming",
  "Technology",
  "Hiking",
  "Swimming",
  "Salsa",
  "Culture",
  "Languages",
  "Shopping",
  "Spa",
]

const lookingForOptions = [
  "Long term partner",
  "Short term fun",
  "Long term, open to short",
  "Short term, open to long",
  "New friends",
  "Still figuring it out",
]

const dominicancities = [
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

const occupationOptions = [
  "Student",
  "Own my business",
  "Employed",
  "Part Time",
  "Full Time",
  "Domestic / Stay at Home",
  "Unemployed",
  "Looking for work",
]

export function SubmitProfileForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleContactMethodToggle = (method: keyof FormData["contactMethods"]) => {
    setFormData((prev) => ({
      ...prev,
      contactMethods: {
        ...prev.contactMethods,
        [method]: !prev.contactMethods[method],
      },
    }))
  }

  const handleContactValueChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Auto-check the contact method if value is entered
    if (value.trim() && field in formData.contactMethods) {
      setFormData((prev) => ({
        ...prev,
        contactMethods: {
          ...prev.contactMethods,
          [field]: true,
        },
      }))
    }
  }

  const handleArrayChange = (field: "languages" | "interests" | "lookingFor" | "occupation", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value) ? prev[field].filter((item) => item !== value) : [...prev[field], value],
    }))
  }

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (formData.media.length + files.length > 10) {
      alert("Maximum 10 photos and videos allowed")
      return
    }
    setFormData((prev) => ({ ...prev, media: [...prev.media, ...files] }))
  }

  const removeMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
    }))
  }

  const isVideo = (file: File) => {
    return file.type.startsWith("video/")
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.age) newErrors.age = "Age is required"
    if (!formData.gender) newErrors.gender = "Gender is required"
    if (!formData.location) newErrors.location = "Location is required"

    // Age validation (now using date)
    if (formData.age) {
      const birthDate = new Date(formData.age)
      const today = new Date()
      let age = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
      }

      if (age < 18 || age > 65) {
        newErrors.age = "You must be between 18 and 65 years old"
      }
    }

    // Email validation if provided
    if (formData.email && formData.email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
    }

    // Media validation
    if (formData.media.length < 3) {
      newErrors.media = "At least 3 photos or videos are required"
    }

    // Contact method validation - at least one must be selected and filled
    const contactMethods = [
      { name: "WhatsApp", selected: formData.contactMethods.whatsapp, value: formData.whatsapp },
      { name: "Instagram", selected: formData.contactMethods.instagram, value: formData.instagram },
      { name: "TikTok", selected: formData.contactMethods.tiktok, value: formData.tiktok },
      { name: "Facebook", selected: formData.contactMethods.facebook, value: formData.facebook },
      { name: "Telegram", selected: formData.contactMethods.telegram, value: formData.telegram },
      { name: "Email", selected: formData.contactMethods.email, value: formData.email },
    ]

    const hasValidContact = contactMethods.some(
      (method) => method.selected && method.value && method.value.trim().length > 0,
    )
    if (!hasValidContact) {
      newErrors.contactMethods = "At least one contact method must be selected and filled in"
    }

    // Agreements validation
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the terms"
    if (!formData.agreeToVerification) newErrors.agreeToVerification = "You must agree to verification"
    if (!formData.over18) newErrors.over18 = "You must confirm you are over 18"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submission attempted")

    if (!validateForm()) {
      console.log("Form validation failed", errors)
      return
    }

    setIsSubmitting(true)
    console.log("Form is valid, submitting...")

    try {
      // Create form data for submission
      const submitData = new FormData()

      // Add all form fields
      submitData.append("firstName", formData.firstName)
      submitData.append("lastName", formData.lastName)
      submitData.append("age", formData.age)
      submitData.append("gender", formData.gender)
      submitData.append("location", formData.location)
      submitData.append("height", formData.height)
      submitData.append("education", formData.education)
      submitData.append("occupation", JSON.stringify(formData.occupation))
      submitData.append("actualOccupation", formData.actualOccupation)
      submitData.append("languages", JSON.stringify(formData.languages))
      submitData.append("relationship", formData.relationship)
      submitData.append("children", formData.children)
      submitData.append("smoking", formData.smoking)
      submitData.append("drinking", formData.drinking)
      submitData.append("bodyType", formData.bodyType)
      submitData.append("appearance", formData.appearance)
      submitData.append("lookingFor", JSON.stringify(formData.lookingFor))
      submitData.append("description", formData.description)
      submitData.append("interests", JSON.stringify(formData.interests))

      // Add contact methods (only if selected)
      if (formData.contactMethods.email) submitData.append("email", formData.email)
      if (formData.contactMethods.whatsapp) submitData.append("whatsapp", formData.whatsapp)
      if (formData.contactMethods.instagram) submitData.append("instagram", formData.instagram)
      if (formData.contactMethods.tiktok) submitData.append("tiktok", formData.tiktok || "")
      if (formData.contactMethods.facebook) submitData.append("facebook", formData.facebook || "")
      if (formData.contactMethods.telegram) submitData.append("telegram", formData.telegram || "")

      // Add media files
      formData.media.forEach((file) => {
        submitData.append("media", file)
      })

      // Submit profile
      const response = await fetch("/api/submit-profile", {
        method: "POST",
        body: submitData,
      })

      const result = await response.json()

      if (response.ok && result.success) {
        console.log("Profile created successfully", result)
        setIsSubmitted(true)
      } else {
        console.error("API error:", result)
        setErrors((prev) => ({
          ...prev,
          submit: result.error || "Failed to submit form. Please try again.",
        }))
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      setErrors((prev) => ({
        ...prev,
        submit: "Failed to submit form. Please try again.",
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  const forceSubmit = () => {
    if (formRef.current) {
      console.log("Force submitting form")
      const event = new Event("submit", { cancelable: true, bubbles: true })
      formRef.current.dispatchEvent(event)
    }
  }

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto text-center">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile Submitted Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for submitting your profile. Our team will review your submission within 24-48 hours. You'll
            receive an email notification once your profile is approved and live on our platform.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What happens next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Profile review and verification (24-48 hours)</li>
              <li>• Email confirmation when approved</li>
              <li>• Your profile goes live on HolaCupid</li>
              <li>• Start receiving connection requests</li>
            </ul>
          </div>
          <Button onClick={() => (window.location.href = "/")} className="bg-pink-500 hover:bg-pink-600">
            Return to Home
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
        <CardContent className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why Join HolaCupid?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verified Community</h3>
                <p className="text-sm text-gray-600">Join our exclusive verified member base</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Safe & Secure</h3>
                <p className="text-sm text-gray-600">Your privacy and safety are our priority</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quick Approval</h3>
                <p className="text-sm text-gray-600">Get approved within 24-48 hours</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-sm text-red-500 mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-sm text-red-500 mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="date"
                value={formData.age}
                onChange={(e) => handleInputChange("age", e.target.value)}
                className={errors.age ? "border-red-500" : ""}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split("T")[0]}
                min={new Date(new Date().setFullYear(new Date().getFullYear() - 65)).toISOString().split("T")[0]}
              />
              {errors.age && <p className="text-sm text-red-500 mt-1">{errors.age}</p>}
            </div>
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender}</p>}
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Select value={formData.height} onValueChange={(value) => handleInputChange("height", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select height" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4'10">4'10</SelectItem>
                  <SelectItem value="4'11">4'11</SelectItem>
                  <SelectItem value="5'0">5'0</SelectItem>
                  <SelectItem value="5'1">5'1</SelectItem>
                  <SelectItem value="5'2">5'2</SelectItem>
                  <SelectItem value="5'3">5'3</SelectItem>
                  <SelectItem value="5'4">5'4</SelectItem>
                  <SelectItem value="5'5">5'5</SelectItem>
                  <SelectItem value="5'6">5'6</SelectItem>
                  <SelectItem value="5'7">5'7</SelectItem>
                  <SelectItem value="5'8">5'8</SelectItem>
                  <SelectItem value="5'9">5'9</SelectItem>
                  <SelectItem value="5'10">5'10</SelectItem>
                  <SelectItem value="5'11">5'11</SelectItem>
                  <SelectItem value="6'0">6'0</SelectItem>
                  <SelectItem value="6'1">6'1</SelectItem>
                  <SelectItem value="6'2">6'2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
              <SelectTrigger className={errors.location ? "border-red-500" : ""}>
                <SelectValue placeholder="Select your city" />
              </SelectTrigger>
              <SelectContent>
                {dominicancities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
                <SelectItem value="other">Other (Please specify in description)</SelectItem>
              </SelectContent>
            </Select>
            {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="education">Education</Label>
              <Select value={formData.education} onValueChange={(value) => handleInputChange("education", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="some-college">Some College</SelectItem>
                  <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                  <SelectItem value="masters">Master's Degree</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                  <SelectItem value="trade-school">Trade School</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Occupation</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {occupationOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={formData.occupation.includes(option)}
                      onCheckedChange={() => handleArrayChange("occupation", option)}
                    />
                    <Label htmlFor={option} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>

              {/* Show input field if "Own my business" or "Employed" is selected */}
              {(formData.occupation.includes("Own my business") || formData.occupation.includes("Employed")) && (
                <div className="mt-3">
                  <Label htmlFor="actualOccupation" className="text-sm font-medium">
                    Please specify your occupation
                  </Label>
                  <Input
                    id="actualOccupation"
                    value={formData.actualOccupation}
                    onChange={(e) => handleInputChange("actualOccupation", e.target.value)}
                    placeholder="e.g., Doctor, Teacher, Marketing Manager, Business Owner..."
                    className="mt-1"
                  />
                </div>
              )}

              <div className="mt-2">
                <p className="text-sm text-gray-600">Selected occupation:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.occupation.map((option) => (
                    <Badge key={option} variant="secondary" className="text-xs">
                      {option}
                    </Badge>
                  ))}
                  {formData.actualOccupation && (
                    <Badge variant="outline" className="text-xs">
                      {formData.actualOccupation}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>Languages Spoken</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {availableLanguages.map((language) => (
                <div key={language} className="flex items-center space-x-2">
                  <Checkbox
                    id={language}
                    checked={formData.languages.includes(language)}
                    onCheckedChange={() => handleArrayChange("languages", language)}
                  />
                  <Label htmlFor={language} className="text-sm">
                    {language}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label htmlFor="relationship">Relationship Status</Label>
              <Select value={formData.relationship} onValueChange={(value) => handleInputChange("relationship", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                  <SelectItem value="separated">Separated</SelectItem>
                  <SelectItem value="it's complicated">It's complicated</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="children">Children</Label>
              <Select value={formData.children} onValueChange={(value) => handleInputChange("children", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes-living-with-me">Yes, living with me</SelectItem>
                  <SelectItem value="yes-not-living-with-me">Yes, not living with me</SelectItem>
                  <SelectItem value="want-children">Want children</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="smoking">Smoking</Label>
              <Select value={formData.smoking} onValueChange={(value) => handleInputChange("smoking", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="occasionally">Occasionally</SelectItem>
                  <SelectItem value="regularly">Regularly</SelectItem>
                  <SelectItem value="trying-to-quit">Trying to quit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="bodyType">Body Type</Label>
              <Select value={formData.bodyType} onValueChange={(value) => handleInputChange("bodyType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slim">Slim</SelectItem>
                  <SelectItem value="athletic">Athletic</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="curvy">Curvy</SelectItem>
                  <SelectItem value="very-curvy-large-butt">Very Curvy with Large Butt</SelectItem>
                  <SelectItem value="big-and-curvy">Big and Curvy (not big and fat)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="appearance">Appearance</Label>
              <Select value={formData.appearance} onValueChange={(value) => handleInputChange("appearance", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="attractive">Attractive</SelectItem>
                  <SelectItem value="very-attractive">Very Attractive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="drinking">Drinking</Label>
            <Select value={formData.drinking} onValueChange={(value) => handleInputChange("drinking", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="socially">Socially</SelectItem>
                <SelectItem value="occasionally">Occasionally</SelectItem>
                <SelectItem value="regularly">Regularly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Looking For</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {lookingForOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={formData.lookingFor.includes(option)}
                    onCheckedChange={() => handleArrayChange("lookingFor", option)}
                  />
                  <Label htmlFor={option} className="text-sm">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Selected options:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.lookingFor.map((option) => (
                  <Badge key={option} variant="secondary" className="text-xs">
                    {option}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About You */}
      <Card>
        <CardHeader>
          <CardTitle>About You</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="description">Tell us about yourself</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
              placeholder="Describe yourself, your personality, what you're looking for, and what makes you unique..."
              rows={4}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label>Interests & Hobbies</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {availableInterests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={() => handleArrayChange("interests", interest)}
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">Selected interests:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="text-xs">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Photos and Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Photos & Videos *
            <Video className="w-5 h-5 text-pink-500" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="media">Upload Photos and Videos (3-10 files required)</Label>
            <div className="mt-2">
              <input
                id="media"
                type="file"
                multiple
                accept="image/*,video/*,.mp4,.mov,.avi,.wmv"
                onChange={handleMediaUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("media")?.click()}
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photos & Videos
              </Button>
            </div>
            {errors.media && <p className="text-sm text-red-500 mt-1">{errors.media}</p>}
          </div>

          {formData.media.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Uploaded files ({formData.media.length}/10):</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.media.map((file, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {isVideo(file) ? (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <div className="text-center">
                            <Video className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                            <p className="text-xs text-gray-600 truncate px-2">{file.name}</p>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                      onClick={() => removeMedia(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Photo & Video Guidelines:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload 3-10 high-quality photos and videos</li>
              <li>• Include at least one clear face photo</li>
              <li>• Photos and videos should be recent (within 1 year)</li>
              <li>• No inappropriate or explicit content</li>
              <li>• You must be the only person in the photos/videos</li>
              <li>• Videos should be under 30 seconds</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Contact Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Select which contact methods you want to provide. These will be shared with clients after purchase.
            <strong> At least one contact method must be selected and completed.</strong>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <div className="border rounded-lg p-4 bg-green-50 border-green-200">
              <div className="flex items-start space-x-3 mb-3">
                <Checkbox
                  id="whatsapp-checkbox"
                  checked={formData.contactMethods.whatsapp}
                  onCheckedChange={() => handleContactMethodToggle("whatsapp")}
                />
                <div>
                  <Label htmlFor="whatsapp-checkbox" className="font-medium flex items-center cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-green-600"
                    >
                      <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path>
                      <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"></path>
                      <path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"></path>
                      <path d="M9.5 13.5c.5 1 1.5 1 2.5 1s2-.5 2.5-1"></path>
                    </svg>
                    WhatsApp
                  </Label>
                </div>
              </div>
              <Input
                placeholder="Share your WhatsApp contact"
                value={formData.whatsapp}
                onChange={(e) => handleContactValueChange("whatsapp", e.target.value)}
                className="bg-white"
                disabled={!formData.contactMethods.whatsapp}
              />
            </div>

            {/* Instagram */}
            <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
              <div className="flex items-start space-x-3 mb-3">
                <Checkbox
                  id="instagram-checkbox"
                  checked={formData.contactMethods.instagram}
                  onCheckedChange={() => handleContactMethodToggle("instagram")}
                />
                <div>
                  <Label htmlFor="instagram-checkbox" className="font-medium flex items-center cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-purple-600"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                    </svg>
                    Instagram
                  </Label>
                </div>
              </div>
              <Input
                placeholder="Share your Instagram handle"
                value={formData.instagram}
                onChange={(e) => handleContactValueChange("instagram", e.target.value)}
                className="bg-white"
                disabled={!formData.contactMethods.instagram}
              />
            </div>

            {/* TikTok */}
            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start space-x-3 mb-3">
                <Checkbox
                  id="tiktok-checkbox"
                  checked={formData.contactMethods.tiktok}
                  onCheckedChange={() => handleContactMethodToggle("tiktok")}
                />
                <div>
                  <Label htmlFor="tiktok-checkbox" className="font-medium flex items-center cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-blue-600"
                    >
                      <path d="M9 12a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"></path>
                      <path d="M15 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                      <path d="M15 2v20"></path>
                      <path d="M9 15v7"></path>
                    </svg>
                    TikTok
                  </Label>
                </div>
              </div>
              <Input
                placeholder="Share your TikTok handle"
                value={formData.tiktok || ""}
                onChange={(e) => handleContactValueChange("tiktok", e.target.value)}
                className="bg-white"
                disabled={!formData.contactMethods.tiktok}
              />
            </div>

            {/* Facebook */}
            <div className="border rounded-lg p-4 bg-indigo-50 border-indigo-200">
              <div className="flex items-start space-x-3 mb-3">
                <Checkbox
                  id="facebook-checkbox"
                  checked={formData.contactMethods.facebook}
                  onCheckedChange={() => handleContactMethodToggle("facebook")}
                />
                <div>
                  <Label htmlFor="facebook-checkbox" className="font-medium flex items-center cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-indigo-600"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                    Facebook
                  </Label>
                </div>
              </div>
              <Input
                placeholder="Share your Facebook profile"
                value={formData.facebook || ""}
                onChange={(e) => handleContactValueChange("facebook", e.target.value)}
                className="bg-white"
                disabled={!formData.contactMethods.facebook}
              />
            </div>

            {/* Telegram */}
            <div className="border rounded-lg p-4 bg-sky-50 border-sky-200">
              <div className="flex items-start space-x-3 mb-3">
                <Checkbox
                  id="telegram-checkbox"
                  checked={formData.contactMethods.telegram}
                  onCheckedChange={() => handleContactMethodToggle("telegram")}
                />
                <div>
                  <Label htmlFor="telegram-checkbox" className="font-medium flex items-center cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-sky-600"
                    >
                      <path d="m22 2-7 20-4-9-9-4Z"></path>
                      <path d="M22 2 11 13"></path>
                    </svg>
                    Telegram
                  </Label>
                </div>
              </div>
              <Input
                placeholder="Share your Telegram username"
                value={formData.telegram || ""}
                onChange={(e) => handleContactValueChange("telegram", e.target.value)}
                className="bg-white"
                disabled={!formData.contactMethods.telegram}
              />
            </div>

            {/* Email */}
            <div className="border rounded-lg p-4 bg-amber-50 border-amber-200">
              <div className="flex items-start space-x-3 mb-3">
                <Checkbox
                  id="email-checkbox"
                  checked={formData.contactMethods.email}
                  onCheckedChange={() => handleContactMethodToggle("email")}
                />
                <div>
                  <Label htmlFor="email-checkbox" className="font-medium flex items-center cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 text-amber-600"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    Email
                  </Label>
                </div>
              </div>
              <Input
                placeholder="Share your email address"
                value={formData.email}
                onChange={(e) => handleContactValueChange("email", e.target.value)}
                className="bg-white"
                disabled={!formData.contactMethods.email}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      {errors.contactMethods && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{errors.contactMethods}</p>
        </div>
      )}

      {/* Terms and Agreements */}
      <Card>
        <CardHeader>
          <CardTitle>Terms and Agreements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="over18"
                checked={formData.over18}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, over18: !!checked }))}
                className={errors.over18 ? "border-red-500" : ""}
              />
              <Label htmlFor="over18" className="text-sm">
                I confirm that I am 18 years of age or older *
              </Label>
            </div>
            {errors.over18 && <p className="text-sm text-red-500">{errors.over18}</p>}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToTerms: !!checked }))}
                className={errors.agreeToTerms ? "border-red-500" : ""}
              />
              <Label htmlFor="agreeToTerms" className="text-sm">
                I agree to the{" "}
                <a href="/terms" className="text-pink-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-pink-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                *
              </Label>
            </div>
            {errors.agreeToTerms && <p className="text-sm text-red-500">{errors.agreeToTerms}</p>}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreeToVerification"
                checked={formData.agreeToVerification}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreeToVerification: !!checked }))}
                className={errors.agreeToVerification ? "border-red-500" : ""}
              />
              <Label htmlFor="agreeToVerification" className="text-sm">
                I understand that my profile will be manually reviewed and verified before going live *
              </Label>
            </div>
            {errors.agreeToVerification && <p className="text-sm text-red-500">{errors.agreeToVerification}</p>}
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">Important Notice:</h4>
            <p className="text-sm text-yellow-800">
              By submitting your profile, you consent to having your contact information (phone, email, social media)
              made available for purchase by other users of the platform. This is how our service works - users can
              browse profiles and purchase contact information to make connections.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="text-center">
        {errors.submit && <p className="text-sm text-red-500 mb-2">{errors.submit}</p>}
        <Button
          type="button"
          onClick={forceSubmit}
          disabled={isSubmitting}
          className="bg-pink-500 hover:bg-pink-600 px-8 py-3 text-lg"
        >
          {isSubmitting ? "Submitting..." : "Submit Profile for Review"}
        </Button>
        <p className="text-sm text-gray-500 mt-2">Your profile will be reviewed within 24-48 hours</p>
      </div>
    </form>
  )
}

export default SubmitProfileForm

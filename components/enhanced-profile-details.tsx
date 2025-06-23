"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Heart,
  Shield,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  GraduationCap,
  Users,
  Baby,
  Cigarette,
  Wine,
} from "lucide-react"

// Import utility functions
function sanitizeDisplayText(text: string): string {
  if (!text || typeof text !== "string") return ""
  return text.replace(/[<>]/g, "").replace(/\s+/g, " ").trim()
}

function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

function formatListItems(items: string[], visibleCount = 6) {
  if (!Array.isArray(items)) return { visible: [], hasMore: false, moreCount: 0 }

  const visible = items.slice(0, visibleCount)
  const hasMore = items.length > visibleCount
  const moreCount = items.length - visibleCount

  return { visible, hasMore, moreCount }
}

function capitalizeWords(text: string): string {
  if (!text) return ""
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

function formatContactMethods(contactInfo?: Record<string, string>) {
  if (!contactInfo) return []

  const methods = []

  if (contactInfo.whatsapp) {
    methods.push({
      label: "WhatsApp",
      icon: "W",
      color: "green",
      available: true,
    })
  }

  if (contactInfo.instagram) {
    methods.push({
      label: "Instagram",
      icon: "IG",
      color: "purple",
      available: true,
    })
  }

  if (contactInfo.email) {
    methods.push({
      label: "Email",
      icon: "@",
      color: "blue",
      available: true,
    })
  }

  if (contactInfo.telegram) {
    methods.push({
      label: "Telegram",
      icon: "T",
      color: "blue",
      available: true,
    })
  }

  if (contactInfo.tiktok) {
    methods.push({
      label: "TikTok",
      icon: "TT",
      color: "black",
      available: true,
    })
  }

  return methods
}

interface ProfileDetailsProps {
  profile: {
    id: string | number
    name: string
    age: number
    location: string
    interests: string[]
    description: string
    details: {
      height?: string
      education?: string
      profession?: string
      languages?: string[]
      relationship?: string
      children?: string
      smoking?: string
      drinking?: string
      body_type?: string
      appearance?: string
      looking_for?: string[]
    }
    contact_info?: {
      email?: string
      phone?: string
      whatsapp?: string
      instagram?: string
      tiktok?: string
      facebook?: string
      telegram?: string
    }
  }
}

export function EnhancedProfileDetails({ profile }: ProfileDetailsProps) {
  const [showAllInterests, setShowAllInterests] = useState(false)
  const [showAllLookingFor, setShowAllLookingFor] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  // Format interests with show more/less functionality
  const interestsData = formatListItems(profile.interests || [], 6)
  const displayedInterests = showAllInterests ? profile.interests : interestsData.visible

  // Format looking for data
  const lookingForData = formatListItems(profile.details.looking_for || [], 4)
  const displayedLookingFor = showAllLookingFor ? profile.details.looking_for : lookingForData.visible

  // Format contact methods
  const availableContactMethods = formatContactMethods(profile.contact_info)

  return (
    <div className="space-y-6">
      {/* Main Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <User className="w-5 h-5 mr-2 text-pink-500" />
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Basic Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.details.height && (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                    Height
                  </span>
                  <div className="text-gray-700 pl-4">{sanitizeDisplayText(profile.details.height)}</div>
                </div>
              )}

              {profile.details.profession && (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <Briefcase className="w-3 h-3 mr-2 text-pink-500" />
                    Profession
                  </span>
                  <div className="text-gray-700 pl-4 break-words">
                    {truncateText(sanitizeDisplayText(profile.details.profession), 50)}
                  </div>
                </div>
              )}

              {profile.details.education && (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <GraduationCap className="w-3 h-3 mr-2 text-pink-500" />
                    Education
                  </span>
                  <div className="text-gray-700 pl-4 break-words">
                    {truncateText(sanitizeDisplayText(profile.details.education), 50)}
                  </div>
                </div>
              )}

              {profile.details.relationship && (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <Heart className="w-3 h-3 mr-2 text-pink-500" />
                    Relationship Status
                  </span>
                  <div className="text-gray-700 pl-4">{capitalizeWords(profile.details.relationship)}</div>
                </div>
              )}
            </div>

            {/* Languages */}
            {profile.details.languages && profile.details.languages.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-900 flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Languages
                </span>
                <div className="pl-4 flex flex-wrap gap-2">
                  {profile.details.languages.map((lang, index) => (
                    <Badge key={index} variant="secondary" className="bg-pink-50 text-pink-700 border-pink-200">
                      {capitalizeWords(sanitizeDisplayText(lang))}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Interests with Show More/Less */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-semibold text-gray-900 flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Interests
                </span>
                <div className="pl-4 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {displayedInterests.map((interest, index) => (
                      <Badge key={index} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        {capitalizeWords(sanitizeDisplayText(interest))}
                      </Badge>
                    ))}
                  </div>
                  {interestsData.hasMore && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllInterests(!showAllInterests)}
                      className="text-pink-600 hover:text-pink-700 p-0 h-auto font-normal"
                    >
                      {showAllInterests ? (
                        <>
                          <ChevronUp className="w-3 h-3 mr-1" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 mr-1" />
                          Show {interestsData.moreCount} More
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Lifestyle Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {profile.details.children && (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <Baby className="w-3 h-3 mr-2 text-pink-500" />
                    Children
                  </span>
                  <div className="text-gray-700 pl-4">{capitalizeWords(profile.details.children)}</div>
                </div>
              )}

              {profile.details.smoking && (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <Cigarette className="w-3 h-3 mr-2 text-pink-500" />
                    Smoking
                  </span>
                  <div className="text-gray-700 pl-4">{capitalizeWords(profile.details.smoking)}</div>
                </div>
              )}

              {profile.details.drinking && (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <Wine className="w-3 h-3 mr-2 text-pink-500" />
                    Drinking
                  </span>
                  <div className="text-gray-700 pl-4">{capitalizeWords(profile.details.drinking)}</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What They're Looking For */}
      {profile.details.looking_for && profile.details.looking_for.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Heart className="w-5 h-5 mr-2 text-pink-500" />
              Looking For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {displayedLookingFor.map((item, index) => (
                  <Badge key={index} variant="secondary" className="bg-pink-100 text-pink-800 border-pink-200">
                    {capitalizeWords(sanitizeDisplayText(item))}
                  </Badge>
                ))}
              </div>
              {lookingForData.hasMore && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllLookingFor(!showAllLookingFor)}
                  className="text-pink-600 hover:text-pink-700 p-0 h-auto font-normal"
                >
                  {showAllLookingFor ? (
                    <>
                      <ChevronUp className="w-3 h-3 mr-1" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3 h-3 mr-1" />
                      Show {lookingForData.moreCount} More
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Physical Attributes */}
      {(profile.details.body_type || profile.details.appearance) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Users className="w-5 h-5 mr-2 text-pink-500" />
              Physical Attributes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.details.body_type && (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                    Body Type
                  </span>
                  <div className="text-gray-700 pl-4">{capitalizeWords(profile.details.body_type)}</div>
                </div>
              )}

              {profile.details.appearance && (
                <div className="space-y-1">
                  <span className="text-sm font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                    Appearance
                  </span>
                  <div className="text-gray-700 pl-4 break-words">
                    {expandedSections.has("appearance")
                      ? sanitizeDisplayText(profile.details.appearance)
                      : truncateText(sanitizeDisplayText(profile.details.appearance), 100)}
                    {profile.details.appearance.length > 100 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection("appearance")}
                        className="text-pink-600 hover:text-pink-700 p-0 h-auto font-normal ml-2"
                      >
                        {expandedSections.has("appearance") ? "Show Less" : "Show More"}
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Contact Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Contact Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {availableContactMethods.length > 0 ? (
              availableContactMethods.map((method, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">{method.icon}</span>
                    </div>
                    <span className="text-gray-700 font-medium">{method.label}</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>
              ))
            ) : (
              // Default contact methods when specific info isn't available
              <>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">W</span>
                    </div>
                    <span className="text-gray-700 font-medium">WhatsApp</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">IG</span>
                    </div>
                    <span className="text-gray-700 font-medium">Instagram</span>
                  </div>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Available
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">@</span>
                    </div>
                    <span className="text-gray-700 font-medium">Email</span>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Available
                  </Badge>
                </div>
              </>
            )}

            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 text-center">
                <Shield className="w-3 h-3 inline mr-1" />
                Contact information is revealed after purchase and verified for authenticity
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

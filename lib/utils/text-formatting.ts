/**
 * Text formatting utilities for profile display
 * Handles sanitization, truncation, and formatting of user-provided content
 */

// Sanitize text to prevent XSS and handle special characters
export function sanitizeDisplayText(text: string): string {
  if (!text || typeof text !== "string") return ""

  // Remove potentially harmful characters and normalize whitespace
  return text
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim()
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

// Format list items with show more/less functionality
export function formatListItems(items: string[], visibleCount = 6) {
  if (!Array.isArray(items)) return { visible: [], hasMore: false, moreCount: 0 }

  const visible = items.slice(0, visibleCount)
  const hasMore = items.length > visibleCount
  const moreCount = items.length - visibleCount

  return { visible, hasMore, moreCount }
}

// Capitalize words properly
export function capitalizeWords(text: string): string {
  if (!text) return ""
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Format contact methods for display
export function formatContactMethods(contactInfo?: Record<string, string>) {
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

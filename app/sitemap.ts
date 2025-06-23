import type { MetadataRoute } from "next"
import { getSlugFromProfileId } from "@/lib/utils/slug"

// Sample data - in a real app, this would come from a database
const profiles = [
  { id: 1, name: "Carmen", location: "Santo Domingo, DO" },
  { id: 2, name: "Daniela", location: "Santiago, DO" },
  { id: 3, name: "Sofia", location: "Puerto Plata, DO" },
  { id: 4, name: "Anyelina", location: "La Romana, DO" },
  { id: 5, name: "Valentina", location: "Punta Cana, DO" },
  { id: 6, name: "Dina", location: "San Pedro, DO" },
  { id: 11, name: "Scarlett", location: "Santo Domingo, DO" },
  { id: 12, name: "Isabella", location: "Santiago, DO" },
  { id: 13, name: "Camila", location: "Puerto Plata, DO" },
  { id: 14, name: "Lucia", location: "La Romana, DO" },
  { id: 15, name: "Esperanza", location: "Punta Cana, DO" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://holacupid.com"

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/safety`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    },
  ]

  // Profile pages with new slug-based URLs
  const profilePages = profiles.map((profile) => {
    const slug = getSlugFromProfileId(profile.id)
    return {
      url: `${baseUrl}/profile/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }
  })

  return [...staticPages, ...profilePages]
}

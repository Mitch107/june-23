export function generateProfileSlug(name: string, location: string): string {
  // Extract first name
  const firstName = name.split(" ")[0].toLowerCase()

  // Extract nationality from location
  const nationality = getNationalityFromLocation(location)

  // Generate base slug
  const baseSlug = `${firstName}-single-${nationality}`

  return baseSlug
}

export function getNationalityFromLocation(location: string): string {
  // Extract country code or country name from location
  if (location.includes("DO") || location.toLowerCase().includes("dominican")) {
    return "dominican"
  }

  // Add more countries as needed
  const countryMap: Record<string, string> = {
    DO: "dominican",
    "dominican republic": "dominican",
    colombia: "colombian",
    venezuela: "venezuelan",
    brazil: "brazilian",
    mexico: "mexican",
    cuba: "cuban",
    "puerto rico": "puerto-rican",
  }

  const locationLower = location.toLowerCase()
  for (const [country, nationality] of Object.entries(countryMap)) {
    if (locationLower.includes(country)) {
      return nationality
    }
  }

  return "dominican" // Default fallback
}

export function ensureUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug
  let counter = 2

  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`
    counter++
  }

  return slug
}

// Slug to ID mapping for backward compatibility
export const SLUG_TO_ID_MAP: Record<string, number> = {
  "carmen-single-dominican": 1,
  "daniela-single-dominican": 2,
  "sofia-single-dominican": 3,
  "anyelina-single-dominican": 4,
  "valentina-single-dominican": 5,
  "dina-single-dominican": 6,
  "scarlett-single-dominican": 11,
  "isabella-single-dominican": 12,
  "camila-single-dominican": 13,
  "lucia-single-dominican": 14,
  "esperanza-single-dominican": 15,
}

export const ID_TO_SLUG_MAP: Record<number, string> = Object.fromEntries(
  Object.entries(SLUG_TO_ID_MAP).map(([slug, id]) => [id, slug]),
)

export function getProfileIdFromSlug(slug: string): number | null {
  return SLUG_TO_ID_MAP[slug] || null
}

export function getSlugFromProfileId(id: number): string | null {
  return ID_TO_SLUG_MAP[id] || null
}

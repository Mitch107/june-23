import type React from "react"
import type { Metadata, Viewport } from "next/font/google"
import { Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import { Providers } from "./providers"
import { Toaster } from "@/components/toaster"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#ec4899",
}

export const metadata: Metadata = {
  metadataBase: new URL("https://holacupid.com"),
  title: {
    default: "HolaCupid - Connect with Amazing People from Dominican Republic | Verified Profiles",
    template: "%s | HolaCupid - Dominican Republic Connections",
  },
  description:
    "Browse and connect with verified profiles from the Dominican Republic. Safe, secure, and authentic connections. Get instant access to contact information including WhatsApp, Instagram, and email addresses.",
  keywords: [
    "Dominican Republic connections",
    "verified profiles",
    "contact information",
    "WhatsApp contacts",
    "Instagram profiles",
    "meet people Dominican Republic",
    "Santo Domingo contacts",
    "Santiago profiles",
    "Puerto Plata connections",
    "authentic Dominican women",
    "verified contact details",
    "instant delivery contacts",
  ],
  authors: [{ name: "HolaCupid Team" }],
  creator: "HolaCupid",
  publisher: "HolaCupid",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://holacupid.com",
    siteName: "HolaCupid",
    title: "HolaCupid - Connect with Amazing People from Dominican Republic",
    description:
      "Browse and connect with verified profiles from the Dominican Republic. Safe, secure, and authentic connections with instant contact information delivery.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "HolaCupid - Connect with Amazing People from Dominican Republic",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@holacupid",
    creator: "@holacupid",
    title: "HolaCupid - Connect with Amazing People from Dominican Republic",
    description:
      "Browse and connect with verified profiles from the Dominican Republic. Safe, secure, and authentic connections.",
    images: ["/images/twitter-card.jpg"],
  },
  alternates: {
    canonical: "https://holacupid.com",
    languages: {
      "en-US": "https://holacupid.com",
      "es-ES": "https://holacupid.com/es",
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "Social Networking",
  classification: "Social Platform",
  generator: "Next.js",
  applicationName: "HolaCupid",
  referrer: "origin-when-cross-origin",
  colorScheme: "light",
  creator: "HolaCupid Team",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "HolaCupid",
  description: "Connect with verified profiles from the Dominican Republic",
  url: "https://holacupid.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://holacupid.com/browse?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  publisher: {
    "@type": "Organization",
    name: "HolaCupid",
    url: "https://holacupid.com",
    logo: {
      "@type": "ImageObject",
      url: "https://holacupid.com/images/logo.png",
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vercel.com" />
        <link rel="preload" href="/images/hero-bg.webp" as="image" type="image/webp" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="skip-link">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-pink-500 text-white px-4 py-2 rounded-md z-50"
          >
            Skip to main content
          </a>
        </div>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <Analytics />
            {children}
          </Suspense>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

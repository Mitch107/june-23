import type { Metadata } from "next"
import { SubmitProfileForm } from "@/components/submit-profile-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Submit Your Profile | HolaCupid - Join Our Verified Community",
  description:
    "Submit your profile to join HolaCupid's verified community. Share your photos, interests, and contact information to connect with amazing people.",
  keywords: [
    "submit profile",
    "join HolaCupid",
    "verified profiles",
    "Dominican Republic profiles",
    "profile submission",
    "become verified",
    "join community",
  ],
  openGraph: {
    title: "Submit Your Profile | HolaCupid",
    description: "Join HolaCupid's verified community by submitting your profile today.",
    images: ["/images/og-submit.jpg"],
  },
  alternates: {
    canonical: "https://holacupid.com/submit-profile",
  },
}

const submitProfileJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://holacupid.com/submit-profile#webpage",
  url: "https://holacupid.com/submit-profile",
  name: "Submit Your Profile - HolaCupid",
  description: "Join HolaCupid's verified community by submitting your profile",
  isPartOf: {
    "@type": "WebSite",
    "@id": "https://holacupid.com/#website",
  },
  mainEntity: {
    "@type": "Service",
    name: "Profile Submission Service",
    description: "Submit your profile to join HolaCupid's verified community",
    provider: {
      "@type": "Organization",
      name: "HolaCupid",
    },
  },
}

export default function SubmitProfilePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(submitProfileJsonLd) }} />

      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your Profile</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join our verified community and connect with amazing people. Fill out the form below to submit your
                profile for review.
              </p>
            </header>

            <SubmitProfileForm />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

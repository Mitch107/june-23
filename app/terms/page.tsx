import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Terms of Service | HolaCupid - Terms and Conditions",
  description: "Read HolaCupid's terms of service to understand the rules and guidelines for using our platform.",
  alternates: {
    canonical: "https://holacupid.com/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600">Last updated: January 2025</p>
          </header>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  By accessing and using HolaCupid, you accept and agree to be bound by the terms and provision of this
                  agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Service Description</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  HolaCupid is a platform that allows users to browse verified profiles and purchase contact information
                  for the purpose of making connections. We are not a dating service but rather an e-commerce platform
                  for contact information.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>Users agree to:</p>
                <ul>
                  <li>Provide accurate and truthful information</li>
                  <li>Use the service for lawful purposes only</li>
                  <li>Respect the privacy and rights of others</li>
                  <li>Not engage in harassment or inappropriate behavior</li>
                  <li>Not attempt to circumvent our verification processes</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>4. Payment and Refunds</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  All purchases are final. Contact information is delivered immediately upon successful payment. Refunds
                  may be considered in cases of technical errors or if contact information is proven to be invalid.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>5. Profile Submission</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  By submitting a profile, you consent to having your contact information made available for purchase.
                  You must be 18 years or older and have the right to share the information provided.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>6. Prohibited Activities</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>Users may not:</p>
                <ul>
                  <li>Submit false or misleading information</li>
                  <li>Use the service for commercial solicitation</li>
                  <li>Attempt to hack or disrupt the service</li>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Harass or threaten other users</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>7. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  HolaCupid is not responsible for the actions of users or the outcomes of connections made through our
                  platform. We provide contact information as-is and make no guarantees about the success of any
                  connections.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>8. Termination</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We reserve the right to terminate or suspend access to our service immediately, without prior notice,
                  for conduct that we believe violates these Terms of Service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>9. Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>For questions about these Terms of Service, contact us at:</p>
                <p>
                  Email: admin@holacupid.com
                  <br />
                  Address: HolaCupid LLC, 30 N GOULD ST STE R, SHERIDAN, WY 82801
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

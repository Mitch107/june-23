import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Disclaimer | HolaCupid - Important Information",
  description: "Important disclaimers and legal information about using HolaCupid's services.",
  alternates: {
    canonical: "https://holacupid.com/disclaimer",
  },
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Disclaimer</h1>
            <p className="text-lg text-gray-600">Last updated: January 2025</p>
          </header>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>General Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  The information on this website is provided on an "as is" basis. To the fullest extent permitted by
                  law, HolaCupid excludes all representations, warranties, obligations, and liabilities arising out of
                  or in connection with this website and its contents.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Nature</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  HolaCupid is an e-commerce platform that facilitates the purchase of contact information. We are not a
                  dating service, matchmaking service, or relationship counseling service. We do not guarantee any
                  outcomes from connections made through our platform.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Responsibility</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>Users are solely responsible for:</p>
                <ul>
                  <li>Verifying the accuracy of information provided</li>
                  <li>Their interactions with other users</li>
                  <li>Their personal safety when meeting others</li>
                  <li>Compliance with applicable laws and regulations</li>
                  <li>The consequences of their actions on and off the platform</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>No Guarantees</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>We make no guarantees regarding:</p>
                <ul>
                  <li>The success of any connections or relationships</li>
                  <li>The accuracy of profile information</li>
                  <li>The availability or responsiveness of profile owners</li>
                  <li>The outcome of any interactions</li>
                  <li>Uninterrupted service availability</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Content</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Our website may contain links to third-party websites or services. We are not responsible for the
                  content, privacy policies, or practices of any third-party sites or services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Age Verification</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  While we require users to be 18 years or older and implement verification processes, we cannot
                  guarantee the age or identity of all users. Users should exercise caution and verify information
                  independently.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  To the maximum extent permitted by law, HolaCupid shall not be liable for any direct, indirect,
                  incidental, special, consequential, or punitive damages arising from your use of our services.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>If you have questions about this disclaimer, please contact us at:</p>
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

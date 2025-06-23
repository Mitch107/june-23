import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Cookie Policy | HolaCupid - How We Use Cookies",
  description: "Learn about how HolaCupid uses cookies and similar technologies to improve your browsing experience.",
  alternates: {
    canonical: "https://holacupid.com/cookies",
  },
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
            <p className="text-lg text-gray-600">Last updated: January 2025</p>
          </header>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>What Are Cookies?</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  Cookies are small text files that are stored on your computer or mobile device when you visit a
                  website. They help websites remember information about your visit, which can make your next visit
                  easier and the site more useful to you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>We use cookies for several purposes:</p>
                <ul>
                  <li>
                    <strong>Essential Cookies:</strong> Required for the website to function properly
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Help us understand how visitors interact with our website
                  </li>
                  <li>
                    <strong>Functionality Cookies:</strong> Remember your preferences and settings
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Session Cookies</h4>
                    <p>
                      These are temporary cookies that expire when you close your browser. They help us maintain your
                      session while you browse our site.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Persistent Cookies</h4>
                    <p>
                      These cookies remain on your device for a set period or until you delete them. They help us
                      remember your preferences for future visits.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Third-Party Cookies</h4>
                    <p>
                      Some cookies are placed by third-party services that appear on our pages, such as analytics
                      providers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Managing Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>You can control and manage cookies in several ways:</p>
                <ul>
                  <li>Most browsers allow you to refuse cookies or delete existing cookies</li>
                  <li>You can set your browser to notify you when cookies are being used</li>
                  <li>You can disable cookies entirely, though this may affect website functionality</li>
                </ul>
                <p>
                  Please note that disabling cookies may impact your experience on our website and limit certain
                  features.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Third-Party Services</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>We may use third-party services that also use cookies, including:</p>
                <ul>
                  <li>Google Analytics for website analytics</li>
                  <li>Payment processors for secure transactions</li>
                  <li>Social media platforms for sharing features</li>
                </ul>
                <p>These services have their own cookie policies, which we encourage you to review.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Updates to This Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>
                  We may update this Cookie Policy from time to time. Any changes will be posted on this page with an
                  updated revision date.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p>If you have questions about our use of cookies, please contact us at:</p>
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

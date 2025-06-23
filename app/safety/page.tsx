import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, AlertTriangle, Eye, Lock, Phone, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Safety Tips | HolaCupid - Stay Safe Online",
  description:
    "Important safety guidelines for using HolaCupid. Learn how to protect yourself and make safe connections online.",
  alternates: {
    canonical: "https://holacupid.com/safety",
  },
}

export default function SafetyPage() {
  const safetyTips = [
    {
      icon: Shield,
      title: "Verify Before You Meet",
      description:
        "Always verify the person's identity through video calls or additional photos before meeting in person.",
      tips: [
        "Request a video call before meeting",
        "Ask for additional recent photos",
        "Verify their social media profiles",
        "Trust your instincts if something feels off",
      ],
    },
    {
      icon: Eye,
      title: "Meet in Public Places",
      description: "Always choose public, well-lit locations for your first meetings.",
      tips: [
        "Meet in busy restaurants or cafes",
        "Avoid private or isolated locations",
        "Let someone know where you're going",
        "Have your own transportation",
      ],
    },
    {
      icon: Lock,
      title: "Protect Your Personal Information",
      description: "Be cautious about sharing sensitive personal details too quickly.",
      tips: [
        "Don't share your home address immediately",
        "Be careful with financial information",
        "Use the platform's messaging initially",
        "Gradually build trust over time",
      ],
    },
    {
      icon: Phone,
      title: "Communication Safety",
      description: "Use safe communication practices when connecting with new people.",
      tips: [
        "Start with platform messaging",
        "Use a separate phone number initially",
        "Be wary of requests for money",
        "Report suspicious behavior immediately",
      ],
    },
  ]

  const redFlags = [
    "Asks for money or financial assistance",
    "Refuses to video chat or talk on the phone",
    "Has very few photos or photos that look professional",
    "Stories don't add up or change over time",
    "Pushes to meet immediately or move off the platform",
    "Uses overly romantic language very quickly",
    "Claims to be traveling or unable to meet for extended periods",
    "Asks for personal information like SSN or bank details",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Safety Tips</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your safety is our priority. Follow these guidelines to ensure safe and positive experiences when making
              connections.
            </p>
          </header>

          {/* Safety Guidelines */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Essential Safety Guidelines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {safetyTips.map((tip, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <tip.icon className="w-5 h-5 text-pink-600" />
                      </div>
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{tip.description}</p>
                    <ul className="space-y-2">
                      {tip.tips.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Red Flags */}
          <section className="mb-12">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <CardTitle className="text-xl text-red-900">Warning Signs to Watch For</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-red-800 mb-4">
                  Be alert to these potential red flags that may indicate fraudulent or unsafe behavior:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {redFlags.map((flag, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-red-800">{flag}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Online Dating Safety */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Online Connection Best Practices</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Before Meeting</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Exchange multiple photos</li>
                    <li>• Have video conversations</li>
                    <li>• Verify their identity</li>
                    <li>• Research their background</li>
                    <li>• Trust your instincts</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">During the Meeting</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Meet in public places</li>
                    <li>• Tell someone your plans</li>
                    <li>• Have your own transportation</li>
                    <li>• Keep your phone charged</li>
                    <li>• Stay alert and sober</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">After Meeting</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Check in with friends</li>
                    <li>• Take time to reflect</li>
                    <li>• Continue building trust slowly</li>
                    <li>• Report any concerns</li>
                    <li>• Follow your comfort level</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Emergency Resources */}
          <section className="mb-12">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-xl text-blue-900">Emergency Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Emergency Numbers</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Emergency Services: 911</li>
                      <li>• National Domestic Violence Hotline: 1-800-799-7233</li>
                      <li>• Crisis Text Line: Text HOME to 741741</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Safety Apps</h4>
                    <ul className="space-y-1 text-sm text-blue-800">
                      <li>• Share your location with trusted contacts</li>
                      <li>• Use safety check-in apps</li>
                      <li>• Keep emergency contacts easily accessible</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Report Issues */}
          <section className="text-center">
            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="p-8">
                <MessageSquare className="w-12 h-12 text-pink-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Need to Report Something?</h3>
                <p className="text-gray-600 mb-6">
                  If you encounter suspicious behavior or feel unsafe, please report it immediately.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/report">
                    <Button className="bg-pink-500 hover:bg-pink-600">Report an Issue</Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline">Contact Support</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

import type { Metadata } from "next"
import { ReportForm } from "@/components/report-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, Eye, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "Report Issue | HolaCupid - Report Problems or Concerns",
  description:
    "Report inappropriate behavior, technical issues, or safety concerns on HolaCupid. We take all reports seriously.",
  alternates: {
    canonical: "https://holacupid.com/report",
  },
}

export default function ReportPage() {
  const reportTypes = [
    {
      icon: AlertTriangle,
      title: "Inappropriate Behavior",
      description: "Report harassment, inappropriate messages, or concerning behavior",
      examples: ["Harassment or threats", "Inappropriate messages", "Fake profiles", "Scam attempts"],
    },
    {
      icon: Shield,
      title: "Safety Concerns",
      description: "Report safety issues or suspicious activity",
      examples: ["Suspicious profiles", "Safety threats", "Identity theft", "Blackmail attempts"],
    },
    {
      icon: Eye,
      title: "Content Issues",
      description: "Report inappropriate photos or profile content",
      examples: ["Inappropriate photos", "False information", "Stolen photos", "Offensive content"],
    },
    {
      icon: MessageSquare,
      title: "Technical Problems",
      description: "Report website bugs or technical issues",
      examples: ["Payment issues", "Website errors", "Profile problems", "Contact delivery issues"],
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Report an Issue</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Help us maintain a safe and positive environment. Report any concerns, inappropriate behavior, or
              technical issues.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Report Types */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What can you report?</h2>
                <div className="space-y-4">
                  {reportTypes.map((type, index) => (
                    <Card key={index}>
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <type.icon className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{type.title}</CardTitle>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {type.examples.map((example, exampleIndex) => (
                            <li key={exampleIndex} className="flex items-start space-x-2">
                              <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-600">{example}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* What Happens Next */}
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-xl text-blue-900">What happens after you report?</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-blue-800">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        1
                      </div>
                      <p>We receive and review your report within 24 hours</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        2
                      </div>
                      <p>Our team investigates the reported issue or behavior</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        3
                      </div>
                      <p>We take appropriate action based on our findings</p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold">
                        4
                      </div>
                      <p>You receive a follow-up email about the resolution</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Form */}
            <div>
              <ReportForm />
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="mt-12">
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-900 mb-2">Emergency Situations</h3>
                    <p className="text-red-800 text-sm">
                      If you are in immediate danger or experiencing an emergency, please contact local emergency
                      services (911) immediately. This form is for non-emergency reports only.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

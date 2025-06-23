import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, MessageCircle, Shield, CreditCard, User, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Help Center | HolaCupid - Support & FAQ",
  description:
    "Find answers to common questions about HolaCupid. Get help with profiles, payments, verification, and more.",
  alternates: {
    canonical: "https://holacupid.com/help",
  },
}

export default function HelpPage() {
  const helpCategories = [
    {
      icon: User,
      title: "Getting Started",
      description: "Learn how to browse profiles and make connections",
      articles: [
        "How to browse profiles",
        "Understanding our verification process",
        "Creating your first purchase",
        "Setting up your account",
      ],
    },
    {
      icon: CreditCard,
      title: "Payments & Billing",
      description: "Information about pricing, payments, and billing",
      articles: ["Pricing structure explained", "Payment methods accepted", "Refund policy", "Billing questions"],
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Stay safe while making connections",
      articles: ["Safety guidelines", "Reporting inappropriate behavior", "Privacy protection", "Verification badges"],
    },
    {
      icon: Settings,
      title: "Profile Management",
      description: "Submit and manage your profile",
      articles: [
        "How to submit your profile",
        "Profile approval process",
        "Updating your information",
        "Photo guidelines",
      ],
    },
  ]

  const faqItems = [
    {
      question: "How does HolaCupid work?",
      answer:
        "HolaCupid is a platform where you can browse verified profiles and purchase contact information to make direct connections. Simply browse profiles, add your favorites to cart, and complete your purchase to receive contact details.",
    },
    {
      question: "Are all profiles verified?",
      answer:
        "Yes, all profiles go through our manual verification process to ensure authenticity. We verify photos, contact information, and profile details before approval.",
    },
    {
      question: "What contact information do I receive?",
      answer:
        "After purchase, you'll receive verified contact information which may include phone numbers, email addresses, and social media profiles, depending on what each person has provided.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Individual contacts cost $2 each for 1-9 contacts. If you purchase 10 or more contacts, the price drops to $1 each. There are no monthly fees or subscriptions.",
    },
    {
      question: "Is my payment secure?",
      answer:
        "Yes, we use industry-standard SSL encryption and work with trusted payment processors to ensure your financial information is completely secure.",
    },
    {
      question: "How do I submit my profile?",
      answer:
        "Click the 'Submit Profile' button in the header, fill out the comprehensive form with your photos and information, and our team will review it within 24-48 hours.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions and get the help you need to make the most of HolaCupid.
            </p>
          </header>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Link href="/contact">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Contact Support</h3>
                  <p className="text-sm text-gray-600">Get personalized help from our team</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/safety">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Shield className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Safety Tips</h3>
                  <p className="text-sm text-gray-600">Learn how to stay safe online</p>
                </CardContent>
              </Card>
            </Link>
            <Link href="/report">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Search className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">Report Issue</h3>
                  <p className="text-sm text-gray-600">Report problems or concerns</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Help Categories */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpCategories.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                        <category.icon className="w-5 h-5 text-pink-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <li key={articleIndex}>
                          <a href="#" className="text-sm text-gray-600 hover:text-pink-600 transition-colors">
                            {article}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Still Need Help */}
          <section className="mt-12 text-center">
            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Still need help?</h3>
                <p className="text-gray-600 mb-6">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Link href="/contact">
                  <Button className="bg-pink-500 hover:bg-pink-600">Contact Support</Button>
                </Link>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}

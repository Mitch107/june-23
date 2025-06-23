import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapPin, Mail, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Contact Us | HolaCupid - Get in Touch",
  description: "Contact HolaCupid for support, questions, or feedback. We're here to help with your connection needs.",
  alternates: {
    canonical: "https://holacupid.com/contact",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or need support? We're here to help. Get in touch with our team and we'll respond as soon
              as possible.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                      <p className="text-gray-600">
                        HolaCupid LLC.
                        <br />
                        30 N GOULD ST STE R<br />
                        SHERIDAN, WY 82801
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                      <p className="text-gray-600">admin@holacupid.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Response Time</h3>
                      <p className="text-gray-600">We typically respond within 24 hours</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Common Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">How do I purchase contact information?</h4>
                      <p className="text-sm text-gray-600">
                        Browse profiles, add them to your cart, and complete the secure checkout process.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Are the profiles verified?</h4>
                      <p className="text-sm text-gray-600">
                        Yes, all profiles go through our manual verification process.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">How do I submit my profile?</h4>
                      <p className="text-sm text-gray-600">
                        Use our "Submit Profile" form and we'll review it within 24-48 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="mt-16 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Copyright © 2007-2025 holacupid.com.
              <br />
              All rights reserved
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

import Link from "next/link"
import { ArrowRight, Search, ShoppingCart, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-pink-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Perfect <span className="text-pink-500">Connection</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            TuCupid helps you discover amazing people from the Dominican Republic and beyond. Browse profiles, select
            your favorites, and purchase contact information to make a real connection.
          </p>
          <Link href="/browse">
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-lg px-8 py-3">
              Browse Profiles Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, secure, and straightforward</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <Card className="text-center border-2 hover:border-pink-200 transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-pink-500">1</span>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Browse Profiles</h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore our extensive collection of authentic profiles from beautiful women in the Dominican Republic
                  and other countries. Use our advanced filters to find exactly what you're looking for.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="text-center border-2 hover:border-pink-200 transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-pink-500">2</span>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Add to Cart</h3>
                <p className="text-gray-600 leading-relaxed">
                  Select the profiles you're interested in and add them to your cart. No membership required. No monthly
                  fees. Pay only for the contact information you want.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="text-center border-2 hover:border-pink-200 transition-colors">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-pink-500">3</span>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Get Contact Info</h3>
                <p className="text-gray-600 leading-relaxed">
                  Complete your purchase securely and receive full contact information for your selected profiles.
                  Instant delivery with verified phone numbers, emails, and social media.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose TuCupid?</h2>
            <p className="text-xl text-gray-600">Safe, secure, and authentic connections</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">✓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Profiles</h3>
              <p className="text-gray-600">All profiles are manually verified for authenticity</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
              <p className="text-gray-600">SSL encrypted checkout with trusted payment processors</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Delivery</h3>
              <p className="text-gray-600">Receive contact information immediately after purchase</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Customer support available whenever you need help</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Is this a dating site?</h3>
              <p className="text-gray-600">
                No, TuCupid is an e-commerce platform where you purchase contact information. There are no memberships,
                subscriptions, or ongoing fees. You simply buy the contact details of profiles you're interested in.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">What information do I receive?</h3>
              <p className="text-gray-600">
                After purchase, you'll receive verified contact information including phone numbers, email addresses,
                and social media profiles where available.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Are the profiles real?</h3>
              <p className="text-gray-600">
                Yes, all profiles are manually verified for authenticity. We have a strict verification process to
                ensure all contact information is current and accurate.
              </p>
            </div>

            <div className="border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">How do I make contact?</h3>
              <p className="text-gray-600">
                Once you receive the contact information, you can reach out directly using the provided phone numbers,
                emails, or social media accounts. How you connect is up to you.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Is my payment secure?</h3>
              <p className="text-gray-600">
                Absolutely. We use industry-standard SSL encryption and work with trusted payment processors to ensure
                your financial information is completely secure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-pink-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-pink-100 mb-8 max-w-2xl mx-auto">
            Browse our collection of verified profiles and find your perfect connection today.
          </p>
          <Link href="/browse">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Browse Profiles Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}

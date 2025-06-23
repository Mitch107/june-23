"use client"

import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const CartClientPage = () => {
  const cart = useCart()
  const { user } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const items = cart.items
  const total = cart.total

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <ShoppingBag className="w-8 h-8 text-pink-500" />
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          {items.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {items.length} {items.length === 1 ? "item" : "items"}
            </Badge>
          )}
        </div>
        <Link href="/browse">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <div className="text-center py-16">
          <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Looks like you haven't added any profiles to your cart yet. Browse our collection to find someone special.
          </p>
          <div className="space-x-4">
            <Link href="/browse">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600">
                Browse Profiles
              </Button>
            </Link>
            {user && (
              <Link href="/favorites">
                <Button variant="outline" size="lg">
                  View Favorites
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* Cart with Items */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Bulk Discount Notice */}
            {items.length >= 8 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Badge className="bg-green-500">Bulk Discount</Badge>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800">
                      You're getting a great deal! With {items.length} contacts, you're paying just $1 each instead of
                      $2.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Profile Image */}
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Profile Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600 truncate">{item.location}</p>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-lg font-bold text-pink-600">${items.length >= 10 ? "1.00" : "2.00"}</span>
                        {items.length >= 10 && (
                          <Badge variant="secondary" className="text-xs">
                            Bulk Price
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => cart.removeItem(item.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <div className="pt-4">
              <Button
                onClick={() => cart.clearCart()}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Pricing Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {total.item_count} contact{total.item_count !== 1 ? "s" : ""}
                    </span>
                    <span className="font-medium">${total.subtotal.toFixed(2)}</span>
                  </div>

                  {items.length >= 10 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Bulk discount applied</span>
                      <span>-${(items.length * 2 - total.subtotal).toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing fee</span>
                    <span className="font-medium">${total.processing_fee.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-pink-600">${total.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  size="lg"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                  disabled={items.length === 0}
                >
                  Proceed to Checkout
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                {/* Security Notice */}
                <div className="text-xs text-gray-500 text-center space-y-1">
                  <p>🔒 Secure payment • Instant delivery</p>
                  <p>All contact information is verified and up-to-date</p>
                </div>

                {/* Pricing Info */}
                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <h4 className="font-medium text-gray-900 mb-2">Pricing Information</h4>
                  <ul className="space-y-1 text-gray-600">
                    <li>• 1-9 contacts: $2.00 each</li>
                    <li>• 10+ contacts: $1.00 each</li>
                    <li>• Instant WhatsApp, Instagram & Email</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default CartClientPage

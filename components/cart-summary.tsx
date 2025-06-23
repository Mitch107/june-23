"use client"

import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Loader2 } from "lucide-react"
import Link from "next/link"

export function CartSummary() {
  const { total, loading } = useCart()
  const { user } = useAuth()

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Sign in to start shopping</p>
          <Button className="bg-pink-500 hover:bg-pink-600">Sign In</Button>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading cart...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5" />
          Cart Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Items ({total.item_count})</span>
          <span>${total.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Processing Fee</span>
          <span>${total.processing_fee.toFixed(2)}</span>
        </div>
        {total.item_count >= 10 && (
          <div className="flex justify-between text-green-600">
            <span>Bulk Discount Applied</span>
            <span>$1 per contact</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.total.toFixed(2)}</span>
        </div>

        {total.item_count > 0 ? (
          <Link href="/cart">
            <Button className="w-full bg-pink-500 hover:bg-pink-600">View Cart & Checkout</Button>
          </Link>
        ) : (
          <p className="text-center text-gray-500 text-sm">Your cart is empty</p>
        )}

        <div className="text-xs text-gray-500 text-center">
          <p>• Secure checkout with SSL encryption</p>
          <p>• Instant delivery after payment</p>
        </div>
      </CardContent>
    </Card>
  )
}

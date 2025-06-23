"use client"

import type React from "react"

import Image from "next/image"
import { X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface CartItemProps {
  data: {
    id: number
    name: string
    price: number
    image: string
    location: string
  }
}

export const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart()

  const onRemove = () => {
    cart.removeItem(data.id)
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative h-20 w-20 rounded-md overflow-hidden">
            <Image src={data.image || "/placeholder.svg"} alt={data.name} fill className="object-cover" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-lg">{data.name}</h3>
            {/* {data.age && <p className="text-sm text-gray-600">Age: {data.age}</p>} */}
            {data.location && <p className="text-sm text-gray-600">Location: {data.location}</p>}
            <p className="font-bold text-lg text-pink-600">${data.price}</p>
          </div>

          <Button
            onClick={onRemove}
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

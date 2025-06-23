"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Package, User, CreditCard, MapPin, Calendar, DollarSign } from "lucide-react"

interface OrderItem {
  id: string
  profile_name: string
  price: number
  quantity: number
}

interface Order {
  id: string
  email: string
  total_amount: number
  status: string
  payment_status: string
  created_at: string
  updated_at: string
  notes?: string
  shipping_address?: any
  billing_address?: any
  order_items: OrderItem[]
}

interface OrderDetailModalProps {
  order: Order
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function OrderDetailModal({ order, isOpen, onClose, onUpdate }: OrderDetailModalProps) {
  const [status, setStatus] = useState(order.status)
  const [paymentStatus, setPaymentStatus] = useState(order.payment_status)
  const [notes, setNotes] = useState(order.notes || "")
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          payment_status: paymentStatus,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update order")
      }

      onUpdate()
      onClose()
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Failed to update order. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      processing: "secondary",
      completed: "default",
      cancelled: "destructive",
      refunded: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const getPaymentStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      paid: "default",
      failed: "destructive",
      refunded: "destructive",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  const formatAddress = (address: any) => {
    if (!address) return "No address provided"
    if (typeof address === "string") {
      try {
        address = JSON.parse(address)
      } catch {
        return address
      }
    }
    return `${address.street || ""}, ${address.city || ""}, ${address.state || ""} ${address.zip || ""}, ${address.country || ""}`
      .replace(/,\s*,/g, ",")
      .replace(/^,\s*|,\s*$/g, "")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details - {order.id.slice(0, 8)}...
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-sm">{order.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Order ID</label>
                <p className="text-sm font-mono">{order.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Order Date</label>
                <p className="text-sm flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Amount</label>
                <p className="text-lg font-semibold flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />${order.total_amount.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Status and Payment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Status & Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Order Status</label>
                <div className="mt-1">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Payment Status</label>
                <div className="mt-1">
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Current Status</label>
                <div className="flex gap-2 mt-1">
                  {getStatusBadge(order.status)}
                  {getPaymentStatusBadge(order.payment_status)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{formatAddress(order.shipping_address)}</p>
            </CardContent>
          </Card>

          {/* Billing Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Billing Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{formatAddress(order.billing_address)}</p>
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="font-medium">{item.profile_name}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No items found for this order</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add notes about this order..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Order"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

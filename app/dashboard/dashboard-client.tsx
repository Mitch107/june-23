"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getUserOrders, getContactDeliveries, markContactAccessed } from "@/lib/supabase/orders"
import { ShoppingCart, Heart, Download, User, Loader2, Eye } from "lucide-react"
import Link from "next/link"
import { CartSummary } from "@/components/cart-summary"

export function DashboardClient() {
  const { user, profile, loading: authLoading } = useAuth()
  const { total } = useCart()
  const [orders, setOrders] = useState<any[]>([])
  const [contactDeliveries, setContactDeliveries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      const [ordersData, deliveriesData] = await Promise.all([getUserOrders(), getContactDeliveries()])
      setOrders(ordersData)
      setContactDeliveries(deliveriesData)
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewContact = async (deliveryId: string) => {
    try {
      await markContactAccessed(deliveryId)
      // Refresh deliveries to update accessed_at
      const deliveriesData = await getContactDeliveries()
      setContactDeliveries(deliveriesData)
    } catch (error) {
      console.error("Error marking contact as accessed:", error)
    }
  }

  if (authLoading || loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">Please sign in to access your dashboard.</p>
          <Link href="/">
            <Button className="bg-pink-500 hover:bg-pink-600">Go Home</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || user.email?.split("@")[0]}!
          </h1>
          <p className="text-gray-600">Manage your account and view your purchases</p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <ShoppingCart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{total.item_count}</div>
              <div className="text-sm text-gray-600">Items in Cart</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{contactDeliveries.length}</div>
              <div className="text-sm text-gray-600">Contacts Purchased</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{profile?.favorite_profiles?.length || 0}</div>
              <div className="text-sm text-gray-600">Favorites</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <User className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="contacts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contacts">My Contacts</TabsTrigger>
                <TabsTrigger value="orders">Order History</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>

              <TabsContent value="contacts" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Purchased Contacts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {contactDeliveries.length === 0 ? (
                      <div className="text-center py-8">
                        <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No contacts purchased yet</p>
                        <Link href="/browse">
                          <Button className="bg-pink-500 hover:bg-pink-600">Browse Profiles</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {contactDeliveries.map((delivery) => (
                          <div key={delivery.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{delivery.profiles.name}</h3>
                              <Badge variant={delivery.accessed_at ? "secondary" : "default"}>
                                {delivery.accessed_at ? "Viewed" : "New"}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{delivery.profiles.location}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                Purchased: {new Date(delivery.delivered_at).toLocaleDateString()}
                              </span>
                              <Button
                                size="sm"
                                onClick={() => handleViewContact(delivery.id)}
                                className="bg-pink-500 hover:bg-pink-600"
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Contact
                              </Button>
                            </div>
                            {delivery.accessed_at && (
                              <div className="mt-3 p-3 bg-gray-50 rounded">
                                <h4 className="font-medium mb-2">Contact Information:</h4>
                                <div className="space-y-1 text-sm">
                                  {delivery.contact_data.email && (
                                    <p>
                                      <strong>Email:</strong> {delivery.contact_data.email}
                                    </p>
                                  )}
                                  {delivery.contact_data.phone && (
                                    <p>
                                      <strong>Phone:</strong> {delivery.contact_data.phone}
                                    </p>
                                  )}
                                  {delivery.contact_data.whatsapp && (
                                    <p>
                                      <strong>WhatsApp:</strong> {delivery.contact_data.whatsapp}
                                    </p>
                                  )}
                                  {delivery.contact_data.instagram && (
                                    <p>
                                      <strong>Instagram:</strong> {delivery.contact_data.instagram}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No orders yet</p>
                        <Link href="/browse">
                          <Button className="bg-pink-500 hover:bg-pink-600">Start Shopping</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">Order #{order.id.slice(0, 8)}</h3>
                              <Badge variant={order.status === "completed" ? "default" : "secondary"}>
                                {order.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                <p className="text-gray-600">Items: {order.order_items.length}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Total: ${order.total_amount.toFixed(2)}</p>
                                <p className="text-gray-600">Status: {order.status}</p>
                              </div>
                            </div>
                            <Separator className="my-3" />
                            <div className="space-y-2">
                              {order.order_items.map((item: any) => (
                                <div key={item.id} className="flex justify-between text-sm">
                                  <span>{item.profile_name}</span>
                                  <span>${item.price.toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Profiles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!profile?.favorite_profiles || profile.favorite_profiles.length === 0 ? (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No favorites yet</p>
                        <Link href="/browse">
                          <Button className="bg-pink-500 hover:bg-pink-600">Browse Profiles</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">
                          You have {profile.favorite_profiles.length} favorite profiles
                        </p>
                        <Link href="/browse">
                          <Button className="bg-pink-500 hover:bg-pink-600">View All Profiles</Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </main>
  )
}

import { Suspense } from "react"
import { OrdersManagement } from "@/components/admin/orders-management"
import { AdminPageSkeleton } from "@/components/admin/skeletons"

export const metadata = {
  title: "Orders Management - Admin",
  description: "Manage customer orders and transactions",
}

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600">View and manage customer orders</p>
      </div>

      <Suspense fallback={<AdminPageSkeleton />}>
        <OrdersManagement />
      </Suspense>
    </div>
  )
}

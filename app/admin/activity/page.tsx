import { Suspense } from "react"
import { AdminPageSkeleton } from "@/components/admin/skeletons"
import { ActivityLogManagement } from "@/components/admin/activity-log-management"

export default function ActivityLogPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Activity Log</h1>
        <p className="mt-2 text-sm text-gray-700">Track admin actions, user activities, and system events</p>
      </div>

      <Suspense fallback={<AdminPageSkeleton />}>
        <ActivityLogManagement />
      </Suspense>
    </div>
  )
}

import { Suspense } from "react"
import { AdminPageSkeleton } from "@/components/admin/skeletons"
import { SettingsManagement } from "@/components/admin/settings-management"

export const metadata = {
  title: "Settings - Admin Dashboard",
  description: "Manage system settings and configuration",
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage system settings and configuration</p>
      </div>

      <Suspense fallback={<AdminPageSkeleton />}>
        <SettingsManagement />
      </Suspense>
    </div>
  )
}

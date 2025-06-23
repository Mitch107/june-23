"use client"

import { useState, useEffect } from "react"
import { Search, Download, Eye, AlertTriangle, Info, AlertCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AdminPageSkeleton } from "@/components/admin/skeletons"
import { ActivityDetailModal } from "@/components/admin/activity-detail-modal"

interface ActivityLog {
  id: string
  admin_user_id: string
  user_id?: string
  action: string
  entity_type: string
  entity_id?: string
  description: string
  severity: "info" | "warning" | "error" | "critical"
  metadata?: any
  old_values?: any
  new_values?: any
  created_at: string
  admin_user?: { email: string }
  target_user?: { email: string }
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export function ActivityLogManagement() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  // Filters
  const [search, setSearch] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [entityTypeFilter, setEntityTypeFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [dateFromFilter, setDateFromFilter] = useState("")
  const [dateToFilter, setDateToFilter] = useState("")

  // Modal state
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  const fetchLogs = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(actionFilter !== "all" && { action: actionFilter }),
        ...(entityTypeFilter !== "all" && { entity_type: entityTypeFilter }),
        ...(severityFilter !== "all" && { severity: severityFilter }),
        ...(dateFromFilter && { date_from: dateFromFilter }),
        ...(dateToFilter && { date_to: dateToFilter }),
      })

      const response = await fetch(`/api/admin/activity?${params}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to fetch activity logs")
      }

      const data = await response.json()
      setLogs(data.logs || [])
      setPagination(data.pagination)
    } catch (err) {
      console.error("Error fetching logs:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
      setLogs([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [search, actionFilter, entityTypeFilter, severityFilter, dateFromFilter, dateToFilter])

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
    fetchLogs(newPage)
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "error":
        return "bg-red-50 text-red-700"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const exportLogs = async () => {
    try {
      const params = new URLSearchParams({
        page: "1",
        limit: "1000", // Export more records
        ...(search && { search }),
        ...(actionFilter !== "all" && { action: actionFilter }),
        ...(entityTypeFilter !== "all" && { entity_type: entityTypeFilter }),
        ...(severityFilter !== "all" && { severity: severityFilter }),
        ...(dateFromFilter && { date_from: dateFromFilter }),
        ...(dateToFilter && { date_to: dateToFilter }),
      })

      const response = await fetch(`/api/admin/activity?${params}`)
      const data = await response.json()

      // Convert to CSV
      const csv = [
        ["Date", "Action", "Entity Type", "Severity", "Admin User", "Description"].join(","),
        ...data.logs.map((log: ActivityLog) =>
          [
            formatDate(log.created_at),
            log.action,
            log.entity_type,
            log.severity,
            log.admin_user?.email || "System",
            `"${log.description}"`,
          ].join(","),
        ),
      ].join("\n")

      // Download CSV
      const blob = new Blob([csv], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `activity-logs-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error exporting logs:", err)
    }
  }

  if (loading && logs.length === 0) {
    return <AdminPageSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="profile_approved">Profile Approved</SelectItem>
              <SelectItem value="profile_rejected">Profile Rejected</SelectItem>
              <SelectItem value="order_status_updated">Order Updated</SelectItem>
              <SelectItem value="user_login">User Login</SelectItem>
              <SelectItem value="system_backup">System Backup</SelectItem>
            </SelectContent>
          </Select>

          <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by entity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="profile">Profile</SelectItem>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <Input type="datetime-local" value={dateFromFilter} onChange={(e) => setDateFromFilter(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <Input type="datetime-local" value={dateToFilter} onChange={(e) => setDateToFilter(e.target.value)} />
          </div>

          <div className="flex items-end">
            <Button onClick={exportLogs} variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">{error}</p>
            <Button onClick={() => fetchLogs()} variant="outline" size="sm" className="mt-2">
              Retry
            </Button>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(log.created_at)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="outline">{log.action}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="secondary">{log.entity_type}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getSeverityIcon(log.severity)}
                      <Badge className={`ml-2 ${getSeverityColor(log.severity)}`}>{log.severity}</Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.admin_user?.email || "System"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{log.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedLog(log)
                        setShowDetailModal(true)
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500">No activity logs found</p>
            <p className="text-sm text-gray-400 mt-2">
              Activity logs will appear here once the database table is created and populated.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>{" "}
                  of <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <Button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    variant="outline"
                    className="rounded-r-none"
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        variant={pagination.page === page ? "default" : "outline"}
                        className="rounded-none"
                      >
                        {page}
                      </Button>
                    )
                  })}
                  <Button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    variant="outline"
                    className="rounded-l-none"
                  >
                    Next
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity Detail Modal */}
      {selectedLog && (
        <ActivityDetailModal
          log={selectedLog}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false)
            setSelectedLog(null)
          }}
        />
      )}
    </div>
  )
}

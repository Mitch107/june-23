"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Info, AlertCircle, XCircle, User, Calendar, Tag, Database } from "lucide-react"

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

interface ActivityDetailModalProps {
  log: ActivityLog
  isOpen: boolean
  onClose: () => void
}

export function ActivityDetailModal({ log, isOpen, onClose }: ActivityDetailModalProps) {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "error":
        return "bg-red-50 text-red-700 border-red-200"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    })
  }

  const formatJSON = (obj: any) => {
    if (!obj) return "None"
    return JSON.stringify(obj, null, 2)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getSeverityIcon(log.severity)}
            Activity Log Details
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Date & Time</span>
                </div>
                <p className="text-sm text-gray-900 ml-6">{formatDate(log.created_at)}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Severity</span>
                </div>
                <div className="ml-6">
                  <Badge className={`${getSeverityColor(log.severity)} border`}>{log.severity.toUpperCase()}</Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Admin User</span>
                </div>
                <p className="text-sm text-gray-900 ml-6">{log.admin_user?.email || "System"}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Entity Type</span>
                </div>
                <div className="ml-6">
                  <Badge variant="secondary">{log.entity_type}</Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action and Description */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Action</h3>
                <Badge variant="outline" className="text-base px-3 py-1">
                  {log.action}
                </Badge>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{log.description}</p>
              </div>
            </div>

            {/* Entity Information */}
            {log.entity_id && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Entity Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Entity ID:</span> {log.entity_id}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Entity Type:</span> {log.entity_type}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Target User */}
            {log.target_user && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Target User</h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{log.target_user.email}</p>
                </div>
              </>
            )}

            {/* Changes */}
            {(log.old_values || log.new_values) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Changes</h3>

                  {log.old_values && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Values</h4>
                      <pre className="text-xs text-gray-600 bg-red-50 p-3 rounded-md overflow-x-auto border border-red-200">
                        {formatJSON(log.old_values)}
                      </pre>
                    </div>
                  )}

                  {log.new_values && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">New Values</h4>
                      <pre className="text-xs text-gray-600 bg-green-50 p-3 rounded-md overflow-x-auto border border-green-200">
                        {formatJSON(log.new_values)}
                      </pre>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h3>
                  <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded-md overflow-x-auto border">
                    {formatJSON(log.metadata)}
                  </pre>
                </div>
              </>
            )}

            {/* Technical Details */}
            <Separator />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Technical Details</h3>
              <div className="bg-gray-50 p-3 rounded-md space-y-1">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Log ID:</span> {log.id}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Admin User ID:</span> {log.admin_user_id}
                </p>
                {log.user_id && (
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Target User ID:</span> {log.user_id}
                  </p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

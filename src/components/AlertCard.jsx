import { AlertTriangle, AlertCircle, Info, Check, X } from "lucide-react"

/**
 * AlertCard Component
 * Displays a smart alert with severity, action, and acknowledge button
 */
function AlertCard({ alert, onAcknowledge, onDismiss }) {
  // Alert type styles
  const typeStyles = {
    critical: {
      bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      icon: "bg-red-100 dark:bg-red-900/50 text-red-600",
      badge: "bg-red-500 text-white",
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
      icon: "bg-amber-100 dark:bg-amber-900/50 text-amber-600",
      badge: "bg-amber-500 text-white",
    },
    info: {
      bg: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      icon: "bg-blue-100 dark:bg-blue-900/50 text-blue-600",
      badge: "bg-blue-500 text-white",
    },
  }

  const style = typeStyles[alert.type] || typeStyles.info

  // Icon based on type
  const IconComponent =
    alert.type === "critical" ? AlertTriangle : alert.type === "warning" ? AlertCircle : Info

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div
      className={`rounded-xl border p-4 ${style.bg} ${
        alert.acknowledged ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`p-2 rounded-lg ${style.icon}`}>
          <IconComponent className="w-5 h-5" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style.badge}`}>
              {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{alert.domain}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {formatTime(alert.timestamp)}
            </span>
          </div>

          <h4 className="font-semibold text-gray-900 dark:text-white">{alert.title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{alert.message}</p>

          {/* Value vs Threshold */}
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Current: <span className="font-semibold text-gray-900 dark:text-white">{alert.value}</span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              Threshold: <span className="font-semibold">{alert.threshold}</span>
            </span>
          </div>

          {/* Recommended Action */}
          <div className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Recommended Action:
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300">{alert.action}</p>
          </div>

          {/* Actions */}
          {!alert.acknowledged && (
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => onAcknowledge && onAcknowledge(alert.id)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Check className="w-4 h-4" />
                Acknowledge
              </button>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(alert.id)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {alert.acknowledged && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1">
              <Check className="w-3 h-3" /> Acknowledged
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AlertCard

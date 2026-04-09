import { useContext, useState } from "react"
import { AppContext } from "../App"
import AlertCard from "../components/AlertCard"
import { smartAlerts, demoAlerts } from "../data/mockData"
import { Bell, Filter, Play, RefreshCw } from "lucide-react"

function Alerts() {
  const { alerts, setAlerts } = useContext(AppContext)
  const [filter, setFilter] = useState("all") // all, critical, warning, info
  const [domainFilter, setDomainFilter] = useState("all")

  // Combine static alerts with dynamic alerts
  const allAlerts = [...smartAlerts, ...alerts]

  // Get unique domains
  const domains = [...new Set(allAlerts.map((a) => a.domain))]

  // Filter alerts
  const filteredAlerts = allAlerts.filter((alert) => {
    if (filter !== "all" && alert.type !== filter) return false
    if (domainFilter !== "all" && alert.domain !== domainFilter) return false
    return true
  })

  // Sort by timestamp (newest first) and acknowledged status
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    // Unacknowledged first
    if (a.acknowledged !== b.acknowledged) return a.acknowledged ? 1 : -1
    // Then by timestamp
    return new Date(b.timestamp) - new Date(a.timestamp)
  })

  // Handle acknowledge
  const handleAcknowledge = (id) => {
    // Check if it's a dynamic alert
    const isDynamic = alerts.some((a) => a.id === id)
    if (isDynamic) {
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
      )
    }
    // Note: For static smartAlerts, we would need to add them to state to track acknowledgment
    // For simplicity, we're just handling dynamic alerts here
  }

  // Handle dismiss (remove from dynamic alerts)
  const handleDismiss = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  // Trigger demo alert
  const triggerDemoAlert = () => {
    const randomAlert = demoAlerts[Math.floor(Math.random() * demoAlerts.length)]
    const newAlert = {
      ...randomAlert,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      acknowledged: false,
    }
    setAlerts((prev) => [newAlert, ...prev])
  }

  // Clear all dynamic alerts
  const clearAll = () => {
    setAlerts([])
  }

  // Count by type
  const counts = {
    all: allAlerts.length,
    critical: allAlerts.filter((a) => a.type === "critical").length,
    warning: allAlerts.filter((a) => a.type === "warning").length,
    info: allAlerts.filter((a) => a.type === "info").length,
    unacknowledged: allAlerts.filter((a) => !a.acknowledged).length,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Alerts</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{counts.unacknowledged} unacknowledged alert{counts.unacknowledged !== 1 ? "s" : ""} requiring action </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={triggerDemoAlert} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors" >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Trigger Demo Alert</span>
          </button>
          {alerts.length > 0 && (
            <button onClick={clearAll} className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Clear Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter("all")}
          className={`p-4 rounded-xl border transition-colors text-left ${
            filter === "all" ? "bg-primary text-white border-primary" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary" }`} >
          <Bell className={`w-5 h-5 mb-2 ${filter === "all" ? "text-white" : "text-gray-400"}`} />
          <p className={`text-2xl font-bold ${filter === "all" ? "text-white" : "text-gray-900 dark:text-white"}`}>
            {counts.all}
          </p>
          <p className={`text-sm ${filter === "all" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>All Alerts</p>
        </button>

        <button
          onClick={() => setFilter("critical")}
          className={`p-4 rounded-xl border transition-colors text-left ${
            filter === "critical" ? "bg-red-500 text-white border-red-500" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-red-500" }`} >
          <div className={`w-3 h-3 rounded-full mb-2 ${filter === "critical" ? "bg-white" : "bg-red-500"}`} />
          <p className={`text-2xl font-bold ${filter === "critical" ? "text-white" : "text-gray-900 dark:text-white"}`}>
            {counts.critical}
          </p>
          <p className={`text-sm ${filter === "critical" ? "text-red-100" : "text-gray-500 dark:text-gray-400"}`}>Critical</p>
        </button>

        <button
          onClick={() => setFilter("warning")}
          className={`p-4 rounded-xl border transition-colors text-left ${
            filter === "warning" ? "bg-amber-500 text-white border-amber-500" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-amber-500" }`} >
          <div className={`w-3 h-3 rounded-full mb-2 ${filter === "warning" ? "bg-white" : "bg-amber-500"}`} />
          <p className={`text-2xl font-bold ${filter === "warning" ? "text-white" : "text-gray-900 dark:text-white"}`}>
            {counts.warning}
          </p>
          <p className={`text-sm ${filter === "warning" ? "text-amber-100" : "text-gray-500 dark:text-gray-400"}`}>  Warning</p>
        </button>

        <button
          onClick={() => setFilter("info")}
          className={`p-4 rounded-xl border transition-colors text-left ${
            filter === "info"  ? "bg-blue-500 text-white border-blue-500"  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-500" }`} >
          <div className={`w-3 h-3 rounded-full mb-2 ${filter === "info" ? "bg-white" : "bg-blue-500"}`} />
          <p className={`text-2xl font-bold ${filter === "info" ? "text-white" : "text-gray-900 dark:text-white"}`}>
            {counts.info}
          </p>
          <p className={`text-sm ${filter === "info" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}> Info</p>
        </button>
      </div>

      {/* Domain Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">Domain:</span>
        <button onClick={() => setDomainFilter("all")} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${ domainFilter === "all"   ? "bg-primary text-white"   : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" }`} >  All Domains</button>
        {domains.map((domain) => (
          <button key={domain} onClick={() => setDomainFilter(domain)} className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${ domainFilter === domain ? "bg-primary text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600" }`} >   {domain} </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {sortedAlerts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No alerts matching your filters</p>
            <button
              onClick={() => {
                setFilter("all")
                setDomainFilter("all")
              }}
              className="mt-4 text-primary hover:underline text-sm"
            >
              Clear filters
            </button>
          </div>
        ) : (
          sortedAlerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} onDismiss={alerts.some((a) => a.id === alert.id) ? handleDismiss : undefined} /> ))
        )}
      </div>

      {/* Alert Thresholds Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Alert Thresholds</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <p className="text-gray-500 dark:text-gray-400 font-medium">Operations</p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>Delivery Time: {">"} 40 min triggers alert</li>
              <li>Kitchen Ticket Time: {">"} 22 min triggers alert</li>
              <li>Table Dwell Time: {">"} 20 min over target at peak</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500 dark:text-gray-400 font-medium">Orders & Inventory</p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>Order Error Rate: {">"} 2% in any shift</li>
              <li>Cancellation Rate: {">"} 5% in 2-hr window</li>
              <li>Food Waste: {">"} daily threshold</li>
              <li>Shrinkage: {">"} 2% weekly on high-value</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500 dark:text-gray-400 font-medium">Revenue & Staff</p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>RevPASH: {">"} 15% drop vs same weekday</li>
              <li>Peak Hour Capture: Below 35% of daily</li>
              <li>Labour Cost: {">"} 38% triggers alert</li>
              <li>Staff No-Show: 2hrs before shift</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-gray-500 dark:text-gray-400 font-medium">Customer & Finance</p>
            <ul className="space-y-1 text-gray-600 dark:text-gray-300">
              <li>Review Score: Any 1-2 star instant alert</li>
              <li>Complaint: Unresolved {">"} 20 min in-house</li>
              <li>Cash Runway: {"<"} 21 days triggers alert</li>
              <li>Delivery Net Margin: {"<"} 8%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alerts;
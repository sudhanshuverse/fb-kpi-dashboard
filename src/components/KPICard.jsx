import { TrendingUp, TrendingDown, Minus, AlertCircle, Info } from "lucide-react"
import { useState } from "react"

/**
 * KPICard Component
 * Displays a single KPI metric with trend and status indicators
 * 
 * Props:
 * - title: KPI name
 * - value: Current value (formatted)
 * - unit: Unit suffix (%, $, min, etc.)
 * - trend: "up" | "down" | "flat"
 * - trendValue: Percentage change
 * - status: "success" | "warning" | "danger"
 * - benchmark: Benchmark text (e.g., "Target: 90%")
 * - formula: Formula explanation for tooltip
 * - isAlert: Show alert icon if true
 * - sparklineData: Array of numbers for mini chart
 */
function KPICard({
  title,
  value,
  unit = "",
  trend = "flat",
  trendValue,
  status = "success",
  benchmark,
  formula,
  isAlert = false,
  sparklineData,
  onClick,
}) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Status colors
  const statusColors = {
    success: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
    danger: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  }

  // Trend colors (some KPIs "up" is bad, like costs)
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    flat: "text-gray-500",
  }

  // Trend icons
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  // Simple sparkline SVG
  const renderSparkline = () => {
    if (!sparklineData || sparklineData.length < 2) return null
    
    const max = Math.max(...sparklineData)
    const min = Math.min(...sparklineData)
    const range = max - min || 1
    const width = 60
    const height = 20
    
    const points = sparklineData
      .map((val, i) => {
        const x = (i / (sparklineData.length - 1)) * width
        const y = height - ((val - min) / range) * height
        return `${x},${y}`
      })
      .join(" ")

    return (
      <svg width={width} height={height} className="ml-2">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary"
        />
      </svg>
    )
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 transition-all hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      } ${isAlert ? "ring-2 ring-red-500" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3
            className="text-sm font-medium text-gray-600 dark:text-gray-400"
            onMouseEnter={() => formula && setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {title}
            {formula && <Info className="inline w-3 h-3 ml-1 opacity-50" />}
          </h3>
          {isAlert && <AlertCircle className="w-4 h-4 text-red-500" />}
        </div>
        <span
          className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[status]}`}
        >
          {status === "success" ? "On Target" : status === "warning" ? "Watch" : "Alert"}
        </span>
      </div>

      {/* Formula Tooltip */}
      {showTooltip && formula && (
        <div className="absolute z-10 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg max-w-xs">
          {formula}
        </div>
      )}

      {/* Value */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
            {unit && (
              <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{unit}</span>
            )}
          </div>

          {/* Trend */}
          {trendValue !== undefined && (
            <div className={`flex items-center gap-1 mt-1 ${trendColors[trend]}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{trendValue}%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">vs prev</span>
            </div>
          )}

          {/* Benchmark */}
          {benchmark && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{benchmark}</p>
          )}
        </div>

        {/* Sparkline */}
        {renderSparkline()}
      </div>
    </div>
  )
}

export default KPICard

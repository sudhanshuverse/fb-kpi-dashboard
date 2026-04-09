/**
 * ChartCard Component
 * A wrapper card for charts with title and optional actions
 */
function ChartCard({ title, subtitle, children, action }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && action}
      </div>

      {/* Chart Content */}
      <div>{children}</div>
    </div>
  )
}

export default ChartCard

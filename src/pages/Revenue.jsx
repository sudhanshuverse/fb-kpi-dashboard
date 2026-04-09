import { useContext } from "react"
import { AppContext } from "../App"
import KPICard from "../components/KPICard"
import ChartCard from "../components/ChartCard"
import { revenueData, getDataByPeriod, formatCurrency } from "../data/mockData"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"

const COLORS = ["#2563eb", "#22c55e", "#f59e0b"]

function Revenue() {
  const { timePeriod, userRole } = useContext(AppContext)
  const data = getDataByPeriod(revenueData, timePeriod)

  // KPIs for this domain
  const kpis = [
    {
      title: "Revenue Target Attainment",
      value: data.attainment.toFixed(1),
      unit: "%",
      status: data.attainment >= 90 ? "success" : data.attainment >= 80 ? "warning" : "danger",
      benchmark: "Target: > 90%",
      trend: data.attainment >= 90 ? "up" : "down",
      trendValue: 3.2,
      formula: "Actual Revenue ÷ Target × 100",
    },
    {
      title: "RevPASH",
      value: data.revPASH.toFixed(2),
      unit: "$/seat-hr",
      status: data.revPASH >= 15 ? "success" : data.revPASH >= 12 ? "warning" : "danger",
      benchmark: "Benchmark: $15-25/seat-hr",
      trend: "up",
      trendValue: 5.1,
      formula: "Total Revenue ÷ (Seats × Operating Hours)",
      isAlert: data.revPASH < 12,
    },
    {
      title: "Average Check",
      value: data.avgCheck.toFixed(2),
      unit: "$",
      status: "success",
      benchmark: "Target: $28 dine-in",
      trend: "up",
      trendValue: 2.8,
      formula: "Total Revenue ÷ Total Covers",
    },
    {
      title: "Peak Hour Capture",
      value: data.peakHourCapture,
      unit: "%",
      status: data.peakHourCapture >= 35 ? "success" : "warning",
      benchmark: "Target: > 35% of daily",
      trend: data.peakHourCapture >= 35 ? "up" : "down",
      trendValue: 1.5,
      formula: "Peak 2hr Revenue ÷ Daily Revenue",
      isAlert: data.peakHourCapture < 35,
    },
  ]

  // Owner-only KPIs
  const ownerKpis = [
    {
      title: "Catering & Events Revenue",
      value: formatCurrency(data.cateringRevenue),
      status: "success",
      benchmark: "Growing monthly",
      trend: "up",
      trendValue: 12.5,
      formula: "Events Revenue ÷ Total Revenue × 100",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Revenue</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Track revenue performance and channel distribution
        </p>
      </div>

      {/* Main Revenue Card */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-xl p-6 text-white">
        <p className="text-blue-100 text-sm">
          {timePeriod === "today" ? "Today" : timePeriod === "week" ? "This Week" : "This Month"}&apos;s Revenue
        </p>
        <div className="flex items-end gap-4 mt-2">
          <p className="text-4xl font-bold">{formatCurrency(data.dailyRevenue)}</p>
          <p className="text-blue-200 mb-1">
            of {formatCurrency(data.dailyTarget)} target ({data.attainment.toFixed(1)}%)
          </p>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-blue-900/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${Math.min(data.attainment, 100)}%` }}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Owner KPIs */}
      {userRole === "owner" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ownerKpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Revenue Trend */}
        <ChartCard title="Daily Revenue vs Target" subtitle="Last 7 days">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData.dailyTrend}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                />
                <Tooltip
                  formatter={(value) => [`$${value.toLocaleString()}`, ""]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Target" />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Channel Mix */}
        <ChartCard title="Revenue by Channel" subtitle="Sales distribution">
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={revenueData.channelMix}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {revenueData.channelMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, entry) => [
                    `${value}% (${formatCurrency(entry.payload.amount)})`,
                    entry.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4">
              {revenueData.channelMix.map((channel, index) => (
                <div key={channel.name} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{channel.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {channel.value}% - {formatCurrency(channel.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* RevPASH Heatmap */}
      <ChartCard
        title="RevPASH by Time of Day"
        subtitle="Revenue per available seat-hour throughout the day"
      >
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData.hourlyRevPASH}>
              <XAxis dataKey="hour" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                formatter={(value) => [`$${value}/seat-hr`, "RevPASH"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <defs>
                <linearGradient id="revpashGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                fill="url(#revpashGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Peak indicators */}
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600 dark:text-gray-400">Peak: 7-9 PM ($26-28)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600 dark:text-gray-400">Lunch: 12-2 PM ($22-24)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600 dark:text-gray-400">Low: 3-5 PM ($5-8)</span>
          </div>
        </div>
      </ChartCard>
    </div>
  )
}

export default Revenue

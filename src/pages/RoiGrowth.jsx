import { useContext } from "react"
import { AppContext } from "../App"
import KPICard from "../components/KPICard"
import ChartCard from "../components/ChartCard"
import { roiData, getDataByPeriod, formatCurrency } from "../data/mockData"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"

function RoiGrowth() {
  const { timePeriod, userRole } = useContext(AppContext)
  const data = getDataByPeriod(roiData, timePeriod)

  // KPIs
  const kpis = [
    {
      title: "Prime Cost %",
      value: data.primeCost.toFixed(1),
      unit: "%",
      status: data.primeCost < 60 ? "success" : data.primeCost < 65 ? "warning" : "danger",
      benchmark: "Target: < 60% (55% ideal)",
      trend: data.primeCost < 60 ? "down" : "up",
      trendValue: 1.5,
      formula: "(Labour + COGS) ÷ Revenue × 100",
      isAlert: data.primeCost > 65,
    },
    {
      title: "Break-Even Covers",
      value: data.breakEvenCovers,
      unit: "",
      status: "success",
      benchmark: "Daily team target",
      trend: "flat",
      trendValue: 0,
      formula: "Fixed Daily Costs ÷ Avg Contribution Margin",
    },
    {
      title: timePeriod === "today" ? "Covers Today" : timePeriod === "week" ? "Covers This Week" : "Covers This Month",
      value: data.coversToday || data.coversWeek || data.coversMonth,
      unit: "",
      status: (data.coversToday || data.coversWeek || data.coversMonth) > data.breakEvenCovers ? "success" : "danger",
      benchmark: `Break-even: ${data.breakEvenCovers}`,
      trend: "up",
      trendValue: 8,
    },
  ]

  // Owner KPIs
  const ownerKpis = [
    {
      title: "EBITDA Margin",
      value: data.ebitdaMargin || "12.5",
      unit: "%",
      status: (data.ebitdaMargin || 12.5) >= 10 ? "success" : "warning",
      benchmark: "Target: 10-15%",
      trend: "up",
      trendValue: 2.3,
      formula: "(Rev − COGS − Labour − OpEx) ÷ Rev × 100",
    },
    {
      title: "Cash Flow Runway",
      value: data.cashFlowRunway || "52",
      unit: "days",
      status: (data.cashFlowRunway || 52) >= 45 ? "success" : (data.cashFlowRunway || 52) >= 21 ? "warning" : "danger",
      benchmark: "Target: > 45 days healthy",
      trend: "up",
      trendValue: 5,
      formula: "Cash Balance ÷ Avg Daily Outflow",
      isAlert: (data.cashFlowRunway || 52) < 21,
    },
    {
      title: "Loyalty ROI",
      value: data.loyaltyROI || "185",
      unit: "%",
      status: (data.loyaltyROI || 185) > 100 ? "success" : "warning",
      benchmark: "Members spend 18-25% more",
      trend: "up",
      trendValue: 12,
      formula: "(Incremental Rev − Programme Cost) ÷ Cost",
    },
    {
      title: "Delivery Net Margin",
      value: data.deliveryNetMargin || "11.2",
      unit: "%",
      status: (data.deliveryNetMargin || 11.2) >= 12 ? "success" : (data.deliveryNetMargin || 11.2) >= 8 ? "warning" : "danger",
      benchmark: "Target: > 12% net margin",
      trend: "up",
      trendValue: 0.8,
      formula: "Delivery Rev × Commission % = Net Delivery Rev",
      isAlert: (data.deliveryNetMargin || 11.2) < 8,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ROI & Growth</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Track profitability, break-even, and growth metrics</p>
      </div>

      {/* Prime Cost Gauge */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Prime Cost (Labour + COGS)</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">The most critical profitability indicator</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${data.primeCost < 60 ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : data.primeCost < 65 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>  {data.primeCost < 60 ? "Healthy" : data.primeCost < 65 ? "Watch" : "Critical"}</span>
        </div>
        <div className="flex items-end gap-4">
          <p className="text-5xl font-bold text-gray-900 dark:text-white">{data.primeCost.toFixed(1)}%</p>
          <div className="flex-1">
            {/* Progress bar with zones */}
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
              {/* Green zone: 0-55% */}
              <div className="absolute left-0 top-0 h-full w-[55%] bg-green-200 dark:bg-green-900/50" />
              {/* Yellow zone: 55-60% */}
              <div className="absolute left-[55%] top-0 h-full w-[5%] bg-amber-200 dark:bg-amber-900/50" />
              {/* Red zone: 60-100% */}
              <div className="absolute left-[60%] top-0 h-full w-[40%] bg-red-200 dark:bg-red-900/50" />
              {/* Current value indicator */}
              <div className="absolute top-0 h-full w-1 bg-gray-900 dark:bg-white" style={{ left: `${Math.min(data.primeCost, 100)}%` }} /> </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>0%</span>
              <span>55% (Ideal)</span>
              <span>60% (Max)</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Labour Cost</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">31.8%</p>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400">Food Cost (COGS)</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">27.0%</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {userRole === "owner" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {ownerKpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Prime Cost Trend */}
        <ChartCard title="Prime Cost Trend" subtitle="6-month trend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={roiData.primeCostTrend}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[50, 70]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value) => [`${value}%`, "Prime Cost"]} contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", }} />
                {/* Target lines */}
                <Line type="monotone" dataKey={() => 60} stroke="#ef4444" strokeDasharray="5 5" dot={false} name="Max" />
                <Line type="monotone" dataKey={() => 55} stroke="#22c55e" strokeDasharray="5 5" dot={false} name="Target" />
                <Line type="monotone" dataKey="cost" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", r: 5 }} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* EBITDA Trend (Owner only) */}
        {userRole === "owner" && (
          <ChartCard title="EBITDA Margin Trend" subtitle="6-month profitability">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={roiData.ebitdaTrend}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[5, 20]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(value) => [`${value}%`, "EBITDA"]} contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", }} />
                  {/* Target */}
                  <Line type="monotone" dataKey={() => 10} stroke="#22c55e" strokeDasharray="5 5" dot={false} name="Min Target" />
                  <Line type="monotone" dataKey="margin" stroke="#22c55e" strokeWidth={3} dot={{ fill: "#22c55e", r: 5 }} name="EBITDA" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        )}

        {userRole !== "owner" && (
          <ChartCard title="Break-Even Progress" subtitle="Covers vs break-even target">
            <div className="h-72 flex flex-col items-center justify-center">
              <div className="relative w-48 h-48">
                {/* Background circle */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#e5e7eb" strokeWidth="16" />
                  <circle cx="96" cy="96" r="80" fill="none" stroke="#22c55e" strokeWidth="16" strokeDasharray={`${((data.coversToday || data.coversWeek || data.coversMonth) / data.breakEvenCovers) * 502} 502`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {Math.round(((data.coversToday || data.coversWeek || data.coversMonth) / data.breakEvenCovers) * 100)}%
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">of target</p>
                </div>
              </div>
              <div className="flex items-center gap-6 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {data.coversToday || data.coversWeek || data.coversMonth}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Covers Served</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.breakEvenCovers}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Break-Even</p>
                </div>
              </div>
            </div>
          </ChartCard>
        )}
      </div>

      {/* Marketing ROI */}
      {userRole === "owner" && (
        <ChartCard title="Marketing ROI by Channel" subtitle="Return on marketing spend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roiData.marketingROI} layout="vertical">
                <XAxis type="number" axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="channel" axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={(value, name) => [ name === "roi" ? `${value}%` : formatCurrency(value), name === "roi" ? "ROI" : name === "spend" ? "Spend" : "Revenue", ]}
                  contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", }} />
                <Bar dataKey="roi" fill="#22c55e" radius={[0, 4, 4, 0]} name="ROI" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-medium text-gray-500 dark:text-gray-400">Channel</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-500 dark:text-gray-400">Spend</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                  <th className="text-right py-2 px-3 font-medium text-gray-500 dark:text-gray-400">ROI</th>
                </tr>
              </thead>
              <tbody>
                {roiData.marketingROI.map((channel) => (
                  <tr key={channel.channel} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 px-3 font-medium text-gray-900 dark:text-white">{channel.channel}</td>
                    <td className="py-2 px-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(channel.spend)}</td>
                    <td className="py-2 px-3 text-right text-gray-600 dark:text-gray-400">{formatCurrency(channel.revenue)}</td>
                    <td className="py-2 px-3 text-right font-medium text-green-600">{channel.roi}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(168000)}</p>
          <p className="text-xs text-green-500 mt-1">93.3% of target</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Gross Profit</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(69000)}</p>
          <p className="text-xs text-gray-500 mt-1">41.1% margin</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Net Profit</p>
          <p className="text-2xl font-bold text-green-500 mt-1">{formatCurrency(21000)}</p>
          <p className="text-xs text-green-500 mt-1">12.5% EBITDA</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Cash Position</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(45000)}</p>
          <p className="text-xs text-green-500 mt-1">52 days runway</p>
        </div>
      </div>
    </div>
  )
}

export default RoiGrowth

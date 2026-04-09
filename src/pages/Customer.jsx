import { useContext } from "react"
import { AppContext } from "../App"
import KPICard from "../components/KPICard"
import ChartCard from "../components/ChartCard"
import { customerData, getDataByPeriod, formatCurrency } from "../data/mockData"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Star } from "lucide-react"

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#6366f1"]

function Customer() {
  const { timePeriod, userRole } = useContext(AppContext)
  const data = getDataByPeriod(customerData, timePeriod)

  // KPIs
  const kpis = [
    {
      title: "Net Promoter Score",
      value: data.nps,
      unit: "",
      status: data.nps >= 70 ? "success" : data.nps >= 50 ? "warning" : "danger",
      benchmark: "> 50 good, > 70 excellent",
      trend: "up",
      trendValue: 4,
      formula: "% Promoters (9-10) − % Detractors (0-6)",
    },
    {
      title: "Online Review Score",
      value: data.reviewScore.toFixed(1),
      unit: "/5",
      status: data.reviewScore >= 4.4 ? "success" : data.reviewScore >= 4.0 ? "warning" : "danger",
      benchmark: "Target: 4.4+ across platforms",
      trend: "up",
      trendValue: 0.1,
      formula: "Avg rating + review frequency",
      isAlert: data.reviewScore < 4.0,
    },
    {
      title: "Complaint Resolution",
      value: data.complaintResolutionTime,
      unit: "min",
      status: data.complaintResolutionTime <= 15 ? "success" : "warning",
      benchmark: "Target: < 15 min in-house",
      trend: data.complaintResolutionTime <= 15 ? "down" : "up",
      trendValue: 2,
      formula: "Complaint raised → Resolved (avg)",
      isAlert: data.complaintResolutionTime > 20,
    },
    {
      title: "Reservation No-Show",
      value: data.reservationNoShow.toFixed(1),
      unit: "%",
      status: data.reservationNoShow < 8 ? "success" : "warning",
      benchmark: "Target: < 8%",
      trend: data.reservationNoShow < 8 ? "down" : "up",
      trendValue: 0.5,
      formula: "No-Show Reservations ÷ Total × 100",
    },
  ]

  // Owner/strategic KPIs
  const ownerKpis = [
    {
      title: "Guest Return Rate",
      value: data.guestReturnRate || "44",
      unit: "%",
      status: (data.guestReturnRate || 44) >= 40 ? "success" : "warning",
      benchmark: "Target: > 40% monthly",
      trend: "up",
      trendValue: 3,
      formula: "Returning Customers ÷ Total Unique × 100",
    },
    {
      title: "Customer Lifetime Value",
      value: formatCurrency(data.clv || 385),
      status: "success",
      benchmark: "Informs acquisition spend cap",
      trend: "up",
      trendValue: 8,
      formula: "Avg Spend × Visits/Yr × Avg Years",
    },
  ]

  // Render stars for rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : i < rating ? "text-amber-400 fill-amber-200" : "text-gray-300" }`} />
    ))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Intelligence</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">  Monitor customer satisfaction and loyalty metrics</p>
      </div>

      {/* NPS Score Display */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Net Promoter Score</p>
            <p className="text-5xl font-bold mt-2">{data.nps}</p>
            <p className="text-green-200 mt-2">  {data.nps >= 70 ? "Excellent" : data.nps >= 50 ? "Good" : "Needs Improvement"}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-200">Promoters (9-10):</span>
              <span className="font-bold">68%</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-200">Passives (7-8):</span>
              <span className="font-bold">24%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-200">Detractors (0-6):</span>
              <span className="font-bold">8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {userRole === "owner" && (
        <div className="grid grid-cols-2 gap-4">
          {ownerKpis.map((kpi, index) => (
            <KPICard key={index} {...kpi} />
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* NPS Trend */}
        <ChartCard title="NPS Trend" subtitle="6-month trend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerData.npsTrend}>
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[40, 80]} />
                <Tooltip  formatter={(value) => [value, "NPS"]}  contentStyle={{backgroundColor: "white",border: "1px solid #e5e7eb",borderRadius: "8px",}}/>
                {/* Reference lines */}
                <Line type="monotone" dataKey={() => 70} stroke="#22c55e" strokeDasharray="5 5" dot={false} name="Excellent" />
                <Line  type="monotone"  dataKey={() => 50}  stroke="#f59e0b"  strokeDasharray="5 5"  dot={false}  name="Good" />
                <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", r: 5 }} name="NPS" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* CLV Segments */}
        {userRole === "owner" && (
          <ChartCard title="Customer Segments by CLV" subtitle="Lifetime value distribution">
            <div className="h-72 flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={customerData.clvSegments} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="customers" >
                    {customerData.clvSegments.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, entry) => [   `${value} customers`,   entry.payload.segment, ]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {customerData.clvSegments.map((segment, index) => (
                  <div key={segment.segment} className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: COLORS[index] }} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{segment.segment}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {segment.customers} customers | Avg: {formatCurrency(segment.avgSpend)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        )}

        {userRole !== "owner" && (
          <ChartCard title="Review Platforms" subtitle="Ratings across platforms">
            <div className="space-y-4">
              {customerData.reviewSources.map((source) => (
                <div key={source.platform} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{source.platform}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{source.reviews} reviews</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">{renderStars(source.rating)}</div>
                    <span className="font-bold text-gray-900 dark:text-white">{source.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        )}
      </div>

      {/* Review Platforms (for owner) */}
      {userRole === "owner" && (
        <ChartCard title="Review Platforms" subtitle="Ratings and review counts">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {customerData.reviewSources.map((source) => (
              <div key={source.platform} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center">
                <p className="font-medium text-gray-900 dark:text-white mb-2">{source.platform}</p>
                <div className="flex justify-center mb-2">{renderStars(source.rating)}</div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{source.rating}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{source.reviews} reviews</p>
              </div>
            ))}
          </div>
        </ChartCard>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers (Month)</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">1,070</p>
          <p className="text-xs text-green-500 mt-1">+12% vs last month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">New Customers</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">125</p>
          <p className="text-xs text-gray-500 mt-1">12% of total</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Returning Customers</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">471</p>
          <p className="text-xs text-green-500 mt-1">44% return rate</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">VIP Customers</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">45</p>
          <p className="text-xs text-gray-500 mt-1">Avg spend: $680</p>
        </div>
      </div>
    </div>
  )
}

export default Customer;
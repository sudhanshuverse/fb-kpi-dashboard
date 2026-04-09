import { useContext } from "react"
import { AppContext } from "../App"
import KPICard from "../components/KPICard"
import ChartCard from "../components/ChartCard"
import { operationsData, getDataByPeriod } from "../data/mockData"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"

function Operations() {
  const { timePeriod, userRole } = useContext(AppContext)
  const data = getDataByPeriod(operationsData, timePeriod)

  // KPIs
  const kpis = [
    {
      title: "Table Turnover Rate",
      value: data.tableTurnover.toFixed(1),
      unit: "x",
      status: data.tableTurnover >= 3 ? "success" : data.tableTurnover >= 2.5 ? "warning" : "danger",
      benchmark: "Target: 3-5x (fast casual)",
      trend: "up",
      trendValue: 4.2,
      formula: "Covers ÷ Number of Seats",
    },
    {
      title: "Avg Table Dwell Time",
      value: data.avgDwellTime,
      unit: "min",
      status: data.avgDwellTime <= 55 ? "success" : "warning",
      benchmark: "Varies by format",
      trend: data.avgDwellTime <= 55 ? "down" : "up",
      trendValue: 3.5,
      formula: "Total Seated Minutes ÷ Covers",
      isAlert: data.avgDwellTime > 60,
    },
    {
      title: "Kitchen Ticket Time",
      value: data.kitchenTicketTime.toFixed(1),
      unit: "min",
      status: data.kitchenTicketTime < 12 ? "success" : data.kitchenTicketTime < 18 ? "warning" : "danger",
      benchmark: "Target: < 12 min casual",
      trend: data.kitchenTicketTime < 12 ? "down" : "up",
      trendValue: 2.1,
      formula: "Order placed → Food on pass (avg)",
      isAlert: data.kitchenTicketTime > 18,
    },
    {
      title: "Order to Delivery Time",
      value: data.orderToDelivery,
      unit: "min",
      status: data.orderToDelivery < 35 ? "success" : data.orderToDelivery < 40 ? "warning" : "danger",
      benchmark: "Target: < 35 minutes",
      trend: data.orderToDelivery < 35 ? "down" : "up",
      trendValue: 5.8,
      formula: "Order confirmed → Delivered (avg)",
      isAlert: data.orderToDelivery > 40,
    },
    {
      title: "Seat Utilization",
      value: data.seatUtilization,
      unit: "%",
      status: data.seatUtilization >= 70 ? "success" : data.seatUtilization >= 60 ? "warning" : "danger",
      benchmark: "Target: > 70% during service",
      trend: "up",
      trendValue: 2.3,
      formula: "Occupied Seat Hrs ÷ Available Seat Hrs",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Operations</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">  Monitor kitchen and floor operations efficiency</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Kitchen Ticket Time Trend */}
        <ChartCard title="Kitchen Ticket Time Trend" subtitle="7-day average in minutes">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={operationsData.ticketTimeTrend.map((val, i) => ({ day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i], time: val, }))} >
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 20]} />
                <Tooltip
                  formatter={(value) => [`${value} min`, "KTT"]}
                  contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", }} />
                {/* Reference line for target */}
                <Line type="monotone" dataKey={() => 12} stroke="#22c55e" strokeDasharray="5 5" dot={false} name="Target" />
                <Line type="monotone" dataKey="time" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb", r: 4 }} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-primary" />
              <span className="text-gray-600 dark:text-gray-400">Actual KTT</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-green-500 border-dashed" style={{ borderTop: "2px dashed #22c55e" }} />
              <span className="text-gray-600 dark:text-gray-400">Target (12 min)</span>
            </div>
          </div>
        </ChartCard>

        {/* Seat Utilization by Hour */}
        <ChartCard title="Seat Utilization by Hour" subtitle="Percentage of seats occupied">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={operationsData.seatUtilizationByHour}>
                <XAxis dataKey="hour" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", }} />
                <defs>
                  <linearGradient id="utilizationGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={2} fill="url(#utilizationGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Dead Slot Identification */}
      {userRole === "owner" && (
        <ChartCard title="Dead Slot Analysis" subtitle="Revenue by time slot for promo scheduling" >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={operationsData.deadSlotHeatmap}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", }} />
                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                  {operationsData.deadSlotHeatmap.map((entry, index) => (
                    <Bar key={`bar-${index}`} fill={entry.revenue < 400 ? "#ef4444" : entry.revenue < 500 ? "#f59e0b" : "#22c55e"}/>))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Insight:</strong> Monday-Thursday 3-5 PM shows consistently low revenue. 
              Consider implementing a happy hour promotion or early bird dinner special.
            </p>
          </div>
        </ChartCard>
      )}

      {/* Quick Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Tables Occupied</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">14/18</p>
          <p className="text-xs text-green-500 mt-1">78% occupancy</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Orders in Kitchen</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">8</p>
          <p className="text-xs text-gray-500 mt-1">Avg wait: 9 min</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Deliveries</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">5</p>
          <p className="text-xs text-amber-500 mt-1">1 delayed</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Reservations Today</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">24</p>
          <p className="text-xs text-gray-500 mt-1">6 PM peak: 12</p>
        </div>
      </div>
    </div>
  )
}

export default Operations

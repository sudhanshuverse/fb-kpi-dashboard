import { useContext } from "react"
import { Link } from "react-router-dom"
import { AppContext } from "../App"
import KPICard from "../components/KPICard"
import ChartCard from "../components/ChartCard"
import AlertCard from "../components/AlertCard"
import {
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  ChefHat,
  Package,
  ArrowRight,
} from "lucide-react"
import {
  revenueData,
  operationsData,
  staffData,
  inventoryData,
  roiData,
  smartAlerts,
  getDataByPeriod,
  formatCurrency,
} from "../data/mockData"
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
} from "recharts"

// Colors for pie chart
const COLORS = ["#2563eb", "#22c55e", "#f59e0b"]

function Dashboard() {
  const { timePeriod, userRole, alerts, setAlerts } = useContext(AppContext)

  // Get data for current time period
  const revenue = getDataByPeriod(revenueData, timePeriod)
  const operations = getDataByPeriod(operationsData, timePeriod)
  const staff = getDataByPeriod(staffData, timePeriod)
  const inventory = getDataByPeriod(inventoryData, timePeriod)
  const roi = getDataByPeriod(roiData, timePeriod)

  // Get active alerts (not acknowledged)
  const activeAlerts = [...smartAlerts, ...alerts]
    .filter((a) => !a.acknowledged)
    .slice(0, 3)

  // Handle acknowledge
  const handleAcknowledge = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    )
  }

  // Quick stats for command center
  const quickStats = [
    {
      label: "Revenue Today",
      value: formatCurrency(revenue.dailyRevenue),
      target: formatCurrency(revenue.dailyTarget || 0),
      attainment: revenue.attainment,
      icon: DollarSign,
      link: "/revenue",
    },
    {
      label: "Kitchen Ticket Time",
      value: `${operations.kitchenTicketTime} min`,
      benchmark: "< 12 min",
      status: operations.kitchenTicketTime < 12 ? "success" : operations.kitchenTicketTime < 15 ? "warning" : "danger",
      icon: ChefHat,
      link: "/operations",
    },
    {
      label: "Labour Cost %",
      value: `${staff.labourCostPercent}%`,
      benchmark: "28-35%",
      status: staff.labourCostPercent < 35 ? "success" : staff.labourCostPercent < 38 ? "warning" : "danger",
      icon: Users,
      link: "/staff",
    },
    {
      label: "Food Cost %",
      value: `${inventory.foodCostPercent}%`,
      benchmark: "28-35%",
      status: inventory.foodCostPercent < 35 ? "success" : inventory.foodCostPercent < 38 ? "warning" : "danger",
      icon: Package,
      link: "/inventory",
    },
  ]

  // Owner-specific stats
  const ownerStats = [
    {
      label: "Prime Cost %",
      value: `${roi.primeCost}%`,
      benchmark: "Target < 60%",
      status: roi.primeCost < 60 ? "success" : roi.primeCost < 65 ? "warning" : "danger",
      icon: TrendingUp,
      link: "/roi-growth",
    },
    {
      label: "Covers vs Break-Even",
      value: `${roi.coversToday || roi.coversWeek || roi.coversMonth}`,
      benchmark: `Break-even: ${roi.breakEvenCovers}`,
      status: (roi.coversToday || roi.coversWeek || roi.coversMonth) > roi.breakEvenCovers ? "success" : "danger",
      icon: Clock,
      link: "/roi-growth",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Command Centre</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          {userRole === "owner" ? "Strategic overview" : "Operational overview"} for{" "}
          {timePeriod === "today" ? "today" : timePeriod === "week" ? "this week" : "this month"}
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="w-5 h-5 text-primary" />
              <span className={`w-2 h-2 rounded-full ${ stat.status === "success"? "bg-green-500": stat.status === "warning"? "bg-amber-500": stat.attainment >= 90? "bg-green-500": stat.attainment >= 80? "bg-amber-500": "bg-red-500"}`}/>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {stat.target ? `Target: ${stat.target}` : stat.benchmark}
            </p>
          </Link>
        ))}
      </div>

      {/* Owner-only Stats */}
      {userRole === "owner" && (
        <div className="grid grid-cols-2 gap-4">
          {ownerStats.map((stat, index) => (
            <Link key={index} to={stat.link} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow" >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="w-5 h-5 text-primary" />
                <span  className={`px-2 py-0.5 text-xs font-medium rounded-full ${    stat.status === "success"? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400": stat.status === "warning"? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400": "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                  {stat.status === "success" ? "On Target" : stat.status === "warning" ? "Watch" : "Alert"}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{stat.benchmark}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue vs Target */}
        <ChartCard title="Daily Revenue vs Target" subtitle="Last 7 days performance" action={ <Link to="/revenue" className="text-sm text-primary hover:underline flex items-center gap-1">View Details <ArrowRight className="w-4 h-4" /></Link> }>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData.dailyTrend}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, ""]} contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", }} />
                <Bar dataKey="target" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Target" />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Channel Mix */}
        <ChartCard
          title="Revenue by Channel"
          subtitle="Distribution of sales channels"
          action={
            <Link to="/revenue" className="text-sm text-primary hover:underline flex items-center gap-1">  View Details <ArrowRight className="w-4 h-4" /></Link>
          }>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueData.channelMix} innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" >
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
            {/* Legend */}
            <div className="space-y-2">
              {revenueData.channelMix.map((channel, index) => (
                <div key={channel.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {channel.name}: {channel.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Alerts</h2>
            <Link to="/alerts" className="text-sm text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={handleAcknowledge} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Revenue", path: "/revenue", color: "bg-blue-500" },
          { label: "Operations", path: "/operations", color: "bg-green-500" },
          { label: "Orders & Menu", path: "/orders-menu", color: "bg-amber-500" },
          { label: "Staff", path: "/staff", color: "bg-purple-500" },
        ].map((link) => (
          <Link key={link.path} to={link.path} className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow" >
            <div className={`w-2 h-8 rounded-full ${link.color}`} />
            <span className="font-medium text-gray-900 dark:text-white">{link.label}</span>
            <ArrowRight className="w-4 h-4 ml-auto text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Dashboard;
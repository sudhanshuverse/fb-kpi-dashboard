import { useContext } from "react"
import { AppContext } from "../App"
import KPICard from "../components/KPICard"
import ChartCard from "../components/ChartCard"
import { staffData, getDataByPeriod, formatCurrency } from "../data/mockData"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, } from "recharts"

function Staff() {
  const { timePeriod, userRole } = useContext(AppContext)
  const data = getDataByPeriod(staffData, timePeriod)

  // KPIs
  const kpis = [
    {
      title: "Labour Cost %",
      value: data.labourCostPercent.toFixed(1),
      unit: "%",
      status: data.labourCostPercent <= 35 ? "success" : data.labourCostPercent <= 38 ? "warning" : "danger",
      benchmark: "Target: 28-35%",
      trend: data.labourCostPercent <= 35 ? "down" : "up",
      trendValue: 1.2,
      formula: "Labour Cost ÷ Revenue × 100",
      isAlert: data.labourCostPercent > 38,
    },
    {
      title: "Revenue Per Labour Hour",
      value: `$${data.revenuePerLabourHour}`,
      status: "success",
      benchmark: "Track trending",
      trend: "up",
      trendValue: 3.5,
      formula: "Total Revenue ÷ Total Staff Hours",
      isAlert: false,
    },
    {
      title: "Covers Per Server",
      value: data.coversPerServer,
      unit: "",
      status: data.coversPerServer >= 25 && data.coversPerServer <= 40 ? "success" : "warning",
      benchmark: "Target: 25-40 covers/server",
      trend: "up",
      trendValue: 2.1,
      formula: "Total Covers ÷ FOH Staff on Shift",
    },
    {
      title: "No-Show Rate",
      value: data.noShowRate?.toFixed(1) || "0",
      unit: "%",
      status: data.noShowRate < 3 ? "success" : "warning",
      benchmark: "Target: < 3%",
      trend: data.noShowRate < 3 ? "down" : "up",
      trendValue: 0.5,
      formula: "Unplanned Absences ÷ Scheduled Shifts × 100",
    },
  ]

  // Owner/strategic KPIs
  const ownerKpis = [
    {
      title: "Staff Turnover Rate",
      value: data.staffTurnover?.toFixed(1) || "2.5",
      unit: "%",
      status: data.staffTurnover < 30 ? "success" : "warning",
      benchmark: "Target: < 30%/year",
      trend: "down",
      trendValue: 5,
      formula: "(Staff Left ÷ Avg Headcount) × 100",
    },
    {
      title: "Training Hours/Month",
      value: data.trainingHours?.toFixed(1) || "5.2",
      unit: "hrs",
      status: data.trainingHours >= 4 ? "success" : "warning",
      benchmark: "Target: 4-8 hrs/month",
      trend: "up",
      trendValue: 8,
      formula: "Total Training Hrs ÷ Staff Count",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor labour costs and team performance</p>
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

      {/* Labour Cost Trend */}
      <ChartCard title="Labour Cost % Trend" subtitle="7-day trend">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={staffData.labourTrend}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} domain={[25, 40]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => [`${value}%`, "Labour Cost"]} contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", }} />
              {/* Target range */}
              <Line type="monotone" dataKey={() => 35} stroke="#f59e0b" strokeDasharray="5 5" dot={false} name="Upper Limit" />
              <Line type="monotone" dataKey="cost" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb", r: 4 }} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-primary" />
            <span className="text-gray-600 dark:text-gray-400">Actual Labour Cost %</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 border-t-2 border-dashed border-amber-500" />
            <span className="text-gray-600 dark:text-gray-400">35% Threshold</span>
          </div>
        </div>
      </ChartCard>

      {/* Staff Schedule */}
      <ChartCard title="Today&apos;s Staff Schedule" subtitle="Current shift assignments">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Shift</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {staffData.staffSchedule.map((staff) => (
                <tr key={staff.name} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{staff.name}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{staff.role}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{staff.shift}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${staff.status === "On Duty" ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"}`}> {staff.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Staff Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Staff</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">22</p>
          <p className="text-xs text-gray-500 mt-1">14 full-time, 8 part-time</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">On Shift Now</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">8</p>
          <p className="text-xs text-green-500 mt-1">All present</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Scheduled Today</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</p>
          <p className="text-xs text-gray-500 mt-1">Peak at 6 PM</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Labour Hours Today</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">96</p>
          <p className="text-xs text-gray-500 mt-1">Projected: $2,880</p>
        </div>
      </div>
    </div>
  )
}

export default Staff

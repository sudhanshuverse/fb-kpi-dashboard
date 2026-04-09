import { useContext } from "react"
import { AppContext } from "../App"
import KPICard from "../components/KPICard"
import ChartCard from "../components/ChartCard"
import { inventoryData, getDataByPeriod, formatCurrency } from "../data/mockData"
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

const COLORS = ["#ef4444", "#22c55e", "#f59e0b", "#3b82f6", "#6366f1"]

function Inventory() {
  const { timePeriod, userRole } = useContext(AppContext)
  const data = getDataByPeriod(inventoryData, timePeriod)

  // KPIs
  const kpis = [
    {
      title: "Food Cost %",
      value: data.foodCostPercent.toFixed(1),
      unit: "%",
      status: data.foodCostPercent <= 35 ? "success" : data.foodCostPercent <= 38 ? "warning" : "danger",
      benchmark: "Target: 28-35% food",
      trend: data.foodCostPercent <= 35 ? "down" : "up",
      trendValue: 0.8,
      formula: "COGS ÷ Food Revenue × 100",
      isAlert: data.foodCostPercent > 36,
    },
    {
      title: "Food Waste %",
      value: data.foodWastePercent.toFixed(1),
      unit: "%",
      status: data.foodWastePercent < 3 ? "success" : data.foodWastePercent < 5 ? "warning" : "danger",
      benchmark: "Target: < 3% of purchased",
      trend: data.foodWastePercent < 3 ? "down" : "up",
      trendValue: 0.3,
      formula: "Waste Value ÷ Total Purchased × 100",
      isAlert: data.foodWastePercent > 5,
    },
    {
      title: "Shrinkage Rate",
      value: data.shrinkageRate.toFixed(1),
      unit: "%",
      status: data.shrinkageRate < 1 ? "success" : data.shrinkageRate < 2 ? "warning" : "danger",
      benchmark: "Target: < 1%",
      trend: data.shrinkageRate < 1 ? "down" : "up",
      trendValue: 0.2,
      formula: "(Expected − Actual) ÷ Expected × 100",
      isAlert: data.shrinkageRate > 2,
    },
    {
      title: "Supplier On-Time",
      value: data.supplierOnTime || "96",
      unit: "%",
      status: (data.supplierOnTime || 96) >= 95 ? "success" : "warning",
      benchmark: "Target: > 95% on-time",
      trend: "up",
      trendValue: 1,
      formula: "On-Time Deliveries ÷ Total Orders × 100",
    },
  ]

  // Owner KPIs
  const ownerKpis = [
    {
      title: "Inventory Turnover",
      value: data.inventoryTurnover || "5.2",
      unit: "x/month",
      status: (data.inventoryTurnover || 5.2) >= 4 ? "success" : "warning",
      benchmark: "Target: 4-8x/month perishables",
      trend: "up",
      trendValue: 5,
      formula: "COGS ÷ Average Inventory Value",
    },
    {
      title: "Cost Per Portion Variance",
      value: data.costPerPortionVariance || "3.8",
      unit: "%",
      status: (data.costPerPortionVariance || 3.8) < 5 ? "success" : "warning",
      benchmark: "Target: < 5% variance",
      trend: "down",
      trendValue: 1.2,
      formula: "Actual plated cost vs recipe costed",
    },
  ]

  // Calculate total waste
  const totalWaste = inventoryData.wasteByCategory.reduce((sum, cat) => sum + cat.value, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory & Waste</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">  Track food costs, waste, and supplier performance</p>
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
        {/* Food Cost Trend */}
        <ChartCard title="Food Cost % Trend" subtitle="7-day trend">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={inventoryData.foodCostTrend}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} domain={[25, 40]} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(value) => [`${value}%`, "Food Cost"]} contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", }} />
                {/* Target range */}
                <Line type="monotone" dataKey={() => 35} stroke="#f59e0b" strokeDasharray="5 5" dot={false} name="Upper Limit" />
                <Line type="monotone" dataKey="cost" stroke="#2563eb" strokeWidth={2} dot={{ fill: "#2563eb", r: 4 }} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Waste by Category */}
        <ChartCard
          title="Food Waste by Category"
          subtitle={`Total: ${formatCurrency(totalWaste)} this week`}
        >
          <div className="h-72 flex items-center">
            <ResponsiveContainer width="50%" height="100%">
              <PieChart>
                <Pie data={inventoryData.wasteByCategory} innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" >
                  {inventoryData.wasteByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [formatCurrency(value), "Waste Value"]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3">
              {inventoryData.wasteByCategory.map((cat, index) => (
                <div key={cat.category} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{cat.category}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatCurrency(cat.value)} ({cat.percent}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Supplier Scorecard */}
      <ChartCard title="Supplier Scorecard" subtitle="On-time delivery and ratings">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Supplier</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">On-Time %</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.suppliers.map((supplier) => (
                <tr key={supplier.name} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{supplier.name}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`font-medium ${supplier.onTime >= 95 ? "text-green-600" : supplier.onTime >= 90 ? "text-amber-600" : "text-red-600"}`}>  {supplier.onTime}%</span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{supplier.rating}/5.0</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.onTime >= 95 ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" : supplier.onTime >= 90 ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>  {supplier.onTime >= 95 ? "Excellent" : supplier.onTime >= 90 ? "Good" : "Review"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Waste Alert Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
            <span className="text-xl">🍖</span>
          </div>
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-200">Proteins Show Highest Waste</h4>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">  35% of waste comes from proteins ({formatCurrency(420)} this week). Consider:</p>
            <ul className="text-sm text-amber-700 dark:text-amber-300 mt-2 list-disc list-inside">
              <li>Review portion sizes for protein-heavy dishes</li>
              <li>Implement daily specials to use near-expiry items</li>
              <li>Audit prep quantities during slow periods</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Weekly COGS</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{formatCurrency(14250)}</p>
          <p className="text-xs text-gray-500 mt-1">32.1% of revenue</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Weekly Waste Value</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{formatCurrency(totalWaste)}</p>
          <p className="text-xs text-red-500 mt-1">Above target</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active Suppliers</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">4</p>
          <p className="text-xs text-green-500 mt-1">All performing well</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Orders</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">3</p>
          <p className="text-xs text-gray-500 mt-1">Next delivery: Tomorrow</p>
        </div>
      </div>
    </div>
  )
}

export default Inventory;
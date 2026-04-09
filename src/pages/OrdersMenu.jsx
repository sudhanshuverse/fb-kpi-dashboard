import { useContext } from "react"
import { AppContext } from "../App"
import KPICard from "../components/KPICard"
import ChartCard from "../components/ChartCard"
import { ordersMenuData, getDataByPeriod, formatCurrency } from "../data/mockData"
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts"

// Colors for menu engineering quadrants
const QUADRANT_COLORS = {
  Stars: "#22c55e",      // Green - High Margin + High Popularity
  Plowhorses: "#f59e0b", // Amber - Low Margin + High Popularity  
  Puzzles: "#3b82f6",    // Blue - High Margin + Low Popularity
  Dogs: "#ef4444",       // Red - Low Margin + Low Popularity
}

function OrdersMenu() {
  const { timePeriod, userRole } = useContext(AppContext)
  const data = getDataByPeriod(ordersMenuData, timePeriod)

  // KPIs
  const kpis = [
    {
      title: "Order Error Rate",
      value: data.orderErrorRate.toFixed(1),
      unit: "%",
      status: data.orderErrorRate < 1 ? "success" : data.orderErrorRate < 2 ? "warning" : "danger",
      benchmark: "Target: < 1%",
      trend: data.orderErrorRate < 1 ? "down" : "up",
      trendValue: 0.3,
      formula: "Wrong Orders ÷ Total Orders × 100",
      isAlert: data.orderErrorRate > 2,
    },
    {
      title: "Cancellation Rate",
      value: data.cancellationRate.toFixed(1),
      unit: "%",
      status: data.cancellationRate < 3 ? "success" : data.cancellationRate < 5 ? "warning" : "danger",
      benchmark: "Target: < 3%",
      trend: data.cancellationRate < 3 ? "down" : "up",
      trendValue: 0.5,
      formula: "Cancelled ÷ Total Orders × 100",
      isAlert: data.cancellationRate > 5,
    },
    {
      title: "Upsell Conversion",
      value: data.upsellConversion,
      unit: "%",
      status: data.upsellConversion >= 35 ? "success" : "warning",
      benchmark: "Target: 35-50% (trained staff)",
      trend: "up",
      trendValue: 2.8,
      formula: "Orders with Upsell ÷ Total Orders × 100",
    },
    {
      title: "Beverage-to-Food Ratio",
      value: data.beverageToFoodRatio,
      unit: "%",
      status: data.beverageToFoodRatio >= 30 ? "success" : "warning",
      benchmark: "Target: 30-40% of total",
      trend: "flat",
      trendValue: 0,
      formula: "Beverage Rev ÷ Food Rev × 100",
    },
  ]

  // Owner KPI
  const ownerKpis = [
    {
      title: "Item 86 Frequency",
      value: data.item86Frequency,
      unit: "x",
      status: data.item86Frequency <= 2 ? "success" : "warning",
      benchmark: "Target: < 2x/week per item",
      trend: data.item86Frequency <= 2 ? "down" : "up",
      trendValue: 1,
      formula: "Times 86d ÷ Total Service Periods",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders & Menu</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1"> Analyze order performance and menu engineering</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Menu Engineering Quadrant */}
      <ChartCard
        title="Menu Engineering Quadrant"
        subtitle="Items plotted by profit margin vs popularity"
      >
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="popularity" name="Popularity" domain={[0, 100]} label={{ value: "Popularity →", position: "bottom", offset: 0 }} axisLine={false} tickLine={false}/>
              <YAxis type="number" dataKey="margin" name="Margin" domain={[0, 100]} label={{ value: "Margin % →", angle: -90, position: "left" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(value, name) => [   name === "margin" ? `${value}%` : value,   name === "margin" ? "Profit Margin" : "Popularity Score", ]} labelFormatter={(label) => ordersMenuData.menuItems.find((i) => i.popularity === label)?.name || ""} contentStyle={{   backgroundColor: "white",   border: "1px solid #e5e7eb",   borderRadius: "8px", }} />
              {/* Reference lines for quadrants */}
              <Scatter data={ordersMenuData.menuItems} fill="#8884d8">
                {ordersMenuData.menuItems.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={QUADRANT_COLORS[entry.category]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        {/* Quadrant Legend */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {Object.entries(QUADRANT_COLORS).map(([name, color]) => {
            const items = ordersMenuData.menuItems.filter((i) => i.category === name)
            return (
              <div key={name} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {name === "Stars" && "High Margin + High Pop."}
                    {name === "Plowhorses" && "Low Margin + High Pop."}
                    {name === "Puzzles" && "High Margin + Low Pop."}
                    {name === "Dogs" && "Low Margin + Low Pop."}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{items.length} items</p>
                </div>
              </div>
            )
          })}
        </div>
      </ChartCard>

      {/* Top & Bottom Items */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <ChartCard title="Top Selling Items" subtitle="By order count">
          <div className="space-y-3">
            {ordersMenuData.topItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg" >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.orders} orders</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">{formatCurrency(item.revenue)}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Bottom Selling Items */}
        <ChartCard title="Underperforming Items" subtitle="Consider for removal or promotion">
          <div className="space-y-3">
            {ordersMenuData.bottomItems.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg" >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {item.orders} orders
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(item.revenue)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Tip:</strong> Puzzles (high margin, low sales) can be promoted through staff recommendations or menu placement changes.
            </p>
          </div>
        </ChartCard>
      </div>

      {/* Menu Item Details Table */}
      <ChartCard title="Menu Engineering Details" subtitle="All items by category">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Item</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Category</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Margin %</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Popularity</th>
                <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody>
              {ordersMenuData.menuItems.map((item) => (
                <tr key={item.name} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: `${QUADRANT_COLORS[item.category]}20`, color: QUADRANT_COLORS[item.category], }} >   {item.category} </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{item.margin}%</td>
                  <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">{item.popularity}</td>
                  <td className="py-3 px-4 text-xs text-gray-500 dark:text-gray-400">
                    {item.category === "Stars" && "Maintain & feature"}
                    {item.category === "Plowhorses" && "Increase price or reduce cost"}
                    {item.category === "Puzzles" && "Promote more"}
                    {item.category === "Dogs" && "Consider removal"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}

export default OrdersMenu;

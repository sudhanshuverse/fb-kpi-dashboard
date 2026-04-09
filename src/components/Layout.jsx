import { Outlet, NavLink } from "react-router-dom"
import { useContext, useState } from "react"
import { AppContext } from "../App"
import {
  LayoutDashboard,
  DollarSign,
  Settings,
  ClipboardList,
  Users,
  Heart,
  Package,
  TrendingUp,
  Bell,
  Moon,
  Sun,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import { smartAlerts } from "../data/mockData"

// Navigation items for sidebar
const navItems = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/revenue", label: "Revenue", icon: DollarSign },
  { path: "/operations", label: "Operations", icon: Settings },
  { path: "/orders-menu", label: "Orders & Menu", icon: ClipboardList },
  { path: "/staff", label: "Staff", icon: Users },
  { path: "/customer", label: "Customer", icon: Heart },
  { path: "/inventory", label: "Inventory", icon: Package },
  { path: "/roi-growth", label: "ROI & Growth", icon: TrendingUp },
]

function Layout() {
  const { timePeriod, setTimePeriod, userRole, setUserRole, darkMode, setDarkMode, alerts } =
    useContext(AppContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Count active alerts
  const activeAlerts = [...smartAlerts, ...alerts].filter((a) => !a.acknowledged).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">F&B KPI Dashboard</h1>
          <NavLink to="/alerts" className="relative p-2">
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            {activeAlerts > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeAlerts}
              </span>
            )}
          </NavLink>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-primary">F&B KPI Dashboard</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">The Urban Kitchen</p>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}

          {/* Alerts Link */}
          <NavLink
            to="/alerts"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              <span className="font-medium">Smart Alerts</span>
            </div>
            {activeAlerts > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {activeAlerts}
              </span>
            )}
          </NavLink>
        </nav>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {/* Role Selector */}
          <div className="relative">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              View Mode
            </label>
            <div className="relative">
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="w-full appearance-none bg-gray-100 dark:bg-gray-700 border-0 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-primary"
              >
                <option value="manager">Manager View</option>
                <option value="owner">Owner View</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg"
          >
            <span className="text-sm text-gray-700 dark:text-gray-200">
              {darkMode ? "Dark Mode" : "Light Mode"}
            </span>
            {darkMode ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        {/* Top Bar */}
        <header className="hidden lg:flex sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 items-center justify-between">
          {/* Time Period Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Time Period:</span>
            {["today", "week", "month"].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timePeriod === period
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {period === "today" ? "Today" : period === "week" ? "This Week" : "This Month"}
              </button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            {/* Alert Button */}
            <NavLink
              to="/alerts"
              className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              {activeAlerts > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {activeAlerts}
                </span>
              )}
            </NavLink>
          </div>
        </header>

        {/* Mobile Time Period Selector */}
        <div className="lg:hidden sticky top-14 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center gap-2">
            {["today", "week", "month"].map((period) => (
              <button
                key={period}
                onClick={() => setTimePeriod(period)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timePeriod === period
                    ? "bg-primary text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                {period === "today" ? "Today" : period === "week" ? "Week" : "Month"}
              </button>
            ))}
          </div>
        </div>

        {/* Page Content */}
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout;
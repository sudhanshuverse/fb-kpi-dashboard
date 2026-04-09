import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useState, createContext } from "react"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Revenue from "./pages/Revenue"
import Operations from "./pages/Operations"
import OrdersMenu from "./pages/OrdersMenu"
import Staff from "./pages/Staff"
import Customer from "./pages/Customer"
import Inventory from "./pages/Inventory"
import RoiGrowth from "./pages/RoiGrowth"
import Alerts from "./pages/Alerts"

// Create context for global state
export const AppContext = createContext()

function App() {
  // Time period: "today" | "week" | "month"
  const [timePeriod, setTimePeriod] = useState("today")
  
  // Role: "manager" | "owner"
  const [userRole, setUserRole] = useState("manager")
  
  // Dark mode
  const [darkMode, setDarkMode] = useState(false)
  
  // Alerts state
  const [alerts, setAlerts] = useState([])

  // Context value
  const contextValue = {
    timePeriod,
    setTimePeriod,
    userRole,
    setUserRole,
    darkMode,
    setDarkMode,
    alerts,
    setAlerts,
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className={darkMode ? "dark" : ""}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="revenue" element={<Revenue />} />
              <Route path="operations" element={<Operations />} />
              <Route path="orders-menu" element={<OrdersMenu />} />
              <Route path="staff" element={<Staff />} />
              <Route path="customer" element={<Customer />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="roi-growth" element={<RoiGrowth />} />
              <Route path="alerts" element={<Alerts />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AppContext.Provider>
  )
}

export default App

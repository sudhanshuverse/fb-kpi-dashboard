// =====================================================
// MOCK DATA FOR F&B KPI DASHBOARD
// This file contains all dummy data for the dashboard
// =====================================================

// Business Profile
export const businessProfile = {
  name: "The Urban Kitchen",
  type: "Casual-dining restaurant with delivery",
  seats: 60,
  tables: 18,
  operatingHours: "11:00 AM - 11:00 PM",
  avgCheckDineIn: 28,
  avgCheckDelivery: 22,
  dailyCoverTarget: 170,
  monthlyRevenueTarget: 180000,
  staffCount: { fullTime: 14, partTime: 8 },
  menuItems: 42,
}

// Helper function to generate random number in range
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// Helper function to generate trend data (last 7 days)
const generateTrend = (baseValue, variance = 0.15) => {
  return Array.from({ length: 7 }, () => 
    Math.round(baseValue * (1 + (Math.random() - 0.5) * variance))
  )
}

// =====================================================
// REVENUE KPIs
// =====================================================
export const revenueData = {
  today: {
    dailyRevenue: 6250,
    dailyTarget: 6500,
    attainment: 96.2,
    revPASH: 17.4,
    avgCheck: 27.5,
    peakHourCapture: 38,
    cateringRevenue: 850,
  },
  week: {
    dailyRevenue: 42500,
    dailyTarget: 45500,
    attainment: 93.4,
    revPASH: 16.8,
    avgCheck: 26.8,
    peakHourCapture: 36,
    cateringRevenue: 4200,
  },
  month: {
    dailyRevenue: 168000,
    dailyTarget: 180000,
    attainment: 93.3,
    revPASH: 17.1,
    avgCheck: 27.2,
    peakHourCapture: 37,
    cateringRevenue: 18500,
  },
  channelMix: [
    { name: "Dine-In", value: 58, amount: 3625 },
    { name: "Delivery", value: 28, amount: 1750 },
    { name: "Takeaway", value: 14, amount: 875 },
  ],
  dailyTrend: [
    { day: "Mon", revenue: 4800, target: 5500 },
    { day: "Tue", revenue: 5200, target: 5500 },
    { day: "Wed", revenue: 5600, target: 6000 },
    { day: "Thu", revenue: 6100, target: 6000 },
    { day: "Fri", revenue: 7800, target: 7500 },
    { day: "Sat", revenue: 8200, target: 8000 },
    { day: "Sun", revenue: 6800, target: 7000 },
  ],
  hourlyRevPASH: [
    { hour: "11AM", value: 8 },
    { hour: "12PM", value: 22 },
    { hour: "1PM", value: 24 },
    { hour: "2PM", value: 15 },
    { hour: "3PM", value: 6 },
    { hour: "4PM", value: 5 },
    { hour: "5PM", value: 8 },
    { hour: "6PM", value: 18 },
    { hour: "7PM", value: 26 },
    { hour: "8PM", value: 28 },
    { hour: "9PM", value: 20 },
    { hour: "10PM", value: 12 },
  ],
}

// =====================================================
// OPERATIONS KPIs
// =====================================================
export const operationsData = {
  today: {
    tableTurnover: 3.2,
    avgDwellTime: 52,
    kitchenTicketTime: 11.5,
    orderToDelivery: 32,
    seatUtilization: 74,
  },
  week: {
    tableTurnover: 3.4,
    avgDwellTime: 48,
    kitchenTicketTime: 12.2,
    orderToDelivery: 34,
    seatUtilization: 71,
  },
  month: {
    tableTurnover: 3.3,
    avgDwellTime: 50,
    kitchenTicketTime: 11.8,
    orderToDelivery: 33,
    seatUtilization: 72,
  },
  ticketTimeTrend: generateTrend(12, 0.2),
  seatUtilizationByHour: [
    { hour: "11AM", value: 45 },
    { hour: "12PM", value: 85 },
    { hour: "1PM", value: 92 },
    { hour: "2PM", value: 65 },
    { hour: "3PM", value: 30 },
    { hour: "4PM", value: 25 },
    { hour: "5PM", value: 40 },
    { hour: "6PM", value: 75 },
    { hour: "7PM", value: 95 },
    { hour: "8PM", value: 98 },
    { hour: "9PM", value: 80 },
    { hour: "10PM", value: 55 },
  ],
  deadSlotHeatmap: [
    { day: "Mon", slot: "3-5PM", revenue: 320 },
    { day: "Tue", slot: "3-5PM", revenue: 280 },
    { day: "Wed", slot: "3-5PM", revenue: 350 },
    { day: "Thu", slot: "3-5PM", revenue: 310 },
    { day: "Fri", slot: "3-5PM", revenue: 480 },
    { day: "Sat", slot: "3-5PM", revenue: 620 },
    { day: "Sun", slot: "3-5PM", revenue: 550 },
  ],
}

// =====================================================
// ORDERS & MENU KPIs
// =====================================================
export const ordersMenuData = {
  today: {
    orderErrorRate: 1.2,
    cancellationRate: 2.1,
    upsellConversion: 42,
    item86Frequency: 1,
    beverageToFoodRatio: 34,
  },
  week: {
    orderErrorRate: 1.4,
    cancellationRate: 2.4,
    upsellConversion: 40,
    item86Frequency: 3,
    beverageToFoodRatio: 33,
  },
  month: {
    orderErrorRate: 1.3,
    cancellationRate: 2.2,
    upsellConversion: 41,
    item86Frequency: 8,
    beverageToFoodRatio: 34,
  },
  // Menu Engineering Quadrant Data
  // Stars: High Margin + High Popularity
  // Plowhorses: Low Margin + High Popularity  
  // Puzzles: High Margin + Low Popularity
  // Dogs: Low Margin + Low Popularity
  menuItems: [
    { name: "Truffle Pasta", margin: 68, popularity: 85, category: "Stars" },
    { name: "Wagyu Burger", margin: 72, popularity: 78, category: "Stars" },
    { name: "Grilled Salmon", margin: 65, popularity: 72, category: "Stars" },
    { name: "Caesar Salad", margin: 75, popularity: 68, category: "Stars" },
    { name: "Margherita Pizza", margin: 35, popularity: 92, category: "Plowhorses" },
    { name: "Fish & Chips", margin: 32, popularity: 85, category: "Plowhorses" },
    { name: "Club Sandwich", margin: 38, popularity: 78, category: "Plowhorses" },
    { name: "Chicken Wings", margin: 40, popularity: 88, category: "Plowhorses" },
    { name: "Lobster Risotto", margin: 78, popularity: 25, category: "Puzzles" },
    { name: "Duck Confit", margin: 70, popularity: 32, category: "Puzzles" },
    { name: "Beef Tartare", margin: 72, popularity: 22, category: "Puzzles" },
    { name: "Soup of Day", margin: 28, popularity: 35, category: "Dogs" },
    { name: "Garden Salad", margin: 30, popularity: 28, category: "Dogs" },
    { name: "Breadsticks", margin: 25, popularity: 42, category: "Dogs" },
  ],
  topItems: [
    { name: "Margherita Pizza", orders: 145, revenue: 2175 },
    { name: "Truffle Pasta", orders: 128, revenue: 3584 },
    { name: "Chicken Wings", orders: 112, revenue: 1568 },
    { name: "Wagyu Burger", orders: 98, revenue: 2940 },
    { name: "Fish & Chips", orders: 95, revenue: 1710 },
  ],
  bottomItems: [
    { name: "Beef Tartare", orders: 8, revenue: 280 },
    { name: "Garden Salad", orders: 12, revenue: 144 },
    { name: "Lobster Risotto", orders: 15, revenue: 675 },
    { name: "Duck Confit", orders: 18, revenue: 612 },
    { name: "Breadsticks", orders: 22, revenue: 110 },
  ],
}

// =====================================================
// STAFF KPIs
// =====================================================
export const staffData = {
  today: {
    labourCostPercent: 31.5,
    revenuePerLabourHour: 85,
    coversPerServer: 32,
    noShowRate: 0,
  },
  week: {
    labourCostPercent: 32.2,
    revenuePerLabourHour: 82,
    coversPerServer: 30,
    noShowRate: 2.1,
    staffTurnover: 0,
  },
  month: {
    labourCostPercent: 31.8,
    revenuePerLabourHour: 84,
    coversPerServer: 31,
    noShowRate: 1.8,
    staffTurnover: 2.5,
    trainingHours: 5.2,
  },
  labourTrend: [
    { day: "Mon", cost: 33.2 },
    { day: "Tue", cost: 32.5 },
    { day: "Wed", cost: 31.8 },
    { day: "Thu", cost: 30.5 },
    { day: "Fri", cost: 29.8 },
    { day: "Sat", cost: 28.5 },
    { day: "Sun", cost: 31.2 },
  ],
  staffSchedule: [
    { name: "John M.", role: "Chef", shift: "11AM-7PM", status: "On Duty" },
    { name: "Sarah L.", role: "Server", shift: "11AM-5PM", status: "On Duty" },
    { name: "Mike R.", role: "Server", shift: "5PM-11PM", status: "Scheduled" },
    { name: "Emma W.", role: "Bartender", shift: "4PM-11PM", status: "Scheduled" },
    { name: "David K.", role: "Line Cook", shift: "11AM-7PM", status: "On Duty" },
  ],
}

// =====================================================
// CUSTOMER KPIs
// =====================================================
export const customerData = {
  today: {
    nps: 62,
    reviewScore: 4.5,
    complaintResolutionTime: 12,
    reservationNoShow: 6.5,
  },
  week: {
    nps: 58,
    reviewScore: 4.4,
    complaintResolutionTime: 14,
    reservationNoShow: 7.2,
    guestReturnRate: 42,
  },
  month: {
    nps: 60,
    reviewScore: 4.5,
    complaintResolutionTime: 13,
    reservationNoShow: 6.8,
    guestReturnRate: 44,
    clv: 385,
  },
  npsTrend: [
    { month: "Jan", score: 52 },
    { month: "Feb", score: 55 },
    { month: "Mar", score: 58 },
    { month: "Apr", score: 60 },
    { month: "May", score: 58 },
    { month: "Jun", score: 62 },
  ],
  reviewSources: [
    { platform: "Google", rating: 4.6, reviews: 342 },
    { platform: "Yelp", rating: 4.3, reviews: 156 },
    { platform: "TripAdvisor", rating: 4.5, reviews: 89 },
    { platform: "Facebook", rating: 4.4, reviews: 67 },
  ],
  clvSegments: [
    { segment: "VIP", customers: 45, avgSpend: 680 },
    { segment: "Regular", customers: 320, avgSpend: 385 },
    { segment: "Occasional", customers: 580, avgSpend: 142 },
    { segment: "New", customers: 125, avgSpend: 65 },
  ],
}

// =====================================================
// INVENTORY KPIs
// =====================================================
export const inventoryData = {
  today: {
    foodCostPercent: 31.2,
    foodWastePercent: 2.8,
    shrinkageRate: 0.6,
  },
  week: {
    foodCostPercent: 32.1,
    foodWastePercent: 3.1,
    shrinkageRate: 0.8,
    supplierOnTime: 94,
  },
  month: {
    foodCostPercent: 31.5,
    foodWastePercent: 2.9,
    shrinkageRate: 0.7,
    supplierOnTime: 96,
    inventoryTurnover: 5.2,
    costPerPortionVariance: 3.8,
  },
  wasteByCategory: [
    { category: "Proteins", value: 420, percent: 35 },
    { category: "Produce", value: 310, percent: 26 },
    { category: "Dairy", value: 185, percent: 15 },
    { category: "Prepared", value: 165, percent: 14 },
    { category: "Other", value: 120, percent: 10 },
  ],
  foodCostTrend: [
    { day: "Mon", cost: 32.5 },
    { day: "Tue", cost: 31.8 },
    { day: "Wed", cost: 30.9 },
    { day: "Thu", cost: 31.2 },
    { day: "Fri", cost: 30.5 },
    { day: "Sat", cost: 29.8 },
    { day: "Sun", cost: 31.5 },
  ],
  suppliers: [
    { name: "Fresh Farms Co", onTime: 98, rating: 4.8 },
    { name: "Metro Meats", onTime: 94, rating: 4.5 },
    { name: "Ocean Catch", onTime: 92, rating: 4.6 },
    { name: "Dairy Direct", onTime: 96, rating: 4.7 },
  ],
}

// =====================================================
// ROI & GROWTH KPIs
// =====================================================
export const roiData = {
  today: {
    primeCost: 58.5,
    breakEvenCovers: 95,
    coversToday: 142,
  },
  week: {
    primeCost: 59.2,
    breakEvenCovers: 665,
    coversWeek: 1050,
    cashFlowRunway: 52,
  },
  month: {
    primeCost: 58.8,
    ebitdaMargin: 12.5,
    breakEvenCovers: 2850,
    coversMonth: 4200,
    cashFlowRunway: 52,
    loyaltyROI: 185,
    deliveryNetMargin: 11.2,
  },
  marketingROI: [
    { channel: "Instagram", spend: 800, revenue: 3200, roi: 300 },
    { channel: "Google Ads", spend: 1200, revenue: 4100, roi: 242 },
    { channel: "Facebook", spend: 600, revenue: 1800, roi: 200 },
    { channel: "Email", spend: 150, revenue: 950, roi: 533 },
  ],
  primeCostTrend: [
    { month: "Jan", cost: 61.2 },
    { month: "Feb", cost: 60.5 },
    { month: "Mar", cost: 59.8 },
    { month: "Apr", cost: 59.2 },
    { month: "May", cost: 58.5 },
    { month: "Jun", cost: 58.8 },
  ],
  ebitdaTrend: [
    { month: "Jan", margin: 9.5 },
    { month: "Feb", margin: 10.2 },
    { month: "Mar", margin: 11.0 },
    { month: "Apr", margin: 11.8 },
    { month: "May", margin: 12.2 },
    { month: "Jun", margin: 12.5 },
  ],
}

// =====================================================
// SMART ALERTS
// =====================================================
export const smartAlerts = [
  {
    id: 1,
    type: "critical",
    domain: "Operations",
    title: "Delivery Time Spike",
    message: "Average delivery time exceeded 40 minutes",
    value: "43 min",
    threshold: "40 min",
    action: "Consider pausing new delivery orders for 15 minutes",
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: 2,
    type: "warning",
    domain: "Inventory",
    title: "Food Waste Alert",
    message: "Daily waste value exceeded threshold",
    value: "$185",
    threshold: "$150",
    action: "Review prep quantities for dinner service",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: 3,
    type: "warning",
    domain: "Orders",
    title: "Order Error Rate High",
    message: "Error rate above 2% in current shift",
    value: "2.4%",
    threshold: "2%",
    action: "Check kitchen display system and verify orders",
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(),
    acknowledged: true,
  },
  {
    id: 4,
    type: "info",
    domain: "Revenue",
    title: "RevPASH Below Average",
    message: "Revenue per seat-hour dropped 15% vs last Monday",
    value: "$12.50",
    threshold: "$14.70",
    action: "Consider running a lunch special promotion",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: 5,
    type: "critical",
    domain: "Customer",
    title: "Negative Review Alert",
    message: "New 1-star review on Google",
    value: "1 star",
    threshold: "< 3 stars",
    action: "Respond to review and investigate complaint",
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    acknowledged: false,
  },
  {
    id: 6,
    type: "warning",
    domain: "Staff",
    title: "Labour Cost Spike",
    message: "Labour cost exceeding 35% of revenue",
    value: "36.2%",
    threshold: "35%",
    action: "Review scheduling for slow periods",
    timestamp: new Date(Date.now() - 240 * 60000).toISOString(),
    acknowledged: true,
  },
]

// Demo alerts that can be triggered
export const demoAlerts = [
  {
    id: 101,
    type: "critical",
    domain: "Operations",
    title: "Kitchen Ticket Time Critical",
    message: "Average KTT exceeded 22 minutes",
    value: "24 min",
    threshold: "22 min",
    action: "Alert kitchen manager, consider limiting new orders",
    timestamp: new Date().toISOString(),
    acknowledged: false,
  },
  {
    id: 102,
    type: "critical",
    domain: "Orders",
    title: "Cancellation Rate Spike",
    message: "Order cancellation above 5% in last 2 hours",
    value: "6.2%",
    threshold: "5%",
    action: "Check for menu items unavailable, verify delivery ETA accuracy",
    timestamp: new Date().toISOString(),
    acknowledged: false,
  },
  {
    id: 103,
    type: "warning",
    domain: "Inventory",
    title: "Shrinkage Alert",
    message: "Weekly variance above 2% on proteins",
    value: "2.8%",
    threshold: "2%",
    action: "Conduct inventory audit on high-value items",
    timestamp: new Date().toISOString(),
    acknowledged: false,
  },
]

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Get data based on time period
export const getDataByPeriod = (dataObject, period) => {
  switch (period) {
    case "today":
      return dataObject.today
    case "week":
      return dataObject.week
    case "month":
      return dataObject.month
    default:
      return dataObject.today
  }
}

// Format currency
export const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

// Format percentage
export const formatPercent = (value) => {
  return `${value.toFixed(1)}%`
}

// Get status color based on value and benchmark
export const getStatusColor = (value, benchmark, isLowerBetter = false) => {
  const ratio = value / benchmark
  if (isLowerBetter) {
    if (ratio <= 1) return "success"
    if (ratio <= 1.1) return "warning"
    return "danger"
  } else {
    if (ratio >= 1) return "success"
    if (ratio >= 0.9) return "warning"
    return "danger"
  }
}

// Get trend direction
export const getTrend = (current, previous) => {
  if (current > previous) return "up"
  if (current < previous) return "down"
  return "flat"
}

// Generates mock OHLC data for candlestick charts
function generateOHLC(count: number, basePrice: number) {
  let currPrice = basePrice;
  const data = [];
  const now = new Date();
  
  for (let i = count; i > 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    const open = currPrice;
    const change = (Math.random() - 0.48) * currPrice * 0.05; // Gentle upward bias
    const close = open + change;
    
    // Low goes slightly below the min of open/close
    const min = Math.min(open, close);
    const low = min - (Math.random() * currPrice * 0.02);
    
    // High goes slightly above the max of open/close
    const max = Math.max(open, close);
    const high = max + (Math.random() * currPrice * 0.02);
    
    // ECharts Candlestick series format: [date, open, close, lowest, highest]
    data.push([
      date.toISOString().split('T')[0],
      open.toFixed(2),
      close.toFixed(2),
      low.toFixed(2),
      high.toFixed(2)
    ]);
    
    currPrice = close;
  }
  return data;
}

export const relianceOHLC = generateOHLC(90, 2450);

export function generateBenchmarkData(count: number, baseReturn: number) {
  const data = [];
  const now = new Date();
  let currentValue = 100;
  
  for (let i = count; i > 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    currentValue = currentValue * (1 + (Math.random() - 0.49) * 0.015);
    data.push([
      date.toISOString().split('T')[0],
      currentValue.toFixed(2)
    ]);
  }
  return data;
}

export const portfolioReturns = generateBenchmarkData(90, 100);
export const niftyReturns = generateBenchmarkData(90, 100);

export const watchlist = [
  { id: 1, symbol: "RELIANCE", name: "Reliance Industries", price: 2954.20, change: 1.2, value: 54000, trend: "up" },
  { id: 2, symbol: "HDFCBANK", name: "HDFC Bank", price: 1642.10, change: -0.5, value: 42500, trend: "down" },
  { id: 3, symbol: "TCS", name: "Tata Consultancy Syst.", price: 3840.40, change: 2.1, value: 75000, trend: "up" },
  { id: 4, symbol: "INFY", name: "Infosys", price: 1420.75, change: -1.2, value: 28000, trend: "down" },
  { id: 5, symbol: "ITC", name: "ITC Ltd", price: 412.30, change: 0.8, value: 31000, trend: "up" },
];

export const portfolioStats = {
  totalValue: 230500,
  dayChange: 4250,
  dayChangePct: 1.84,
  unrealizedGain: 45000,
  unrealizedGainPct: 19.5,
  benchmarkNifty: 1.2
};

// Generates heatmap data for expenses [date, magnitude]
function generateHeatmap(days: number) {
  const data = [];
  const now = new Date();
  
  for (let i = days; i > 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Magnitude: 0 = none, 1 = low, 2 = medium, 3 = high, 4 = very high
    // Weekends have higher chance of high spending
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    let magnitude = Math.floor(Math.random() * 3);
    if (isWeekend) magnitude += Math.floor(Math.random() * 3);
    magnitude = Math.min(4, magnitude);
    
    data.push([dateStr, magnitude]);
  }
  return data;
}

export const expensesHeatmap = generateHeatmap(180);

export const expensesCategoryDrilldown = [
  { name: "Food & Dining", spent: 28500, budget: 30000, color: "var(--chart-1)" },
  { name: "Transport", spent: 12000, budget: 15000, color: "var(--chart-2)" },
  { name: "Shopping", spent: 18400, budget: 10000, color: "var(--chart-3)" }, // Over budget
  { name: "Utilities", spent: 8000, budget: 9000, color: "var(--chart-4)" },
  { name: "Entertainment", spent: 15000, budget: 12000, color: "var(--chart-5)" }, // Over budget
];

// SIP Growth logic
function generateSIPGrowth(months: number, monthlySip: number, annualizedReturn: number) {
  const data = [];
  let invested = 0;
  let value = 0;
  const now = new Date();
  const monthlyReturn = Math.pow(1 + annualizedReturn/100, 1/12) - 1;
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  for (let i = months; i > 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const monthStr = `${labels[date.getMonth()]} '${date.getFullYear().toString().slice(-2)}`;
    
    invested += monthlySip;
    value = (value + monthlySip) * (1 + monthlyReturn + ((Math.random()-0.5)*0.02)); // Adding some variance
    
    data.push([monthStr, invested, parseFloat(value.toFixed(2))]);
  }
  return data;
}

// 5 years SIP of 20k per month at ~14% XIRR
export const sipGrowthData = generateSIPGrowth(60, 20000, 14);

export const mfHoldings = [
  { fund: "Parag Parikh Flexi Cap", category: "Equity", invested: 450000, current: 620400, xirr: 18.4, sip: 10000 },
  { fund: "UTI Nifty 50 Index", category: "Index", invested: 300000, current: 384500, xirr: 13.2, sip: 5000 },
  { fund: "Quant Small Cap", category: "Equity", invested: 150000, current: 245000, xirr: 28.5, sip: 5000 }
];

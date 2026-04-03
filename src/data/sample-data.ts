import { BankAccount, Transaction, StockHolding, MutualFund } from "@/types/finance";

export const SAMPLE_ACCOUNTS: Omit<BankAccount, 'id'>[] = [
  { name: "HDFC Savings",      type: "Savings", balance: 145200 },
  { name: "ICICI Salary",      type: "Savings", balance: 85400  },
  { name: "SBI Savings",       type: "Savings", balance: 22100  },
  { name: "Amazon Pay ICICI",  type: "Credit",  balance: -32450 },
  { name: "HDFC Millennia CC", type: "Credit",  balance: -12800 },
];

export const SAMPLE_STOCKS: Omit<StockHolding, 'id'>[] = [
  { symbol: "RELIANCE",    name: "Reliance Industries Ltd",            quantity: 15,  avgBuyPrice: 2450.50, currentPrice: 2980.25 },
  { symbol: "TCS",         name: "Tata Consultancy Services",          quantity: 8,   avgBuyPrice: 3200.00, currentPrice: 4120.50 },
  { symbol: "HDFCBANK",    name: "HDFC Bank Ltd",                      quantity: 45,  avgBuyPrice: 1520.75, currentPrice: 1445.60 },
  { symbol: "INFY",        name: "Infosys Ltd",                        quantity: 20,  avgBuyPrice: 1350.00, currentPrice: 1620.00 },
  { symbol: "TATASTEEL",   name: "Tata Steel Ltd",                     quantity: 150, avgBuyPrice: 110.50,  currentPrice: 145.30 },
  { symbol: "ZOMATO",      name: "Zomato Ltd",                         quantity: 500, avgBuyPrice: 95.00,   currentPrice: 184.20 },
  { symbol: "ICICIBANK",   name: "ICICI Bank Ltd",                     quantity: 30,  avgBuyPrice: 850.00,  currentPrice: 1120.45 },
  { symbol: "WIPRO",       name: "Wipro Ltd",                          quantity: 60,  avgBuyPrice: 420.00,  currentPrice: 465.80 },
];

export const SAMPLE_MUTUAL_FUNDS: Omit<MutualFund, 'id'>[] = [
  { fund: "Parag Parikh Flexi Cap Fund – Direct Growth",    category: "Equity", invested: 150000, current: 185000, sipAmount: 10000, xirr: 24.5 },
  { fund: "Mirae Asset Emerging Bluechip – Direct Growth",  category: "Equity", invested: 80000,  current: 112000, sipAmount: 5000,  xirr: 18.2 },
  { fund: "ICICI Prudential Nifty 50 Index – Direct Growth",category: "Index",  invested: 50000,  current: 58000,  sipAmount: 5000,  xirr: 12.4 },
  { fund: "SBI Small Cap Fund – Direct Growth",             category: "Equity", invested: 30000,  current: 42000,  sipAmount: 2000,  xirr: 28.1 },
  { fund: "Quant Tax Plan – Direct Growth (ELSS)",          category: "ELSS",   invested: 75000,  current: 98000,  sipAmount: 0,     xirr: 22.8 },
  { fund: "HDFC Mid-Cap Opportunities – Direct Growth",     category: "Equity", invested: 40000,  current: 52000,  sipAmount: 3000,  xirr: 16.5 },
];

export const SAMPLE_TRANSACTIONS = (accountIds: string[]): Omit<Transaction, 'id'>[] => {
  const hdfcId = accountIds[0] || 'acc_1';
  const iciciId = accountIds[1] || 'acc_2';
  const ccId = accountIds[3] || 'acc_4';

  const today = new Date();
  const getPastDate = (days: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() - days);
    return d.toISOString();
  };

  return [
    { date: getPastDate(0), merchant: "Zomato", category: "Food & Dining", amount: -650, accountId: hdfcId, accountName: "HDFC Savings" },
    { date: getPastDate(1), merchant: "Amazon India", category: "Shopping", amount: -2450, accountId: ccId, accountName: "Amazon Pay ICICI" },
    { date: getPastDate(2), merchant: "BigBasket", category: "Food & Dining", amount: -1540, accountId: hdfcId, accountName: "HDFC Savings" },
    { date: getPastDate(3), merchant: "Salary Credit", category: "Income", amount: 125000, accountId: iciciId, accountName: "ICICI Salary" },
    { date: getPastDate(5), merchant: "Netflix Subscription", category: "Subscriptions", amount: -649, accountId: ccId, accountName: "Amazon Pay ICICI" },
    { date: getPastDate(7), merchant: "Zerodha SIP", category: "Investments", amount: -15000, accountId: hdfcId, accountName: "HDFC Savings" },
    { date: getPastDate(8), merchant: "Uber", category: "Transport", amount: -420, accountId: hdfcId, accountName: "HDFC Savings" },
    { date: getPastDate(10), merchant: "House Rent", category: "Other", amount: -25000, accountId: iciciId, accountName: "ICICI Salary" },
    { date: getPastDate(12), merchant: "Starbucks", category: "Food & Dining", amount: -350, accountId: ccId, accountName: "Amazon Pay ICICI" },
    { date: getPastDate(15), merchant: "LIC Premium", category: "Other", amount: -8500, accountId: hdfcId, accountName: "HDFC Savings" },
    { date: getPastDate(18), merchant: "Apollo Pharmacy", category: "Health", amount: -1200, accountId: hdfcId, accountName: "HDFC Savings" },
    { date: getPastDate(20), merchant: "Electricity Bill", category: "Utilities", amount: -3400, accountId: hdfcId, accountName: "HDFC Savings" },
  ];
};

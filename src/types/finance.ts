export interface BankAccount {
  id: string;
  name: string;
  type: 'Savings' | 'Checking' | 'Salary' | 'Credit' | 'Wallet';
  balance: number;
}

export interface Transaction {
  id: string;
  date: string; // ISO date string
  merchant: string;
  category: string;
  amount: number; // negative = expense, positive = income
  accountId: string;
  accountName: string; // denormalized for display
}

export interface StockHolding {
  id: string;
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
}

export interface MutualFund {
  id: string;
  fund: string;
  category: 'Equity' | 'Debt' | 'Hybrid' | 'Index' | 'ELSS';
  invested: number;
  current: number;
  sipAmount: number;
  xirr: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string; // ISO date
  category?: string;
  color: string;
}

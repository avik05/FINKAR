import { Transaction, StockHolding, MutualFund } from "@/types/finance";

export const getBurnRate = (transactions: Transaction[], days = 90) => {
  const now = new Date();
  const threshold = new Date();
  threshold.setDate(now.getDate() - days);

  const relevantTx = transactions.filter(t => new Date(t.date) >= threshold && t.amount < 0);
  const totalSpend = Math.abs(relevantTx.reduce((sum, t) => sum + t.amount, 0));
  
  return {
    daily: totalSpend / days,
    monthly: (totalSpend / days) * 30
  };
};

export const getRunway = (liquidCash: number, monthlyBurn: number) => {
  if (monthlyBurn <= 0) return Infinity;
  return liquidCash / monthlyBurn;
};

export const calculateSavingsRate = (income: number, expenses: number) => {
  if (income <= 0) return 0;
  return ((income - Math.abs(expenses)) / income) * 100;
};

export const getSpendingByCategory = (transactions: Transaction[]) => {
  const categories: Record<string, number> = {};
  
  transactions.filter(t => t.amount < 0).forEach(t => {
    categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
  });

  return Object.entries(categories)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

export const getPortfolioPerformance = (stocks: StockHolding[], funds: MutualFund[]) => {
  const stockInvested = stocks.reduce((sum, s) => sum + s.avgBuyPrice * s.quantity, 0);
  const stockValue = stocks.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0);
  
  const mfInvested = funds.reduce((sum, f) => sum + f.invested, 0);
  const mfValue = funds.reduce((sum, f) => sum + f.current, 0);

  const totalInvested = stockInvested + mfInvested;
  const totalValue = stockValue + mfValue;
  const totalGain = totalValue - totalInvested;

  return {
    totalInvested,
    totalValue,
    totalGain,
    gainPct: totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0
  };
};

export const getForecast = (currentNetWorth: number, monthlySavings: number, annualReturn = 12) => {
  const milestones = [1000000, 5000000, 10000000]; // 10L, 50L, 1Cr
  const results = milestones.map(target => {
    if (currentNetWorth >= target) return { target, months: 0 };
    
    // Simplified FV compound interest formula: target = PV(1+r)^n + PMT[((1+r)^n - 1)/r]
    // Here we'll use a simpler monthly iterative approach for accuracy in short terms
    let months = 0;
    let balance = currentNetWorth;
    const monthlyRate = annualReturn / 100 / 12;

    while (balance < target && months < 600) { // Max 50 years
      balance = balance * (1 + monthlyRate) + monthlySavings;
      months++;
    }
    
    return { target, months };
  });

  return results;
};

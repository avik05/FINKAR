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
    
    let months = 0;
    let balance = currentNetWorth;
    const monthlyRate = annualReturn / 100 / 12;

    while (balance < target && months < 600) {
      balance = balance * (1 + monthlyRate) + monthlySavings;
      months++;
    }
    
    return { target, months };
  });

  return results;
};

/**
 * Robust mathematical engine for Portfolio Analytics
 * Logic: Value(n-1) = Value(n) - NetInvestment(n)
 */
export const getHistoricalPortfolioData = (
  transactions: Transaction[],
  currentTotalValue: number,
  months = 6
) => {
  const result = new Array(months);
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  let runningValue = currentTotalValue;

  const niftyReturns = [1.2, -0.8, 2.5, 1.1, -0.5, 3.2]; 

  for (let i = 0; i < months; i++) {
    const targetMonth = currentMonth - i;
    const targetDate = new Date(currentYear, targetMonth, 1);
    const monthName = targetDate.toLocaleString('default', { month: 'short' });
    
    const targetM = targetDate.getMonth();
    const targetY = targetDate.getFullYear();

    const netInvestment = transactions.reduce((sum, t) => {
      const d = new Date(t.date);
      if (d.getMonth() === targetM && d.getFullYear() === targetY) {
        const isInvestment = t.category.toLowerCase().includes('stock') || 
                             t.category.toLowerCase().includes('mutual') ||
                             t.category.toLowerCase().includes('investment');
        if (isInvestment) return sum + Math.abs(t.amount);
      }
      return sum;
    }, 0);

    result[months - 1 - i] = {
      month: monthName,
      value: Math.max(0, runningValue),
      benchmark: 0
    };

    runningValue -= netInvestment;
  }

  let benchmarkValue = result[0].value;
  for (let idx = 0; idx < result.length; idx++) {
    result[idx].benchmark = benchmarkValue;
    benchmarkValue = benchmarkValue * (1 + (niftyReturns[idx % niftyReturns.length] / 100));
  }

  return result;
};

export const getAssetMix = (stocks: StockHolding[], funds: MutualFund[], cash: number) => {
  const stockVal = stocks.reduce((s, st) => s + (st.currentPrice * st.quantity), 0);
  const fundVal = funds.reduce((s, f) => s + f.current, 0);
  const total = stockVal + fundVal + cash;

  if (total === 0) return [];

  return [
    { name: 'Equities', value: stockVal, fill: '#3ABEFF' },
    { name: 'Mutual Funds', value: fundVal, fill: '#00FF9C' },
    { name: 'Liquid Cash', value: cash, fill: '#A78BFA' }
  ].filter(a => a.value > 0);
};

export const getConcentrationRisk = (stocks: StockHolding[], funds: MutualFund[]) => {
  const total = stocks.reduce((s, st) => s + (st.currentPrice * st.quantity), 0) + 
                funds.reduce((s, f) => s + f.current, 0);
  
  if (total === 0) return null;

  const topHoldings = [
    ...stocks.map(s => ({ name: s.symbol, val: s.currentPrice * s.quantity })),
    ...funds.map(f => ({ name: f.fund, val: f.current }))
  ].sort((a, b) => b.val - a.val);

  const highest = topHoldings[0];
  const pct = (highest.val / total) * 100;

  return {
    name: highest.name,
    percentage: pct,
    isHigh: pct > 25
  };
};

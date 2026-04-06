import { formatINR } from "@/lib/format";
import { BankAccount, Transaction, StockHolding, MutualFund, Goal } from "@/types/finance";

export interface FinancialSnapshot {
  liquidCash: number; // Savings/Checking only
  totalCash: number; // Matches Dashboard "Cash in Banks" (includes Debt)
  debt: number; // Credit Card balances (typically negative)
  invested: number;
  stockValue: number;
  mfValue: number;
  netWorth: number;
  monthlyIncome: number;
  monthlyExpense: number;
  savingsRate: number;
  topCategory: [string, number] | null;
  bestPerformer: { symbol: string; gainPct: number } | null;
  accountCount: number;
  transactionCount: number;
  stockCount: number;
  mfCount: number;
  goalCount: number;
  goalsProgressed: Array<{ name: string; pct: number }>;
}

export type AIResponse = {
  text: string;
  suggestions?: string[];
  type?: 'data' | 'insight' | 'advice';
};

/**
 * Capture a complete snapshot of the user's financial state.
 */
export function getFinancialSnapshot(data: {
  accounts: BankAccount[];
  transactions: Transaction[];
  stocks: StockHolding[];
  funds: MutualFund[];
  goals: Goal[];
}): FinancialSnapshot {
  // 1. Total Cash matches Dashboard sum of all account balances
  const totalCash = data.accounts.reduce((s, a) => s + a.balance, 0);
  
  // 2. Breakdown for "Smart" insights
  const liquidCash = data.accounts
    .filter(a => a.type.toLowerCase() !== 'credit')
    .reduce((s, a) => s + a.balance, 0);
  
  const debt = data.accounts
    .filter(a => a.type.toLowerCase() === 'credit')
    .reduce((s, a) => s + a.balance, 0);

  const stockValue = data.stocks.reduce((s, st) => s + st.currentPrice * st.quantity, 0);
  const invested = stockValue + data.funds.reduce((s, f) => s + f.current, 0);
  const mfValue = data.funds.reduce((s, f) => s + f.current, 0);
  
  const netWorth = totalCash + invested;

  const now = new Date();
  const currentMonthTx = data.transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  
  const monthlyExpense = currentMonthTx.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const monthlyIncome = currentMonthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100 : 0;

  const categoryMap: Record<string, number> = {};
  data.transactions.filter(t => t.amount < 0).forEach(t => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount);
  });
  const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] as [string, number] | undefined;

  const bestPerformer = data.stocks.reduce<{ symbol: string; gainPct: number } | null>((best, s) => {
    const gainPct = ((s.currentPrice - s.avgBuyPrice) / (s.avgBuyPrice || 1)) * 100;
    if (!best || gainPct > best.gainPct) return { symbol: s.symbol, gainPct };
    return best;
  }, null);

  const goalsProgressed = data.goals.map(g => ({ name: g.name, pct: (g.currentAmount / g.targetAmount) * 100 }));

  return {
    liquidCash, totalCash, debt, invested, stockValue, mfValue, netWorth,
    monthlyIncome, monthlyExpense, savingsRate,
    topCategory: topCategory || null,
    bestPerformer,
    accountCount: data.accounts.length,
    transactionCount: data.transactions.length,
    stockCount: data.stocks.length,
    mfCount: data.funds.length,
    goalCount: data.goals.length,
    goalsProgressed
  };
}

/**
 * Process a user query given a financial snapshot.
 */
export function generateSmartResponse(query: string, snapshot: FinancialSnapshot, firstName: string): AIResponse {
  const q = query.toLowerCase().trim();

  // HELLO
  if (q.match(/\b(hi|hello|hey|good morning|sup)\b/)) {
    return {
      text: `Hello ${firstName}! I've analyzed your latest data. Your current net worth is **${formatINR(snapshot.netWorth)}**. How can I help you today?`,
      suggestions: ["What's my net worth?", "How are my stocks?", "Expenses this month?"]
    };
  }

  // NET WORTH
  if (q.match(/\bnet worth\b/)) {
    let response = `Your total net worth is **${formatINR(snapshot.netWorth)}**. \n\n- **Investments**: ${formatINR(snapshot.invested)}\n- **Cash in Banks**: ${formatINR(snapshot.liquidCash)}`;
    
    if (snapshot.debt < 0) {
      response += `\n- **Credit Debt**: ${formatINR(Math.abs(snapshot.debt))}`;
    }

    return {
      text: response,
      type: 'data',
      suggestions: ["How is my portfolio?", "Track expenses"]
    };
  }

  // PORTFOLIO / STOCKS
  if (q.match(/\b(stock|portfolio|portfolio|equity|invest)\b/)) {
    if (snapshot.stockCount === 0 && snapshot.mfCount === 0) {
      return { text: "You haven't added any investments yet! Go to the 'Stocks' or 'Mutual Funds' pages to get started." };
    }
    let response = `Your total investment portfolio is worth **${formatINR(snapshot.invested)}**. \n\n- **Stocks**: ${formatINR(snapshot.stockValue)} (${snapshot.stockCount} holdings)\n- **Mutual Funds**: ${formatINR(snapshot.mfValue)} (${snapshot.mfCount} funds)`;
    
    if (snapshot.bestPerformer) {
      response += `\n\nYour top-performing asset is **${snapshot.bestPerformer.symbol}** with a gain of **${snapshot.bestPerformer.gainPct.toFixed(1)}%**.`;
    }

    return {
      text: response,
      type: 'insight',
      suggestions: ["Best performing stock?", "My mutual funds?"]
    };
  }

  // EXPENSES / SPENDING
  if (q.match(/\b(spend|spent|expense|expenses)\b/)) {
    if (snapshot.monthlyExpense === 0) return { text: "You haven't recorded any expenses this month." };
    
    let response = `You've spent **${formatINR(snapshot.monthlyExpense)}** this month.`;
    if (snapshot.topCategory) {
      response += ` Your largest expense category is **${snapshot.topCategory[0]}** (${formatINR(snapshot.topCategory[1])}).`;
    }
    
    if (snapshot.savingsRate < 20) {
      response += `\n\n⚠️ **Advice**: Your savings rate is currently **${snapshot.savingsRate.toFixed(1)}%**, which is below the recommended 20-30%. Consider reviewing your ${snapshot.topCategory?.[0]} spending.`;
    } else {
      response += `\n\n✅ **Good job**: You're currently saving **${snapshot.savingsRate.toFixed(1)}%** of your income!`;
    }

    return {
      text: response,
      type: 'advice',
      suggestions: ["How to save more?", "Monthly income?"]
    };
  }

  // INCOME
  if (q.match(/\bincome\b/)) {
    return {
      text: `Your recorded income this month is **${formatINR(snapshot.monthlyIncome)}**. Your current surplus is **${formatINR(snapshot.monthlyIncome - snapshot.monthlyExpense)}**.`,
      type: 'data'
    };
  }

  // ADVICE / SMART ACTIONS
  if (q.match(/\b(advice|should i|smart|help)\b/)) {
    const idleCashInsight = snapshot.liquidCash > snapshot.monthlyExpense * 3
      ? "You have a healthy emergency fund. Consider moving some idle cash into mutual funds for long-term growth."
      : "You should build up your liquid cash until it covers at least 3 months of expenses.";
    
    return {
      text: `Based on your profile, here is my analysis:\n\n1. **Emergency Fund**: ${idleCashInsight}\n2. **Asset Mix**: You are ${snapshot.stockValue > snapshot.mfValue ? "stock-heavy" : "fund-heavy"}. Diversification looks ${snapshot.stockCount > 5 ? "good" : "a bit concentrated"}.\n3. **Savings**: Aim for a **30%** savings rate to reach your goals faster.`,
      type: 'advice',
      suggestions: ["How are my goals?", "Mutual fund returns?"]
    };
  }

  // SAVING
  if (q.match(/\bsav(e|ing)\b/)) {
    return {
        text: `Your current savings rate is **${snapshot.savingsRate.toFixed(1)}%**. To reach **30%**, you need to save an additional **${formatINR(Math.max(0, snapshot.monthlyIncome * 0.3 - (snapshot.monthlyIncome - snapshot.monthlyExpense)))}** per month.`,
        type: 'insight'
    };
  }

  return {
    text: "I'm not sure about that particular detail yet. I can give you an analysis of your **net worth**, **portfolio performance**, **savings rate**, or **monthly expenses**.",
    suggestions: ["Net worth?", "How are my stocks?", "Financial advice?"]
  };
}

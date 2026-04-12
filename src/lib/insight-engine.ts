import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { useGoalsStore } from "@/stores/goals-store";
import { formatINR } from "@/lib/format";

export type InsightSeverity = 'info' | 'warning' | 'positive';

export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: InsightSeverity;
  timestamp: string;
  actionable?: boolean;
  actionLabel?: string;
  actionHref?: string;
}

/**
 * Generate real insights from the user's actual data stores.
 * Called from React components — safe to use hooks at call-site
 * but this fn takes data as args to stay pure.
 */
export function generateInsightsFromData(data: {
  accountCount: number;
  totalCash: number;
  transactionCount: number;
  monthlyExpense: number;
  stockCount: number;
  stockValue: number;
  stockInvested: number;
  fundCount: number;
  fundValue: number;
  fundInvested: number;
  goalCount: number;
  goalsNearComplete: string[];
}): Insight[] {
  const insights: Insight[] = [];
  let id = 0;

  // Empty state nudges
  if (data.accountCount === 0) {
    insights.push({
      id: `ins_${id++}`,
      title: "Get Started",
      description: "Add your first bank account to start tracking your finances.",
      severity: "info",
      timestamp: "Now",
      actionable: true,
      actionLabel: "Add Account",
      actionHref: "/banks",
    });
  }

  if (data.accountCount > 0 && data.transactionCount === 0) {
    insights.push({
      id: `ins_${id++}`,
      title: "Log Your First Transaction",
      description: "Start recording expenses and income to get spending insights.",
      severity: "info",
      timestamp: "Now",
      actionable: true,
      actionLabel: "Add Transaction",
      actionHref: "/banks",
    });
  }

  // Spending insight
  if (data.monthlyExpense > 0) {
    insights.push({
      id: `ins_${id++}`,
      title: "Monthly Spending",
      description: `You've spent ${formatINR(data.monthlyExpense)} this month across ${data.transactionCount} transaction${data.transactionCount !== 1 ? "s" : ""}.`,
      severity: data.monthlyExpense > data.totalCash * 0.5 ? "warning" : "info",
      timestamp: "This month",
      actionable: true,
      actionLabel: "View Analysis",
      actionHref: "/analytics",
    });
  }

  // Stock performance
  if (data.stockCount > 0) {
    const stockReturn = data.stockInvested > 0
      ? ((data.stockValue - data.stockInvested) / data.stockInvested) * 100
      : 0;
    insights.push({
      id: `ins_${id++}`,
      title: stockReturn >= 0 ? "Portfolio Gain" : "Portfolio Loss",
      description: `Your stock portfolio is ${stockReturn >= 0 ? "up" : "down"} ${Math.abs(stockReturn).toFixed(1)}% (${formatINR(Math.abs(data.stockValue - data.stockInvested))}).`,
      severity: stockReturn >= 0 ? "positive" : "warning",
      timestamp: "Current",
      actionable: true,
      actionLabel: "View Stocks",
      actionHref: "/stocks",
    });
  }

  // Mutual fund performance
  if (data.fundCount > 0) {
    const fundReturn = data.fundInvested > 0
      ? ((data.fundValue - data.fundInvested) / data.fundInvested) * 100
      : 0;
    insights.push({
      id: `ins_${id++}`,
      title: fundReturn >= 0 ? "Funds Growing" : "Funds Underperforming",
      description: `Your mutual funds are ${fundReturn >= 0 ? "up" : "down"} ${Math.abs(fundReturn).toFixed(1)}% from invested value.`,
      severity: fundReturn >= 0 ? "positive" : "warning",
      timestamp: "Current",
      actionable: true,
      actionLabel: "View Funds",
      actionHref: "/mutual-funds",
    });
  }

  // Goal milestones
  data.goalsNearComplete.forEach((name) => {
    insights.push({
      id: `ins_${id++}`,
      title: "Goal Almost Complete!",
      description: `"${name}" is more than 75% funded. Keep going!`,
      severity: "positive",
      timestamp: "Milestone",
      actionable: true,
      actionLabel: "View Goals",
      actionHref: "/goals",
    });
  });

  // If no insights at all, show a welcome
  if (insights.length === 0) {
    insights.push({
      id: `ins_${id++}`,
      title: "Welcome to Finकर",
      description: "Start by adding bank accounts, stocks, or mutual funds to get personalised insights.",
      severity: "info",
      timestamp: "Now",
    });
  }

  return insights;
}

/** Legacy export for backwards compat — returns empty until stores are wired */
export function generateInsights(): Insight[] {
  return [{
    id: "ins_welcome",
    title: "Welcome to Finकर",
    description: "Add accounts and transactions to see personalised insights here.",
    severity: "info",
    timestamp: "Now",
  }];
}

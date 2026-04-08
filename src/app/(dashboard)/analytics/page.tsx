"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { 
  BarChart3, PieChart as PieIcon, TrendingUp, Compass, Target
} from "lucide-react";

import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { 
  getBurnRate, getRunway, calculateSavingsRate, 
  getSpendingByCategory, getPortfolioPerformance, getForecast 
} from "@/lib/analytics-utils";

// Dynamic imports for performance
const InsightsTab = dynamic(() => import("@/components/analytics/insights-tab").then(m => m.InsightsTab), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full animate-pulse bg-foreground/[0.03] rounded-3xl" />
});
const SpendingTab = dynamic(() => import("@/components/analytics/spending-tab").then(m => m.SpendingTab), { ssr: false });
const InvestmentsTab = dynamic(() => import("@/components/analytics/investments-tab").then(m => m.InvestmentsTab), { ssr: false });
const StrategyTab = dynamic(() => import("@/components/analytics/strategy-tab").then(m => m.StrategyTab), { ssr: false });
const ForecastTab = dynamic(() => import("@/components/analytics/forecast-tab").then(m => m.ForecastTab), { ssr: false });

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

type TabId = 'insights' | 'spending' | 'investments' | 'strategy' | 'forecast';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('insights');
  
  // Granular selectors to minimize re-renders
  const accounts = useAccountsStore((s) => s.accounts);
  const transactions = useTransactionsStore((s) => s.transactions);
  const stocks = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);

  // --- DATA CALCULATIONS ---
  const stats = useMemo(() => {
    const cash = accounts.reduce((s, a) => s + a.balance, 0);
    const burn = getBurnRate(transactions);
    const portfolio = getPortfolioPerformance(stocks, funds);
    const netWorth = cash + portfolio.totalValue;
    
    const now = new Date();
    const thisMonthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthlyIncome = thisMonthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const monthlyExpense = thisMonthTx.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

    const stocksValue = stocks.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0);
    const fundsValue = funds.reduce((sum, f) => sum + f.current, 0);

    return {
      netWorth,
      cash,
      burn,
      runway: getRunway(cash, burn.monthly),
      savingsRate: calculateSavingsRate(monthlyIncome, monthlyExpense),
      portfolio,
      stocksValue,
      fundsValue,
      spendingCategories: getSpendingByCategory(transactions),
      forecasts: getForecast(netWorth, monthlyIncome - monthlyExpense)
    };
  }, [accounts, transactions, stocks, funds]);

  const tabs = [
    { id: 'insights', label: 'Insights', icon: Compass },
    { id: 'spending', label: 'Spending', icon: PieIcon },
    { id: 'investments', label: 'Portfolio', icon: BarChart3 },
    { id: 'strategy', label: 'Strategy', icon: Target },
    { id: 'forecast', label: 'Future', icon: TrendingUp },
  ] as const;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-black bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Financial Intelligence
          </h1>
          <p className="text-muted-foreground mt-1 font-medium italic">Deep analysis of your wealth pulse.</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-foreground/[0.03] border border-border/50 rounded-2xl w-full overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-background text-primary shadow-sm border border-border/50' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={FADE_UP}
          initial="hidden"
          animate="show"
          exit="hidden"
          className="min-h-[400px] gpu-accelerated"
        >
          {activeTab === 'insights' && <InsightsTab stats={stats} />}
          {activeTab === 'spending' && <SpendingTab stats={stats} />}
          {activeTab === 'investments' && <InvestmentsTab stats={stats} />}
          {activeTab === 'strategy' && <StrategyTab stats={stats} />}
          {activeTab === 'forecast' && <ForecastTab stats={stats} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

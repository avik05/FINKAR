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
  getSpendingByCategory, getPortfolioPerformance, getForecast,
  getHistoricalPortfolioData, getAssetMix, getConcentrationRisk
} from "@/lib/analytics-utils";

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
  const [activeTab, setActiveTab] = useState<TabId>('spending');
  
  // Granular selectors to minimize re-renders
  const accounts = useAccountsStore((s) => s.accounts);
  const transactions = useTransactionsStore((s) => s.transactions);
  const stocks = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);

  // --- GRANULAR DATA CALCULATIONS ---
  
  // 1. General Metrics (Net Worth, Cash, Burn Rate, Runway, Savings Rate)
  const generalStats = useMemo(() => {
    const cash = accounts.reduce((s, a) => s + a.balance, 0);
    const burn = getBurnRate(transactions);
    
    // Quick portfolio snapshot for net worth
    const stockValue = stocks.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0);
    const fundsValue = funds.reduce((sum, f) => sum + f.current, 0);
    const portfolioValue = stockValue + fundsValue;
    const netWorth = cash + portfolioValue;

    const now = new Date();
    const thisMonthTx = transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthlyIncome = thisMonthTx.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const monthlyExpense = thisMonthTx.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

    return {
      netWorth,
      cash,
      burn,
      runway: getRunway(cash, burn.monthly),
      savingsRate: calculateSavingsRate(monthlyIncome, monthlyExpense),
      monthlyIncome,
      monthlyExpense
    };
  }, [accounts, transactions, stocks, funds]);

  // 2. Spending-Specific Metrics (Categories)
  const spendingStats = useMemo(() => ({
    spendingCategories: getSpendingByCategory(transactions)
  }), [transactions]);

  // 3. Portfolio-Specific Metrics (Backtracking, Asset Mix, Risk)
  const portfolioStats = useMemo(() => {
    const portfolio = getPortfolioPerformance(stocks, funds);
    return {
      portfolio,
      historicalData: getHistoricalPortfolioData(transactions, portfolio.totalValue),
      assetMix: getAssetMix(stocks, funds, generalStats.cash),
      concentrationRisk: getConcentrationRisk(stocks, funds)
    };
  }, [stocks, funds, transactions, generalStats.cash]);

  // 4. Forecasts
  const forecastStats = useMemo(() => ({
    forecasts: getForecast(generalStats.netWorth, generalStats.monthlyIncome - generalStats.monthlyExpense)
  }), [generalStats.netWorth, generalStats.monthlyIncome, generalStats.monthlyExpense]);

  // Combine for components
  const fullStats = {
    ...generalStats,
    ...spendingStats,
    ...portfolioStats,
    ...forecastStats
  };

  const tabs = [
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
          className="min-h-[400px] gpu-accelerated will-change-transform"
        >
          {activeTab === 'spending' && <SpendingTab stats={fullStats} />}
          {activeTab === 'investments' && <InvestmentsTab stats={fullStats} />}
          {activeTab === 'strategy' && <StrategyTab stats={fullStats} />}
          {activeTab === 'forecast' && <ForecastTab stats={fullStats} />}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

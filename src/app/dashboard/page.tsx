"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Landmark, Activity, Plus } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR, formatINRCompact } from "@/lib/format";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { AddTransactionDialog } from "@/components/dialogs/add-transaction-dialog";
import { TransactionHeatmap } from "@/components/shared/transaction-heatmap";
import { useAuthStore } from "@/stores/auth-store";
import { useLayoutStore } from "@/stores/layout-store";
import { FinancialPulse } from "@/components/dashboard/financial-pulse";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector
} from "recharts";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 150, damping: 20 } },
};

export default function DashboardPage() {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const { user } = useAuthStore();
  const accounts = useAccountsStore((s) => s.accounts);
  const transactions = useTransactionsStore((s) => s.transactions);
  const stocks = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);
  const { dateRange } = useLayoutStore();

  // Computed KPIs
  const cashBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const stockValue = stocks.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0);
  const stockInvested = stocks.reduce((sum, s) => sum + s.avgBuyPrice * s.quantity, 0);
  const mfValue = funds.reduce((sum, f) => sum + f.current, 0);
  const mfInvested = funds.reduce((sum, f) => sum + f.invested, 0);
  const netWorth = cashBalance + stockValue + mfValue;
  const investedAssets = stockValue + mfValue;

  const now = new Date();
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      if (dateRange === "This Week") {
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        return d >= weekAgo;
      }
      if (dateRange === "This Month") {
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }
      if (dateRange === "Last 3 Months") {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setDate(now.getDate() - 90);
        return d >= threeMonthsAgo;
      }
      if (dateRange === "This Year") {
        return d.getFullYear() === now.getFullYear();
      }
      return true; // All Time
    });
  }, [transactions, dateRange, now]);

  const monthlyExpense = filteredTransactions.filter((t: any) => t.amount < 0).reduce((s: number, t: any) => s + Math.abs(t.amount), 0);
  const monthlyIncome = filteredTransactions.filter((t: any) => t.amount > 0).reduce((s: number, t: any) => s + t.amount, 0);

  // Asset allocation for donut
  const allocation = [
    { name: "Cash (Banks)", value: Math.max(0, cashBalance), color: "var(--primary)", gradient: "url(#cashGrad)" },
    { name: "Stocks", value: stockValue, color: "#60A5FA", gradient: "url(#equityGrad)" },
    { name: "Mutual Funds", value: mfValue, color: "#A855F7", gradient: "url(#mfGrad)" },
  ].filter((a) => a.value > 0);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: `drop-shadow(0 0 8px ${fill})` }}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 14}
          fill={fill}
        />
      </g>
    );
  };

  const isEmpty = accounts.length === 0 && stocks.length === 0 && funds.length === 0;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.05 } } }} className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2">
        <div className="animate-float">
          <h1 className="text-3xl lg:text-4xl font-heading font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Welcome back, {user?.name?.split(" ")[0] || "there"}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium tracking-wide">Here is your financial pulse for today.</p>
        </div>
        <AddTransactionDialog>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary/20 transition-colors font-medium text-sm">
            <Plus size={16} /> Quick Add
          </button>
        </AddTransactionDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-6 relative overflow-hidden group glass-card">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-all duration-700 ease-out group-hover:scale-125">
              <Landmark className="w-32 h-32 text-primary translate-x-4 -translate-y-4" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Net Worth</p>
            <h2 className="text-3xl font-heading font-bold mt-2 text-foreground truncate">{formatINR(netWorth)}</h2>
            <p className="text-xs text-muted-foreground mt-2">Cash + Stocks + Mutual Funds</p>
            {isEmpty && <p className="text-xs text-muted-foreground mt-3">Add accounts & holdings to see your net worth</p>}
          </FinanceCard>
        </motion.div>

        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stocks &amp; Mutual Funds</p>
                <h3 className="text-xl md:text-2xl font-heading font-bold mt-1 text-foreground truncate">{formatINR(investedAssets)}</h3>
              </div>
              <div className="p-2 bg-foreground/5 rounded-xl border border-border/50"><TrendingUp className="w-5 h-5 text-chart-2" /></div>
            </div>
            {investedAssets > 0 && (
              <div className="flex items-center gap-2 mt-4 text-xs">
                <span className={`font-medium px-1.5 py-0.5 rounded ${stockValue + mfValue - stockInvested - mfInvested >= 0 ? 'text-primary bg-primary/10' : 'text-destructive bg-destructive/10'}`}>
                  {((stockValue + mfValue - stockInvested - mfInvested) / (stockInvested + mfInvested) * 100).toFixed(1)}% Overall Return
                </span>
              </div>
            )}
            {investedAssets === 0 && <p className="text-xs text-muted-foreground mt-4">No investments tracked yet</p>}
          </FinanceCard>
        </motion.div>

        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cash in Banks</p>
                <h3 className="text-xl md:text-2xl font-heading font-bold mt-1 text-foreground truncate">{formatINR(cashBalance)}</h3>
              </div>
              <div className="p-2 bg-foreground/5 rounded-xl border border-border/50"><Landmark className="w-5 h-5 text-chart-4" /></div>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">Across {accounts.length} account{accounts.length !== 1 ? 's' : ''}</div>
          </FinanceCard>
        </motion.div>

        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Flow ({dateRange})</p>
                <h3 className="text-xl md:text-2xl font-heading font-bold mt-1 text-foreground truncate">{formatINR(monthlyExpense)}</h3>
              </div>
              <div className="p-2 bg-foreground/5 rounded-xl border border-border/50"><Activity className="w-5 h-5 text-destructive" /></div>
            </div>
            {monthlyIncome > 0 && (
              <div className="flex items-center gap-2 mt-4 text-xs">
                <span className="text-muted-foreground">Savings rate: {((1 - monthlyExpense / monthlyIncome) * 100).toFixed(0)}%</span>
              </div>
            )}
            {monthlyIncome === 0 && <p className="text-xs text-muted-foreground mt-4">No income recorded this month</p>}
          </FinanceCard>
        </motion.div>
      </div>

      {/* Asset Allocation */}
      {allocation.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-foreground">
          <motion.div variants={FADE_UP} className="lg:col-span-2">
            <FinanceCard className="p-6 h-[400px] flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="flex justify-between items-start w-full mb-4">
                <div>
                  <h2 className="text-lg font-heading font-semibold">Asset Allocation</h2>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Portfolio Pulse</p>
                </div>
                {activeIndex !== null && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-right">
                    <p className="text-[10px] font-black text-primary uppercase">{allocation[activeIndex].name}</p>
                    <p className="text-sm font-bold">{((allocation[activeIndex].value / netWorth) * 100).toFixed(1)}%</p>
                  </motion.div>
                )}
              </div>

              <div className="flex-1 w-full relative min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--primary)" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#60A5FA" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={1}/>
                      </linearGradient>
                      <linearGradient id="mfGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A855F7" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                    <Pie 
                      {...({
                        activeIndex: activeIndex !== null ? activeIndex : undefined,
                        activeShape: renderActiveShape,
                        data: allocation,
                        cx: "50%",
                        cy: "50%",
                        innerRadius: 70,
                        outerRadius: 95,
                        paddingAngle: 5,
                        dataKey: "value",
                        stroke: "none",
                        onMouseEnter: (_: any, index: number) => setActiveIndex(index),
                        onMouseLeave: () => setActiveIndex(null),
                        animationDuration: 1500
                      } as any)}
                    >
                      {allocation.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.gradient} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Central Content */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <motion.div
                    animate={{ scale: activeIndex !== null ? 1.05 : 1 }}
                    className="space-y-0.5"
                  >
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                      {activeIndex !== null ? allocation[activeIndex].name : "Net Worth"}
                    </p>
                    <h4 className="text-xl md:text-2xl font-black text-foreground">
                      {activeIndex !== null ? formatINRCompact(allocation[activeIndex].value) : formatINRCompact(netWorth)}
                    </h4>
                  </motion.div>
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-4 w-full">
                {allocation.map((item, i) => (
                  <div 
                    key={item.name} 
                    className={`flex items-center gap-2 cursor-pointer transition-all ${activeIndex === i ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-100'}`}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
                  </div>
                ))}
              </div>
            </FinanceCard>
          </motion.div>

          {/* Financial Pulse */}
          <motion.div variants={FADE_UP} className="flex flex-col gap-6">
            <FinancialPulse 
              cashBalance={cashBalance}
              investedAssets={investedAssets}
              totalGain={stockValue + mfValue - stockInvested - mfInvested}
              gainPct={stockInvested + mfInvested > 0 ? ((stockValue + mfValue - stockInvested - mfInvested) / (stockInvested + mfInvested) * 100) : 0}
              monthlyExpense={monthlyExpense}
              monthlyIncome={monthlyIncome}
              transactionCount={filteredTransactions.length}
            />
          </motion.div>
        </div>
      )}

      {/* Heatmap Activity */}
      <motion.div variants={FADE_UP}>
        <FinanceCard className="p-6 glass-card overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-heading font-semibold">Activity Heatmap</h2>
            <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">Pro</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Your daily financial transaction density</p>
          <TransactionHeatmap />
        </FinanceCard>
      </motion.div>
    </motion.div>
  );
}

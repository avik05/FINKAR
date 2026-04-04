"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Landmark, Activity, CreditCard, Plus } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR, formatINRCompact } from "@/lib/format";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { AddTransactionDialog } from "@/components/dialogs/add-transaction-dialog";
import { EditTransactionDialog } from "@/components/dialogs/edit-transaction-dialog";
import { TransactionHeatmap } from "@/components/shared/transaction-heatmap";
import { useAuthStore } from "@/stores/auth-store";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const FADE_UP = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const accounts = useAccountsStore((s) => s.accounts);
  const transactions = useTransactionsStore((s) => s.transactions);
  const stocks = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);

  // Computed KPIs
  const cashBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const stockValue = stocks.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0);
  const stockInvested = stocks.reduce((sum, s) => sum + s.avgBuyPrice * s.quantity, 0);
  const mfValue = funds.reduce((sum, f) => sum + f.current, 0);
  const mfInvested = funds.reduce((sum, f) => sum + f.invested, 0);
  const netWorth = cashBalance + stockValue + mfValue;
  const investedAssets = stockValue + mfValue;

  const now = new Date();
  const thisMonth = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyExpense = thisMonth.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const monthlyIncome = thisMonth.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  // Asset allocation for donut
  const allocation = [
    { name: "Cash (Banks)", value: Math.max(0, cashBalance), fill: "var(--chart-4)" },
    { name: "Stocks", value: stockValue, fill: "var(--chart-1)" },
    { name: "Mutual Funds", value: mfValue, fill: "var(--chart-2)" },
  ].filter((a) => a.value > 0);

  // Recent 10 transactions
  const recentTx = transactions.slice(0, 10);

  const formatDate = (d: string) => {
    try {
      const date = new Date(d);
      const today = new Date();
      if (date.toDateString() === today.toDateString()) return "Today";
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
      return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    } catch { return d; }
  };

  const isEmpty = accounts.length === 0 && stocks.length === 0 && funds.length === 0;

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.15 } } }} className="space-y-8 pb-10">
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
                <p className="text-sm font-medium text-muted-foreground">Spent This Month</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={FADE_UP} className="lg:col-span-2">
            <FinanceCard className="p-6 h-[350px] flex flex-col items-center justify-center">
              <h2 className="text-lg font-heading font-semibold mb-4 self-start">Asset Allocation</h2>
              <div className="flex-1 w-full relative min-h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip contentStyle={{ backgroundColor: "rgba(18, 18, 26, 0.8)", backdropFilter: "blur(12px)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px" }} itemStyle={{ color: "var(--foreground)" }} formatter={(value: any) => [formatINR(value)]} />
                    <Pie data={allocation} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value" stroke="none" animationDuration={1500}>
                      {allocation.map((item, index) => (<Cell key={`cell-${index}`} fill={item.fill} />))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-sm text-muted-foreground">Net Worth</span>
                  <span className="text-xl font-heading font-bold">{formatINRCompact(netWorth)}</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 w-full">
                {allocation.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </FinanceCard>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={FADE_UP} className="flex flex-col gap-6">
            <FinanceCard className="p-6 flex-1">
              <h3 className="font-heading font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Bank Accounts</span><span className="font-semibold">{accounts.length}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Stock Holdings</span><span className="font-semibold">{stocks.length}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Mutual Funds</span><span className="font-semibold">{funds.length}</span></div>
                <div className="flex justify-between"><span className="text-sm text-muted-foreground">Transactions</span><span className="font-semibold">{transactions.length}</span></div>
              </div>
            </FinanceCard>
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

      {/* Recent Transactions */}
      <motion.div variants={FADE_UP}>
        <FinanceCard className="p-6 glass-card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-heading font-semibold">Recent Transactions</h2>
            <AddTransactionDialog>
              <button className="text-sm text-primary hover:underline underline-offset-4">+ Add</button>
            </AddTransactionDialog>
          </div>
          {recentTx.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No transactions yet. Start by adding one!</p>
              <AddTransactionDialog />
            </div>
          ) : (
            <div className="space-y-2">
              {recentTx.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-foreground/5 transition-colors border border-transparent hover:border-border/30 group">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${tx.amount > 0 ? "from-chart-1/20 to-chart-1/5 text-chart-1" : "from-secondary to-background border border-border/50 text-foreground"}`}>
                      {tx.amount > 0 ? <TrendingUp size={20} /> : <CreditCard size={20} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors truncate max-w-[120px] sm:max-w-none">{tx.merchant}</h4>
                      <p className="text-xs text-muted-foreground flex gap-2 mt-0.5">
                        <span>{formatDate(tx.date)}</span>
                        <span className="hidden sm:inline w-1 h-1 rounded-full bg-border self-center" />
                        <span className="hidden sm:inline">{tx.accountName}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className={`font-semibold text-sm ${tx.amount > 0 ? "text-chart-1" : "text-foreground"}`}>
                        {tx.amount > 0 ? "+" : ""}{formatINR(tx.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{tx.category}</p>
                    </div>
                    <EditTransactionDialog transaction={tx} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </FinanceCard>
      </motion.div>
    </motion.div>
  );
}

"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Tag, TrendingDown } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { useTransactionsStore } from "@/stores/transactions-store";
import { AddTransactionDialog } from "@/components/dialogs/add-transaction-dialog";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "#f97316",
  "Transport": "#3b82f6",
  "Shopping": "#a855f7",
  "Utilities": "#64748b",
  "Entertainment": "#ec4899",
  "Health": "#14b8a6",
  "Education": "#06b6d4",
  "Travel": "#eab308",
  "Subscriptions": "#6366f1",
  "Investments": "#00FF9C",
  "Other": "#78716c",
};

export default function ExpensesPage() {
  const transactions = useTransactionsStore((s) => s.transactions);

  const now = new Date();
  const thisMonthExpenses = transactions.filter((t) => {
    if (t.amount >= 0) return false;
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const totalExpense = thisMonthExpenses.reduce((s, t) => s + Math.abs(t.amount), 0);

  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    thisMonthExpenses.forEach((t) => {
      map.set(t.category, (map.get(t.category) || 0) + Math.abs(t.amount));
    });
    return Array.from(map.entries())
      .map(([name, amount]) => ({ name, amount, color: CATEGORY_COLORS[name] || "#78716c" }))
      .sort((a, b) => b.amount - a.amount);
  }, [thisMonthExpenses]);

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1">Where your money goes this month.</p>
        </div>
        <AddTransactionDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-6">
            <span className="text-sm font-medium text-muted-foreground">Monthly Spend</span>
            <h2 className="text-2xl font-heading font-bold mt-1 text-foreground">{formatINR(totalExpense)}</h2>
          </FinanceCard>
        </motion.div>
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-6">
            <span className="text-sm font-medium text-muted-foreground">Categories</span>
            <h2 className="text-2xl font-heading font-bold mt-1 text-foreground">{categoryBreakdown.length}</h2>
          </FinanceCard>
        </motion.div>
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-6">
            <span className="text-sm font-medium text-muted-foreground">Transactions</span>
            <h2 className="text-2xl font-heading font-bold mt-1 text-foreground">{thisMonthExpenses.length}</h2>
          </FinanceCard>
        </motion.div>
      </div>

      {thisMonthExpenses.length === 0 ? (
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-12 text-center">
            <TrendingDown className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-heading font-semibold mb-2">No Expenses This Month</h3>
            <p className="text-sm text-muted-foreground mb-6">Add expense transactions from Banks or use the button below.</p>
            <AddTransactionDialog />
          </FinanceCard>
        </motion.div>
      ) : (
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-6">
            <h2 className="text-lg font-heading font-semibold mb-6">Category Breakdown</h2>
            <div className="space-y-5">
              {categoryBreakdown.map((cat) => {
                const pct = totalExpense > 0 ? (cat.amount / totalExpense) * 100 : 0;
                return (
                  <div key={cat.name} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-muted-foreground" />
                        <h4 className="font-medium">{cat.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{formatINR(cat.amount)}</span>
                        <span className="text-muted-foreground text-sm ml-2">({pct.toFixed(0)}%)</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </FinanceCard>
        </motion.div>
      )}
    </motion.div>
  );
}

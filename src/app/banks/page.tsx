"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Landmark, Wallet, Search, Filter, ArrowUpRight, ArrowDownRight, Tag, Trash2, Receipt } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { AddAccountDialog } from "@/components/dialogs/add-account-dialog";
import { AddTransactionDialog } from "@/components/dialogs/add-transaction-dialog";
import { EditTransactionDialog } from "@/components/dialogs/edit-transaction-dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

const iconMap: Record<string, React.ElementType> = { Savings: Landmark, Checking: Landmark, Credit: CreditCard, Wallet: Wallet };
const colorMap: Record<string, { color: string; bg: string }> = {
  Savings: { color: "text-blue-500", bg: "bg-blue-500/10" },
  Checking: { color: "text-emerald-500", bg: "bg-emerald-500/10" },
  Credit: { color: "text-destructive", bg: "bg-destructive/10" },
  Wallet: { color: "text-amber-500", bg: "bg-amber-500/10" },
};

export default function BanksPage() {
  const accounts = useAccountsStore((s) => s.accounts);
  const deleteAccount = useAccountsStore((s) => s.deleteAccount);
  const transactions = useTransactionsStore((s) => s.transactions);
  const deleteTransaction = useTransactionsStore((s) => s.deleteTransaction);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTx = transactions.filter((tx) =>
    tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Banks & Cards</h1>
          <p className="text-muted-foreground mt-1">Unified view of your liquidity and obligations.</p>
        </div>
        <div className="flex gap-3">
          <AddAccountDialog />
          <AddTransactionDialog />
        </div>
      </div>

      {accounts.length === 0 ? (
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-12 text-center">
            <Landmark className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-heading font-semibold mb-2">No Accounts Yet</h3>
            <p className="text-sm text-muted-foreground mb-6">Add your first bank account to start tracking your finances.</p>
            <AddAccountDialog />
          </FinanceCard>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accounts.map((account) => {
            const Icon = iconMap[account.type] || Landmark;
            const colors = colorMap[account.type] || colorMap.Savings;
            return (
              <motion.div key={account.id} variants={FADE_UP}>
                <FinanceCard className="p-6 group relative">
                  <button onClick={() => deleteAccount(account.id)} className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-destructive transition-all" title="Delete account">
                    <Trash2 size={14} />
                  </button>
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${colors.bg} border border-border/50`}>
                      <Icon className={`w-6 h-6 ${colors.color}`} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-foreground/5 py-1 px-2 rounded">{account.type}</span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground truncate">{account.name}</h3>
                    <h2 className="text-2xl font-heading font-bold mt-1 text-foreground">{formatINR(account.balance)}</h2>
                  </div>
                </FinanceCard>
              </motion.div>
            );
          })}
        </div>
      )}

      <motion.div variants={FADE_UP}>
        <FinanceCard className="w-full flex flex-col">
          <div className="p-6 border-b border-border/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-lg font-heading font-semibold">Transaction Ledger</h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Search merchant or category..." className="pl-10 bg-foreground/5 border-border/50" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">No transactions recorded yet.</p>
              <AddTransactionDialog />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-xs text-muted-foreground bg-foreground/5">
                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Merchant / Details</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider">Account</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider text-right">Amount</th>
                    <th className="px-6 py-4 font-medium uppercase tracking-wider w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {filteredTx.map((tx) => (
                    <tr key={tx.id} className="hover:bg-foreground/5 transition-colors group">
                      <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{formatDate(tx.date)}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-sm text-foreground">{tx.merchant}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-foreground/5 border border-border/50 text-muted-foreground">
                          <Tag size={12} />{tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{tx.accountName}</td>
                      <td className={`px-6 py-4 text-sm font-semibold text-right whitespace-nowrap ${tx.amount > 0 ? 'text-primary' : 'text-foreground'}`}>
                        <div className="flex justify-end items-center gap-1">
                          {tx.amount > 0 ? <ArrowUpRight size={14} className="text-primary" /> : <ArrowDownRight size={14} className="text-muted-foreground" />}
                          {formatINR(Math.abs(tx.amount))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <EditTransactionDialog transaction={tx} />
                          <button onClick={() => deleteTransaction(tx.id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-destructive transition-all" title="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </FinanceCard>
      </motion.div>
    </motion.div>
  );
}

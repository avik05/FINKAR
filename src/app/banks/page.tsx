"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Landmark, Wallet, Search, Filter, ArrowUpRight, ArrowDownRight, Tag, Trash2, Receipt, Briefcase } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { AddAccountDialog } from "@/components/dialogs/add-account-dialog";
import { AddTransactionDialog } from "@/components/dialogs/add-transaction-dialog";
import { EditTransactionDialog } from "@/components/dialogs/edit-transaction-dialog";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

const iconMap: Record<string, React.ElementType> = { Savings: Landmark, Checking: Landmark, Salary: Briefcase, Credit: CreditCard, Wallet: Wallet };
const colorMap: Record<string, { color: string; bg: string }> = {
  Savings: { color: "text-blue-500", bg: "bg-blue-500/10" },
  Checking: { color: "text-emerald-500", bg: "bg-emerald-500/10" },
  Salary: { color: "text-indigo-500", bg: "bg-indigo-500/10" },
  Credit: { color: "text-destructive", bg: "bg-destructive/10" },
  Wallet: { color: "text-amber-500", bg: "bg-amber-500/10" },
};

export default function BanksPage() {
  const accounts = useAccountsStore((s) => s.accounts);
  const deleteAccount = useAccountsStore((s) => s.deleteAccount);
  const transactions = useTransactionsStore((s) => s.transactions);
  const deleteTransaction = useTransactionsStore((s) => s.deleteTransaction);
  const { isLoggedIn } = useAuthStore();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'income' | 'expense'>('all');

  const handleDeleteAccount = (id: string) => {
    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }
    deleteAccount(id);
  };

  const handleDeleteTransaction = (id: string) => {
    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }
    deleteTransaction(id);
  };

  const filteredTx = transactions.filter((tx) => {
    const matchesSearch = 
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' ? true : 
      activeTab === 'income' ? tx.amount > 0 : 
      tx.amount < 0;

    return matchesSearch && matchesTab;
  });

  const incomeCount = transactions.filter(t => t.amount > 0).length;
  const expenseCount = transactions.filter(t => t.amount < 0).length;

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
          <p className="text-muted-foreground mt-1 text-sm">Unified view of your liquidity and obligations.</p>
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
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">No Accounts Yet</h3>
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
                <FinanceCard className="p-6 group relative h-full">
                  <button onClick={() => handleDeleteAccount(account.id)} className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-destructive transition-all" title="Delete account">
                    <Trash2 size={14} />
                  </button>
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-xl ${colors.bg} border border-border/50`}>
                      <Icon className={`w-6 h-6 ${colors.color}`} />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-foreground/5 py-1 px-2 rounded">{account.type}</span>
                  </div>
                  <div className="mt-6">
                    <h3 className="text-xs font-medium text-muted-foreground truncate uppercase tracking-wider">{account.name}</h3>
                    <h2 className="text-2xl font-heading font-bold mt-1 text-foreground">{formatINR(account.balance)}</h2>
                  </div>
                </FinanceCard>
              </motion.div>
            );
          })}
        </div>
      )}

      <motion.div variants={FADE_UP}>
        <FinanceCard className="w-full flex flex-col overflow-hidden border-border/40">
          <div className="p-6 border-b border-border/40 bg-card/30 backdrop-blur-sm">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
              <div className="flex flex-col gap-4">
                <h2 className="text-xl font-heading font-bold text-foreground flex items-center gap-2">
                  <Receipt className="text-primary w-5 h-5" /> Transaction Ledger
                </h2>
                
                {/* Tabs filter */}
                <div className="flex items-center p-1 bg-foreground/5 rounded-xl border border-border/50 w-fit">
                  {[
                    { id: 'all', label: 'All', count: transactions.length },
                    { id: 'income', label: 'Incomes', count: incomeCount },
                    { id: 'expense', label: 'Expenses', count: expenseCount }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-lg flex items-center gap-2 ${activeTab === tab.id ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTabLabel"
                          className="absolute inset-0 bg-primary rounded-lg shadow-[0_0_15px_rgba(0,255,156,0.3)]"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                      <span className={`relative z-10 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-black/20 text-white' : 'bg-foreground/10 text-muted-foreground'}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full xl:w-auto">
                <div className="relative flex-1 xl:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="search" 
                    placeholder="Search by merchant or category..." 
                    className="pl-11 bg-foreground/5 border-border/50 text-sm h-12 rounded-xl focus:border-primary/50 transition-all font-medium" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
                <AddTransactionDialog />
              </div>
            </div>
          </div>

          {transactions.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-foreground/5 rounded-2xl flex items-center justify-center mb-4 border border-border/30">
                <Filter className="text-muted-foreground opacity-20 w-8 h-8" />
              </div>
              <p className="text-muted-foreground font-medium mb-4">No transactions recorded yet.</p>
              <AddTransactionDialog />
            </div>
          ) : (
            <div className="relative max-h-[600px] overflow-y-auto custom-scrollbar border-t border-border/20">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead className="sticky top-0 z-20 bg-card/95 backdrop-blur-xl border-b border-border/50">
                  <tr className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/70">
                    <th className="px-8 py-5">Date</th>
                    <th className="px-8 py-5">Merchant / Details</th>
                    <th className="px-8 py-5">Category</th>
                    <th className="px-8 py-5">Account</th>
                    <th className="px-8 py-5 text-right">Amount</th>
                    <th className="px-8 py-5 w-20"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  <AnimatePresence mode="popLayout">
                    {filteredTx.length === 0 ? (
                       <motion.tr 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          exit={{ opacity: 0 }}
                       >
                         <td colSpan={6} className="px-8 py-20 text-center">
                            <p className="text-sm text-muted-foreground font-medium">No {activeTab === 'all' ? '' : activeTab} transactions found matching your criteria.</p>
                         </td>
                       </motion.tr>
                    ) : (
                      filteredTx.map((tx) => (
                        <motion.tr 
                          key={tx.id} 
                          layout
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-primary/5 transition-all duration-300 group cursor-default"
                        >
                          <td className="px-8 py-5 text-sm font-semibold text-muted-foreground whitespace-nowrap tabular-nums">{formatDate(tx.date)}</td>
                          <td className="px-8 py-5">
                            <div className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">{tx.merchant}</div>
                            <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mt-1">{tx.accountName}</div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-foreground/5 border border-border/40 text-muted-foreground group-hover:border-primary/30 group-hover:bg-primary/10 transition-all">
                              <Tag size={10} className="text-primary/50" /> {tx.category}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-sm font-medium text-muted-foreground/80">{tx.accountName}</td>
                          <td className={`px-8 py-5 text-sm font-black text-right whitespace-nowrap tabular-nums`}>
                            <div className="flex justify-end items-center gap-2">
                              <span className={tx.amount > 0 ? "text-primary drop-shadow-[0_0_8px_rgba(0,255,156,0.3)]" : "text-foreground opacity-80"}>
                                {tx.amount > 0 ? "+" : "-"}{formatINR(Math.abs(tx.amount))}
                              </span>
                              {tx.amount > 0 ? (
                                <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                                  <ArrowUpRight size={14} />
                                </div>
                              ) : (
                                <div className="p-1.5 bg-foreground/5 rounded-lg text-muted-foreground">
                                  <ArrowDownRight size={14} />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex justify-end gap-2">
                              <EditTransactionDialog transaction={tx} />
                              <button onClick={() => handleDeleteTransaction(tx.id)} className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-destructive/10 text-destructive/60 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all" title="Delete">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </FinanceCard>
      </motion.div>
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--primary-rgb), 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(var(--primary-rgb), 0.2);
        }
      `}</style>
    </motion.div>
  );
}

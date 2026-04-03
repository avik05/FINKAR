"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, Link, ShieldCheck, Smartphone, Download } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { Button } from "@/components/ui/button";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

export default function SettingsPage() {
  const accounts = useAccountsStore((s) => s.accounts);
  const transactions = useTransactionsStore((s) => s.transactions);
  const holdings = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      accounts,
      transactions,
      stockHoldings: holdings,
      mutualFunds: funds,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finkar-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearAll = () => {
    if (confirm("Are you sure? This will delete ALL your data permanently.")) {
      localStorage.removeItem("finkar-accounts-v3");
      localStorage.removeItem("finkar-transactions-v3");
      localStorage.removeItem("finkar-stocks-v3");
      localStorage.removeItem("finkar-mutualfunds-v3");
      localStorage.removeItem("finkar-seeded-v3");
      localStorage.removeItem("finkar-auth");
      window.location.reload();
    }
  };

  const handleResetToSamples = () => {
    if (confirm("This will replace all your current data with the default sample dashboard. Proceed?")) {
      localStorage.removeItem("finkar-accounts-v3");
      localStorage.removeItem("finkar-transactions-v3");
      localStorage.removeItem("finkar-stocks-v3");
      localStorage.removeItem("finkar-mutualfunds-v3");
      localStorage.removeItem("finkar-seeded-v3");
      window.location.assign("/"); // Hard reload back to home
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6 pb-6 lg:max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your data, security, and preferences.</p>
      </div>

      <motion.div variants={FADE_UP} className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Data Overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <Link size={20} className="text-primary" /> Your Data
          </h2>
          <FinanceCard className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Bank Accounts</span>
              <span className="font-semibold text-sm">{accounts.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Transactions</span>
              <span className="font-semibold text-sm">{transactions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Stock Holdings</span>
              <span className="font-semibold text-sm">{holdings.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mutual Funds</span>
              <span className="font-semibold text-sm">{funds.length}</span>
            </div>

            <div className="pt-4 border-t border-foreground/5 space-y-3">
              <Button onClick={handleResetToSamples} variant="outline" className="w-full gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                <Building2 size={16} /> Reset to Sample Data
              </Button>
              <Button onClick={handleExport} variant="outline" className="w-full gap-2 bg-foreground/5 border-border/50 text-muted-foreground hover:bg-foreground/10">
                <Download size={16} /> Export Data as JSON
              </Button>
              <Button onClick={handleClearAll} variant="outline" className="w-full gap-2 text-destructive border-destructive/20 hover:bg-destructive/10">
                Clear All Data
              </Button>
            </div>
          </FinanceCard>
        </div>

        {/* Storage Info */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary" /> Storage & Privacy
          </h2>
          <FinanceCard className="p-6 space-y-6">
            <div>
              <h3 className="font-semibold text-sm mb-2">How your data is stored</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All your financial data is stored <strong>locally in your browser</strong> using localStorage. Nothing is sent to any server. Your data stays on this device and persists across page refreshes.
              </p>
            </div>
            <div className="pt-4 border-t border-foreground/5">
              <h3 className="font-semibold text-sm mb-2">Backup Recommendation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use the &quot;Export Data as JSON&quot; button regularly to create backups. If you clear your browser data, your financial records will be lost unless you have a backup.
              </p>
            </div>
            <div className="pt-4 border-t border-foreground/5">
              <div className="flex items-center gap-2 text-primary font-medium mb-3">
                <Smartphone size={16} /> App Info
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="font-mono">1.0.0</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Framework</span><span className="font-mono">Next.js</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Storage</span><span className="font-mono">localStorage</span></div>
              </div>
            </div>
          </FinanceCard>
        </div>
      </motion.div>
    </motion.div>
  );
}

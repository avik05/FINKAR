"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, Link, ShieldCheck, Smartphone, Download, AlertTriangle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
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
  const router = useRouter();
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

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

  const handleDeleteAccount = async () => {
    if (confirm("CRITICAL ACTION: This will delete your account and all associated data permanently. This cannot be undone. Proceed?")) {
      await deleteAccount();
      router.push("/");
    }
  };

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6 pb-6 lg:max-w-4xl">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground flex items-center gap-2">
          Settings<span className="text-xs font-bold text-muted-foreground/60 align-top relative -top-2">TM</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage your data, security, and proprietary preferences.</p>
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

          {/* Legal & Brand (NEW) */}
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2 pt-4">
            <ShieldCheck size={20} className="text-primary" /> Legal & Brand
          </h2>
          <FinanceCard className="p-6 space-y-3">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2 font-bold font-heading">Proprietary Documentation</p>
            <div className="space-y-1">
              <button onClick={() => router.push("/terms")} className="w-full text-left p-3 rounded-xl hover:bg-foreground/5 transition-colors border border-transparent hover:border-border/50 flex items-center justify-between group">
                <span className="text-sm font-bold text-foreground/80">Terms of Service</span>
                <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Read Policy</span>
              </button>
              <button onClick={() => router.push("/privacy")} className="w-full text-left p-3 rounded-xl hover:bg-foreground/5 transition-colors border border-transparent hover:border-border/50 flex items-center justify-between group">
                <span className="text-sm font-bold text-foreground/80">Privacy Policy</span>
                <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Read Policy</span>
              </button>
              <button onClick={() => router.push("/license")} className="w-full text-left p-3 rounded-xl hover:bg-foreground/5 transition-colors border border-transparent hover:border-border/50 flex items-center justify-between group">
                <span className="text-sm font-bold text-foreground/80">License & Copyright</span>
                <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-tighter">Read Policy</span>
              </button>
            </div>
          </FinanceCard>
        </div>

        {/* Data Sync & Security */}
        <div className="space-y-4">
          <h2 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck size={20} className="text-primary" /> Cloud Sync & Security
          </h2>
          <FinanceCard className="p-6 space-y-6">
            <div>
              <h3 className="font-bold text-sm mb-2 text-foreground tracking-tight">How your data is stored</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your data is securely synced to your **Finkar account in the cloud** using high-grade encryption. This allows you to access your financial dashboard from any device while maintaining the highest privacy standards. Your data is never shared with third parties.
              </p>
            </div>
            <div className="pt-4 border-t border-foreground/5">
              <h3 className="font-bold text-sm mb-2 text-foreground tracking-tight">Security & Ownership</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Finkar is proprietary software. All data is protected by industry-standard security protocols. All rights are reserved to the developer (**Avik**). Unauthorized redistribution or reverse engineering of this dashboard is strictly prohibited.
              </p>
            </div>
            <div className="pt-4 border-t border-foreground/5">
              <div className="flex items-center gap-2 text-primary font-bold mb-4 uppercase tracking-widest text-[10px]">
                <Smartphone size={14} /> FINKAR App Info
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Developer</span>
                  <span className="font-bold text-foreground">Avik</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Status</span>
                  <span className="font-bold text-primary flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10">Reserved ™</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Version</span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-secondary border border-border/50">v1.2.0-secure</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Storage</span>
                  <span className="font-bold text-foreground">Supabase Cloud (PostgreSQL)</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/10 mt-2">
                  <span className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.2em] w-full text-center">
                    © 2024-2025 FINKAR. All Rights Reserved.
                  </span>
                </div>
              </div>
            </div>
          </FinanceCard>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div variants={FADE_UP} className="pt-6">
        <h2 className="text-lg font-heading font-semibold text-destructive flex items-center gap-2 mb-4">
          <AlertTriangle size={20} /> Danger Zone
        </h2>
        <FinanceCard className="p-6 border-destructive/20 bg-destructive/5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Delete Account</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Permanently remove your account and all your financial data from this device. Please ensure you have an export of your data if you need it.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              className="w-full md:w-auto px-8 shadow-[0_0_20px_rgba(255,0,0,0.1)] hover:shadow-[0_0_30px_rgba(255,0,0,0.2)]"
            >
              <Trash2 size={16} className="mr-2" /> Delete Permanently
            </Button>
          </div>
        </FinanceCard>
      </motion.div>
    </motion.div>
  );
}

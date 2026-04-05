"use client";

import React from "react";
import { motion } from "framer-motion";
import { Zap, TrendingUp, Wallet, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR, formatINRCompact } from "@/lib/format";

interface FinancialPulseProps {
  cashBalance: number;
  investedAssets: number;
  totalGain: number;
  gainPct: number;
  monthlyExpense: number;
  monthlyIncome: number;
  transactionCount: number;
}

export function FinancialPulse({
  cashBalance,
  investedAssets,
  totalGain,
  gainPct,
  monthlyExpense,
  monthlyIncome,
  transactionCount,
}: FinancialPulseProps) {
  const savingsRate = monthlyIncome > 0 ? Math.max(0, ((monthlyIncome - monthlyExpense) / monthlyIncome) * 100) : 0;
  
  const pulses = [
    {
      title: "Liquidity",
      value: formatINRCompact(cashBalance),
      label: "Ready to Use",
      icon: Wallet,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      progress: 100, // Just a static indicator for now
    },
    {
      title: "Growth",
      value: `${gainPct >= 0 ? "+" : ""}${gainPct.toFixed(1)}%`,
      label: "Portfolio Performance",
      icon: TrendingUp,
      color: gainPct >= 0 ? "text-primary" : "text-destructive",
      bg: gainPct >= 0 ? "bg-primary/10" : "bg-destructive/10",
      progress: Math.min(Math.abs(gainPct) * 5, 100),
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(0)}%`,
      label: "Monthly Buffer",
      icon: Zap,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      progress: savingsRate,
    },
    {
      title: "Activity",
      value: transactionCount.toString(),
      label: "Logs this month",
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      progress: Math.min((transactionCount / 50) * 100, 100),
    }
  ];

  return (
    <FinanceCard className="p-6 h-full flex flex-col justify-between overflow-hidden relative">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading font-bold text-foreground flex items-center gap-2">
            Financial Pulse
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(0,255,156,0.8)]" />
          </h3>
          <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground bg-foreground/5 px-2 py-1 rounded-full border border-border/50">Live</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {pulses.map((pulse, i) => (
            <motion.div 
              key={pulse.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg ${pulse.bg} ${pulse.color}`}>
                  <pulse.icon size={14} />
                </div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{pulse.title}</span>
              </div>
              <div>
                <p className={`text-lg font-heading font-black ${pulse.color}`}>{pulse.value}</p>
                <p className="text-[10px] text-muted-foreground truncate">{pulse.label}</p>
              </div>
              <div className="h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${pulse.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className={`h-full ${pulse.color.replace('text-', 'bg-')}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Link 
        href="/analytics" 
        className="mt-8 pt-6 border-t border-border/50 flex justify-between items-center group/btn cursor-pointer"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover/btn:text-primary transition-colors">See Detailed Insights</span>
        <ArrowUpRight size={14} className="text-muted-foreground group-hover/btn:text-primary group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all" />
      </Link>
    </FinanceCard>
  );
}

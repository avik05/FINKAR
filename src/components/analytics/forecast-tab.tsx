"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINRCompact } from "@/lib/format";

export function ForecastTab({ stats }: { stats: any }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <FinanceCard className="lg:col-span-2 p-6 min-h-[400px]">
        <h3 className="font-heading font-bold mb-8">Wealth Milestone Tracker</h3>
        <div className="space-y-8">
          {stats.forecasts.map((f: any, i: number) => (
            <div key={i} className="relative">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="text-sm font-black text-foreground">Target: {formatINRCompact(f.target)}</h4>
                  <p className="text-[10px] text-muted-foreground italic">Distance from now: {formatINRCompact(f.target - stats.netWorth)}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-primary bg-primary/10 px-2 py-1 rounded-md">
                    {f.months === 0 ? "Achieved! 🎉" : `${(f.months / 12).toFixed(1)} Years`}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (stats.netWorth / f.target) * 100)}%` }}
                  transition={{ duration: 1.5, delay: i * 0.2 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          ))}
        </div>
      </FinanceCard>

      <FinanceCard className="p-6 bg-gradient-to-br from-indigo-500/[0.05] to-transparent">
        <h3 className="font-heading font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="text-primary" size={20} />
          Forecast Logic
        </h3>
        <div className="space-y-4 text-xs text-muted-foreground leading-relaxed">
          <p>This forecast assumes a conservative <strong>12% annual return</strong> on your current invested capital.</p>
          <p>It also assumes you maintain your current monthly savings rate of <strong>{formatINRCompact(Math.max(0, stats.burn.monthly * (stats.savingsRate / 100)))}</strong>.</p>
          <div className="p-4 rounded-xl bg-foreground/5 border border-border/50 text-[10px] font-bold text-foreground">
            💡 Pro-Tip: Increasing your SIP by just ₹5,000/mo could reduce your timeline to ₹1Cr by 2.4 years.
          </div>
        </div>
      </FinanceCard>
    </div>
  );
}

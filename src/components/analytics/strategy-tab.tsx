"use client";

import React, { useState, useMemo } from "react";
import {
  Shield,
  Activity,
  Zap,
  Download,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Info,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR, formatINRCompact } from "@/lib/format";
import {
  analyzePortfolio,
  generateActionPlanCSV,
  type RiskProfile,
  type PortfolioAnalysis,
} from "@/lib/portfolio-analyzer";
import { useAccountsStore } from "@/stores/accounts-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";

const PROFILE_META = {
  conservative: {
    icon: Shield,
    color: "text-blue-400",
    bgColor: "bg-blue-400/10",
    borderActive: "border-blue-400/40",
    glowActive: "shadow-[0_0_20px_rgba(96,165,250,0.12)]",
    tagline: "Capital preservation & stability",
  },
  moderate: {
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderActive: "border-primary/40",
    glowActive: "shadow-[0_0_20px_rgba(0,255,156,0.1)]",
    tagline: "Balanced growth & controlled risk",
  },
  aggressive: {
    icon: Zap,
    color: "text-orange-400",
    bgColor: "bg-orange-400/10",
    borderActive: "border-orange-400/40",
    glowActive: "shadow-[0_0_20px_rgba(251,146,60,0.12)]",
    tagline: "Maximum growth potential",
  },
} as const;

export function StrategyTab({ stats }: { stats: any }) {
  const [selectedProfile, setSelectedProfile] = useState<RiskProfile>("moderate");

  // Pull raw data from stores — these are the actual user holdings
  const accounts = useAccountsStore((s) => s.accounts);
  const stocks = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);

  // Run the portfolio analysis engine
  const analysis = useMemo<PortfolioAnalysis>(
    () => analyzePortfolio(stocks, funds, accounts, selectedProfile),
    [stocks, funds, accounts, selectedProfile]
  );

  // CSV download handler
  const handleDownloadCSV = () => {
    const csv = generateActionPlanCSV(analysis);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Finkar_Strategy_${selectedProfile}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const { allocation, alignmentScore, target, detectedProfile, rebalanceActions, overexposureAlerts, insights, isEmpty } = analysis;
  const meta = PROFILE_META[selectedProfile];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* ─── LEFT: Strategy Selection ─── */}
      <div className="flex flex-col gap-4">
        {(["conservative", "moderate", "aggressive"] as RiskProfile[]).map((key) => {
          const detail = PROFILE_META[key];
          const isSelected = selectedProfile === key;
          const isDetected = detectedProfile === key;
          return (
            <FinanceCard
              key={key}
              onClick={() => setSelectedProfile(key)}
              className={`p-5 cursor-pointer border-2 transition-all duration-300 ${
                isSelected
                  ? `${detail.borderActive} ${detail.bgColor} ${detail.glowActive}`
                  : "border-border/50 hover:border-foreground/20 hover:bg-foreground/5"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-foreground/5 ${detail.color}`}>
                  <detail.icon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-black capitalize">{key}</h4>
                    {isDetected && !isEmpty && (
                      <span className="text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{detail.tagline}</p>
                </div>
                {isSelected && (
                  <CheckCircle2 size={16} className={detail.color} />
                )}
              </div>
            </FinanceCard>
          );
        })}

        {/* ─── Allocation Breakdown Mini Card ─── */}
        {!isEmpty && (
          <FinanceCard className="p-4" hoverEffect={false}>
            <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">Your Allocation</p>
            <div className="space-y-2.5">
              {[
                { label: "Equity", pct: allocation.equityPct, targetPct: target.equityPct, value: allocation.equity, color: "bg-primary" },
                { label: "Debt", pct: allocation.debtPct, targetPct: target.debtPct, value: allocation.debt, color: "bg-blue-400" },
                { label: "Cash", pct: allocation.cashPct, targetPct: target.cashPct, value: allocation.cash, color: "bg-yellow-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] font-bold text-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-muted-foreground">
                        {item.pct.toFixed(0)}%
                      </span>
                      <span className="text-[9px] text-muted-foreground/50">→</span>
                      <span className="text-[10px] font-mono text-primary/80">
                        {item.targetPct}%
                      </span>
                    </div>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${item.color} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.min(item.pct, 100)}%` }}
                    />
                    {/* Target marker */}
                    <div
                      className="absolute top-0 h-full w-0.5 bg-foreground/30 rounded-full"
                      style={{ left: `${Math.min(item.targetPct, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </FinanceCard>
        )}
      </div>

      {/* ─── RIGHT: Optimization Summary ─── */}
      <FinanceCard className="lg:col-span-2 p-6" hoverEffect={false}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-heading font-bold">Optimization Summary</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary px-3 py-1 bg-primary/10 rounded-full">
            {alignmentScore >= 85 ? "Aligned" : alignmentScore >= 60 ? "Needs Tuning" : "Review Required"}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedProfile}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            {/* ─── Alignment Score ─── */}
            <div className="flex justify-between items-center p-4 rounded-xl bg-foreground/5 border border-border/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${meta.bgColor}`}>
                  <BarChart3 size={16} className={meta.color} />
                </div>
                <div>
                  <span className="text-sm font-bold block">Current Alignment</span>
                  {!isEmpty && (
                    <span className="text-[10px] text-muted-foreground">
                      {detectedProfile === selectedProfile
                        ? "Your portfolio matches this strategy"
                        : `Currently ${detectedProfile} — ${Math.abs(allocation.equityPct - target.equityPct).toFixed(0)}% equity gap`}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black ${alignmentScore >= 80 ? "text-primary" : alignmentScore >= 50 ? "text-yellow-400" : "text-destructive"}`}>
                  {isEmpty ? "—" : `${alignmentScore}%`}
                </span>
                <span className="text-[10px] text-muted-foreground block">Match</span>
              </div>
            </div>

            {/* ─── Intelligence Insights ─── */}
            <div className="p-5 border-l-4 border-primary bg-primary/[0.03] rounded-r-xl">
              {insights.length > 0 ? (
                <div className="space-y-3">
                  {insights.slice(0, 3).map((insight, i) => (
                    <p key={i} className="text-xs leading-relaxed text-foreground/90">
                      {i === 0 ? (
                        <span>{insight}</span>
                      ) : (
                        <span className="text-muted-foreground">{insight}</span>
                      )}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Add your financial data to receive personalized insights.</p>
              )}
            </div>

            {/* ─── Rebalancing Actions ─── */}
            {rebalanceActions.length > 0 && (
              <div className="space-y-2">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Suggested Actions</p>
                {rebalanceActions.map((action, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      action.priority === "high"
                        ? "bg-destructive/[0.03] border-destructive/15"
                        : "bg-foreground/[0.03] border-border/50"
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      action.priority === "high" ? "bg-destructive/10" : "bg-primary/10"
                    }`}>
                      <ArrowRight size={12} className={
                        action.priority === "high" ? "text-destructive" : "text-primary"
                      } />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">
                        Shift {formatINRCompact(action.amount)} from {action.from} → {action.to}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{action.description}</p>
                    </div>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shrink-0 ${
                      action.priority === "high"
                        ? "bg-destructive/10 text-destructive"
                        : action.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : "bg-foreground/5 text-muted-foreground"
                    }`}>
                      {action.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* ─── Overexposure Alerts ─── */}
            {overexposureAlerts.length > 0 && (
              <div className="space-y-2">
                <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1">Risk Alerts</p>
                {overexposureAlerts.slice(0, 3).map((alert, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-yellow-500/[0.03] border border-yellow-500/15">
                    <AlertTriangle size={14} className="text-yellow-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">{alert.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ─── Download CTA ─── */}
            <button
              onClick={handleDownloadCSV}
              className="w-full mt-4 bg-primary text-primary-foreground font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-[0_4px_20px_rgba(0,255,156,0.2)] active:scale-[0.98]"
            >
              <Download size={18} /> Download Detailed Action Plan (CSV)
            </button>
          </motion.div>
        </AnimatePresence>
      </FinanceCard>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, ReferenceLine, Tooltip, CartesianGrid } from "recharts";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { useStocksStore } from "@/stores/stocks-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { AddStockDialog } from "@/components/dialogs/add-stock-dialog";
import { EditStockDialog } from "@/components/dialogs/edit-stock-dialog";
import { SellStockDialog } from "@/components/dialogs/sell-stock-dialog";
import { FetchStocksDialog } from "@/components/dialogs/fetch-stocks-dialog";
import { cn } from "@/lib/utils";

const FADE_UP = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 500, damping: 30 } },
};

const CHART_COLORS = ["#00FF9C", "#3ABEFF", "#FF6B6B", "#FFBE0B", "#A78BFA", "#F472B6", "#34D399", "#FB923C"];

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="bg-background/80 backdrop-blur-xl border border-primary/20 rounded-2xl p-4 shadow-2xl min-w-[160px] animate-in fade-in zoom-in duration-200">
      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{label}</p>
      <div className="flex justify-between items-end gap-4">
        <h4 className={`text-sm font-bold ${value >= 0 ? 'text-primary' : 'text-destructive'}`}>
          {value >= 0 ? '+' : ''}{formatINR(value)}
        </h4>
        <span className="text-[10px] text-muted-foreground font-medium uppercase">{value >= 0 ? 'Gain' : 'Loss'}</span>
      </div>
      <div className="mt-2 h-1 w-full bg-foreground/5 rounded-full overflow-hidden">
        <div className={`h-full ${value >= 0 ? 'bg-primary' : 'bg-destructive'}`} style={{ width: '100%', opacity: 0.3 }} />
      </div>
    </div>
  );
}

export default function StocksPage() {
  const holdings = useStocksStore((s) => s.holdings);
  const deleteHolding = useStocksStore((s) => s.deleteHolding);
  const { isLoggedIn } = useAuthStore();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const totalInvested = holdings.reduce((s, h) => s + h.avgBuyPrice * h.quantity, 0);
  const totalCurrent = holdings.reduce((s, h) => s + h.currentPrice * h.quantity, 0);
  const totalGain = totalCurrent - totalInvested;
  const gainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

  const handleDelete = (id: string) => {
    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }
    deleteHolding(id);
  };

  // Chart data
  const allocationData = holdings.map((h, i) => ({
    name: h.symbol,
    value: h.currentPrice * h.quantity,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const plData = holdings.map((h) => {
    const pl = (h.currentPrice - h.avgBuyPrice) * h.quantity;
    return {
      name: h.symbol,
      pl,
      profit: pl >= 0 ? pl : 0,
      loss: pl < 0 ? Math.abs(pl) : 0,
    };
  });

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6 gpu-accelerated">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-heading font-black text-foreground tracking-tight">Stocks & Equity</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium opacity-70">Track your equity portfolio holdings.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {holdings.length > 0 && (
            <FinanceCard className="px-4 py-3 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center bg-card/40 border-border/50 gap-4 sm:gap-0">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-black opacity-60">Unrealized P&L</span>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-black tracking-tighter ${totalGain >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {totalGain >= 0 ? '+' : ''}{formatINR(totalGain)}
                </span>
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg ${totalGain >= 0 ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                  {totalGain >= 0 ? '+' : ''}{gainPct.toFixed(1)}%
                </span>
              </div>
            </FinanceCard>
          )}
          
          {/* Action Grid - Snappy Mobile Layout */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <FetchStocksDialog />
            <AddStockDialog />
          </div>
        </div>
      </div>

      {holdings.length === 0 ? (
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">No Stock Holdings</h3>
            <p className="text-sm text-muted-foreground mb-6">Import your holdings or add them manually above to start tracking.</p>
          </FinanceCard>
        </motion.div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-3 md:p-6 border-border/50">
                <span className="text-[9px] md:text-xs text-muted-foreground uppercase tracking-widest font-black">Portfolio Value</span>
                <h2 className="text-base md:text-2xl font-heading font-black mt-0.5 text-foreground tracking-tighter truncate">{formatINR(totalCurrent)}</h2>
              </FinanceCard>
            </motion.div>
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-3 md:p-6 border-border/50">
                <span className="text-[9px] md:text-xs text-muted-foreground uppercase tracking-widest font-black">Total Invested</span>
                <h2 className="text-base md:text-2xl font-heading font-black mt-0.5 text-foreground tracking-tighter truncate">{formatINR(totalInvested)}</h2>
              </FinanceCard>
            </motion.div>
            <motion.div variants={FADE_UP} className="col-span-2 md:col-span-1">
              <FinanceCard className="p-3 md:p-6 border-border/50">
                <span className="text-[9px] md:text-xs text-muted-foreground uppercase tracking-widest font-black">Holdings</span>
                <h2 className="text-base md:text-2xl font-heading font-black mt-0.5 text-foreground tracking-tighter truncate">{holdings.length} stocks</h2>
              </FinanceCard>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6">
                <h2 className="text-lg font-heading font-semibold mb-4 text-foreground">Portfolio Allocation</h2>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {allocationData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-muted-foreground">{d.name}</span>
                    </div>
                  ))}
                </div>
              </FinanceCard>
            </motion.div>

            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6">
                <h2 className="text-lg font-heading font-semibold mb-4 text-foreground">Profit & Loss per Stock</h2>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={plData} barGap={4} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
                      <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700, opacity: 0.5 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700, opacity: 0.5 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'currentColor', opacity: 0.05 }}
                        isAnimationActive={false}
                      />
                      <ReferenceLine y={0} stroke="currentColor" opacity={0.2} strokeDasharray="3 3" />
                      <Bar dataKey="pl" animationDuration={1000}>
                        {plData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={entry.pl >= 0 ? "url(#profitGrad)" : "url(#lossGrad)"} 
                            className="transition-all duration-300 md:hover:brightness-125 md:hover:filter md:hover:drop-shadow-[0_0_8px_rgba(0,255,156,0.5)]"
                          />
                        ))}
                      </Bar>
                      <defs>
                        <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00FF9C" stopOpacity={1} />
                          <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                        </linearGradient>
                        <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#FF4D4D" stopOpacity={1} />
                          <stop offset="100%" stopColor="#DC2626" stopOpacity={1} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </FinanceCard>
            </motion.div>
          </div>

          <motion.div variants={FADE_UP}>
            <FinanceCard className="w-full">
              <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-lg font-heading font-semibold text-foreground">Holdings</h2>
                <AddStockDialog />
              </div>
              <div className="overflow-x-auto h-full">
                {/* Desktop Table */}
                <table className="w-full text-left border-collapse hidden md:table">
                  <thead>
                    <tr className="border-b border-border/50 text-[10px] uppercase tracking-wider text-muted-foreground bg-foreground/5 font-bold">
                      <th className="px-6 py-4 font-bold">Stock</th>
                      <th className="px-6 py-4 font-bold">Sector</th>
                      <th className="px-6 py-4 font-bold text-right">Qty</th>
                      <th className="px-6 py-4 font-bold text-right">Avg Price</th>
                      <th className="px-6 py-4 font-bold text-right">CMP</th>
                      <th className="px-6 py-4 font-bold text-right">P&L</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {holdings.map((h) => {
                      const pl = (h.currentPrice - h.avgBuyPrice) * h.quantity;
                      const plPct = h.avgBuyPrice > 0 ? ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100 : 0;
                      return (
                        <tr key={h.id} className="md:hover:bg-foreground/5 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-sm text-foreground flex items-center gap-2">
                                {h.symbol}
                                <span className="text-[8px] px-1 py-px rounded bg-secondary/30 text-muted-foreground border border-border/50">
                                  {h.exchange}
                                </span>
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate max-w-[120px]">{h.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[10px] uppercase font-black tracking-widest text-primary/80">
                            <span className="bg-primary/5 px-2 py-1 rounded-md border border-primary/10">
                              {h.sector}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-right text-foreground font-mono">{h.quantity}</td>
                          <td className="px-6 py-4 text-sm text-right text-muted-foreground font-mono">{formatINR(h.avgBuyPrice)}</td>
                          <td className="px-6 py-4 text-sm text-right font-medium text-foreground font-mono">{formatINR(h.currentPrice)}</td>
                          <td className={`px-6 py-4 text-sm text-right font-semibold ${pl >= 0 ? 'text-primary' : 'text-red-500'}`}>
                            {pl >= 0 ? '+' : ''}{formatINR(pl)}
                            <span className="text-[10px] block font-bold">{pl >= 0 ? '+' : ''}{plPct.toFixed(1)}%</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <SellStockDialog holding={h} />
                              <EditStockDialog holding={h} />
                              <button 
                                onClick={() => handleDelete(h.id)} 
                                className="p-2 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-destructive/20 text-destructive/60 hover:text-destructive transition-all active:scale-95" 
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Mobile Card List */}
                <div className="md:hidden divide-y divide-border/10">
                  {holdings.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">
                      No holdings to display.
                    </div>
                  ) : (
                    holdings.map((h) => {
                      const pl = (h.currentPrice - h.avgBuyPrice) * h.quantity;
                      const plPct = h.avgBuyPrice > 0 ? ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100 : 0;
                      return (
                        <div key={h.id} className="p-5 active:bg-primary/5 transition-all group">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-black text-foreground truncate transition-colors">
                                  {h.symbol}
                                </h4>
                                <span className="text-[10px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                  {h.sector}
                                </span>
                              </div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate max-w-[150px]">
                                {h.name}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-base font-black tabular-nums text-foreground">
                                {formatINR(h.currentPrice * h.quantity)}
                              </div>
                              <div className={cn(
                                "text-[10px] font-black uppercase mt-1 px-2 py-0.5 rounded-lg inline-block",
                                pl >= 0 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
                              )}>
                                {pl >= 0 ? "+" : ""}{plPct.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Qty</p>
                              <p className="text-xs font-mono font-bold text-foreground">{h.quantity}</p>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Avg Price</p>
                              <p className="text-xs font-mono font-bold text-foreground">{formatINR(h.avgBuyPrice)}</p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 pt-4 border-t border-border/5">
                            <SellStockDialog holding={h} />
                            <EditStockDialog holding={h} />
                            <button 
                              onClick={() => handleDelete(h.id)} 
                              className="p-2 rounded-lg text-destructive/60 active:bg-destructive/10 transition-all active:scale-95"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </FinanceCard>
          </motion.div>
        </>
      )}
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </motion.div>
  );
}

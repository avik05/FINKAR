"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Trash2, ChevronDown, MoreVertical } from "lucide-react";
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
import { MobileStockCard } from "@/components/stocks/mobile-stock-card";
import { MobileChartCarousel } from "@/components/stocks/mobile-chart-carousel";
import { HoldingsWidget } from "@/components/stocks/holdings-widget";
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
          {/* New Unified Holdings Widget */}
          <div className="mb-6">
            <HoldingsWidget 
              holdingsCount={holdings.length} 
              totalCurrent={totalCurrent} 
              totalInvested={totalInvested} 
            />
          </div>

          {/* Charts Row - Switch to Carousel on Mobile */}
          <div className="md:hidden">
             <motion.div variants={FADE_UP}>
               <MobileChartCarousel allocationData={allocationData} plData={plData} />
             </motion.div>
          </div>

          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                <div className="hidden md:block">
                  <AddStockDialog />
                </div>
              </div>
              <div className="overflow-x-auto h-full">
                {/* Desktop Table - Refined Groww-like UI */}
                <div className="hidden md:block w-full bg-[#121212]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/10 text-[12px] font-medium text-white/60">
                        <th className="px-6 py-4 font-medium font-sans">
                          <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors w-max">
                            Company <ChevronDown size={14} className="opacity-70" />
                          </div>
                        </th>
                        <th className="px-6 py-4 font-medium font-sans text-right">
                          <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-white transition-colors">
                            Market price <ChevronDown size={14} className="opacity-70" />
                          </div>
                        </th>
                        <th className="px-6 py-4 font-medium font-sans text-right">
                          <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-white transition-colors">
                            Returns (%) <ChevronDown size={14} className="opacity-70" />
                          </div>
                        </th>
                        <th className="px-6 py-4 font-medium font-sans text-right pr-12">
                          <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-white transition-colors">
                            Current (Invested) <ChevronDown size={14} className="opacity-70" />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {holdings.map((h) => {
                        const pl = (h.currentPrice - h.avgBuyPrice) * h.quantity;
                        const plPct = h.avgBuyPrice > 0 ? ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100 : 0;
                        const isPositive = pl >= 0;
                        const currentVal = h.currentPrice * h.quantity;
                        const investedVal = h.avgBuyPrice * h.quantity;

                        return (
                          <tr key={h.id} className="hover:bg-white/5 transition-colors group relative h-20">
                            {/* Company */}
                            <td className="px-6 py-3 align-middle">
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-[15px] text-white">
                                  {h.name || h.symbol}
                                </span>
                                <span className="text-[13px] text-white/60">
                                  {h.quantity} shares • Avg. {formatINR(h.avgBuyPrice)}
                                </span>
                              </div>
                            </td>

                            {/* Market Price */}
                            <td className="px-6 py-3 align-middle text-right">
                              <div className="flex flex-col gap-1">
                                <span className="text-[15px] font-medium text-white">
                                  {formatINR(h.currentPrice)}
                                </span>
                                <span className="text-[13px] text-white/60">
                                  -
                                </span>
                              </div>
                            </td>

                            {/* Returns (%) */}
                            <td className="px-6 py-3 align-middle text-right">
                              <div className="flex flex-col gap-1">
                                <span className={cn("text-[15px] font-medium tracking-tight", isPositive ? "text-[#00FF9C]" : "text-[#FF5252]")}>
                                  {isPositive ? '+' : ''}{formatINR(pl)}
                                </span>
                                <span className={cn("text-[13px]", isPositive ? "text-[#00FF9C]" : "text-[#FF5252]")}>
                                  {isPositive ? '+' : ''}{plPct.toFixed(2)}%
                                </span>
                              </div>
                            </td>

                            {/* Current (Invested) */}
                            <td className="px-6 py-3 align-middle text-right relative">
                              <div className="flex flex-col gap-1 pr-12">
                                <span className="text-[15px] font-medium text-white">
                                  {formatINR(currentVal)}
                                </span>
                                <span className="text-[13px] font-medium text-white/90">
                                  {formatINR(investedVal)}
                                </span>
                              </div>
                              
                              {/* Hover Reveal Actions */}
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-end h-full">
                                <div className="absolute right-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-200 pointer-events-none">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/5">
                                    <MoreVertical size={16} className="text-white/40" />
                                  </div>
                                </div>
                                <div className="absolute right-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 px-2 py-2 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl">
                                  <div className="scale-90 origin-right flex items-center gap-1">
                                    <SellStockDialog holding={h} />
                                    <EditStockDialog holding={h} />
                                    <button 
                                      onClick={() => handleDelete(h.id)} 
                                      className="p-2 rounded-lg bg-white/5 hover:bg-[#FF5252]/20 text-[#FF5252] transition-colors" 
                                      title="Delete"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card List */}
                <div className="md:hidden divide-y divide-border/5 bg-foreground/[0.01]">
                  {holdings.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground text-sm">
                      No holdings to display.
                    </div>
                  ) : (
                    holdings.map((h) => (
                      <MobileStockCard 
                        key={h.id} 
                        holding={h} 
                        onDelete={handleDelete} 
                      />
                    ))
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

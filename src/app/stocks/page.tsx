"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine } from "recharts";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { useStocksStore } from "@/stores/stocks-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { AddStockDialog } from "@/components/dialogs/add-stock-dialog";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

const CHART_COLORS = ["#00FF9C", "#3ABEFF", "#FF6B6B", "#FFBE0B", "#A78BFA", "#F472B6", "#34D399", "#FB923C"];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload?: { fill?: string } }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 border border-border/50 rounded-lg px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      <p className="font-semibold text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground">{formatINR(payload[0].value)}</p>
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
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Stocks & Equity</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your equity portfolio holdings.</p>
        </div>
        <div className="flex gap-3 items-center">
          {holdings.length > 0 && (
            <FinanceCard className="px-6 py-3 flex flex-col justify-center bg-card/40 border-border/50">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Unrealized P&L</span>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${totalGain >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {totalGain >= 0 ? '+' : ''}{formatINR(totalGain)}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${totalGain >= 0 ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                  {totalGain >= 0 ? '+' : ''}{gainPct.toFixed(1)}%
                </span>
              </div>
            </FinanceCard>
          )}
          <AddStockDialog />
        </div>
      </div>

      {holdings.length === 0 ? (
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-12 text-center">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-heading font-semibold mb-2 text-foreground">No Stock Holdings</h3>
            <p className="text-sm text-muted-foreground mb-6">Add your first stock to start tracking your equity portfolio.</p>
            <AddStockDialog />
          </FinanceCard>
        </motion.div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6">
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Portfolio Value</span>
                <h2 className="text-2xl font-heading font-bold mt-1 text-foreground">{formatINR(totalCurrent)}</h2>
              </FinanceCard>
            </motion.div>
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6">
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Invested</span>
                <h2 className="text-2xl font-heading font-bold mt-1 text-foreground">{formatINR(totalInvested)}</h2>
              </FinanceCard>
            </motion.div>
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6">
                <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Holdings</span>
                <h2 className="text-2xl font-heading font-bold mt-1 text-foreground">{holdings.length} stocks</h2>
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
                    <BarChart data={plData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.7 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'currentColor', fontSize: 11, opacity: 0.7 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border) / 0.5)', borderRadius: '12px', fontSize: '12px' }}
                        formatter={((value: number, name: string) => [formatINR(value), value >= 0 ? 'Gain' : 'Loss']) as never}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <ReferenceLine y={0} stroke="currentColor" opacity={0.2} />
                      <Bar dataKey="pl">
                        {plData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.pl >= 0 ? "#00FF9C" : "#FF4D4D"} radius={entry.pl >= 0 ? [4, 4, 0, 0] as any : [0, 0, 4, 4] as any} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </FinanceCard>
            </motion.div>
          </div>

          <motion.div variants={FADE_UP}>
            <FinanceCard className="w-full">
              <div className="p-6 border-b border-border/50 flex justify-between items-center">
                <h2 className="text-lg font-heading font-semibold text-foreground">Holdings</h2>
                <AddStockDialog />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 text-[10px] uppercase tracking-wider text-muted-foreground bg-foreground/5 font-bold">
                      <th className="px-6 py-4 font-bold">Symbol</th>
                      <th className="px-6 py-4 font-bold">Company</th>
                      <th className="px-6 py-4 font-bold text-right">Qty</th>
                      <th className="px-6 py-4 font-bold text-right">Avg Price</th>
                      <th className="px-6 py-4 font-bold text-right">CMP</th>
                      <th className="px-6 py-4 font-bold text-right">P&L</th>
                      <th className="px-6 py-4 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {holdings.map((h) => {
                      const pl = (h.currentPrice - h.avgBuyPrice) * h.quantity;
                      const plPct = h.avgBuyPrice > 0 ? ((h.currentPrice - h.avgBuyPrice) / h.avgBuyPrice) * 100 : 0;
                      return (
                        <tr key={h.id} className="hover:bg-foreground/5 transition-colors group">
                          <td className="px-6 py-4 font-bold text-sm text-foreground">{h.symbol}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{h.name}</td>
                          <td className="px-6 py-4 text-sm text-right text-foreground">{h.quantity}</td>
                          <td className="px-6 py-4 text-sm text-right text-muted-foreground">{formatINR(h.avgBuyPrice)}</td>
                          <td className="px-6 py-4 text-sm text-right font-medium text-foreground">{formatINR(h.currentPrice)}</td>
                          <td className={`px-6 py-4 text-sm text-right font-semibold ${pl >= 0 ? 'text-primary' : 'text-destructive'}`}>
                            {pl >= 0 ? '+' : ''}{formatINR(pl)}
                            <span className="text-[10px] block font-bold">{pl >= 0 ? '+' : ''}{plPct.toFixed(1)}%</span>
                          </td>
                          <td className="px-6 py-4">
                            <button onClick={() => handleDelete(h.id)} className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-destructive transition-all" title="Delete">
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </FinanceCard>
          </motion.div>
        </>
      )}
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </motion.div>
  );
}

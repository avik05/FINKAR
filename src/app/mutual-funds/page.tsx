"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Target, Trash2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ReferenceLine } from "recharts";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { AddFundDialog } from "@/components/dialogs/add-fund-dialog";
import { MutualFund } from "@/types/finance";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

const CATEGORY_COLORS: Record<string, string> = {
  Equity: "#00FF9C",
  Debt: "#3ABEFF",
  Hybrid: "#FFBE0B",
  Index: "#A78BFA",
  ELSS: "#F472B6",
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card/95 border border-border/50 rounded-lg px-3 py-2 text-xs shadow-xl backdrop-blur-sm">
      <p className="font-semibold text-foreground">{payload[0].name}</p>
      <p className="text-muted-foreground">{formatINR(payload[0].value)}</p>
    </div>
  );
}

export default function MutualFundsPage() {
  const funds = useMutualFundsStore((s) => s.funds);
  const deleteFund = useMutualFundsStore((s) => s.deleteFund);
  const { isLoggedIn } = useAuthStore();
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const totalInvested = funds.reduce((acc, mf) => acc + mf.invested, 0);
  const totalValue = funds.reduce((acc, mf) => acc + mf.current, 0);
  const totalSip = funds.reduce((acc, mf) => acc + mf.sipAmount, 0);
  const totalGain = totalValue - totalInvested;

  const handleDelete = (id: string) => {
    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }
    deleteFund(id);
  };

  // Category allocation donut
  const categoryMap = new Map<string, number>();
  funds.forEach((f) => {
    categoryMap.set(f.category, (categoryMap.get(f.category) || 0) + f.current);
  });
  const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
    fill: CATEGORY_COLORS[name] || "#BFC3C9",
  }));

  // Invested vs Current comparison
  const comparisonData = funds.map((f) => ({
    name: f.fund.length > 15 ? f.fund.substring(0, 15) + "…" : f.fund,
    Invested: f.invested,
    Current: f.current,
  }));

  return (
    <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Mutual Funds & SIPs</h1>
          <p className="text-muted-foreground mt-1 text-sm">Track your mutual fund holdings and SIP investments.</p>
        </div>
        <AddFundDialog />
      </div>

      {funds.length === 0 ? (
        <motion.div variants={FADE_UP}>
          <FinanceCard className="p-12 text-center text-foreground">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-heading font-semibold mb-2">No Mutual Funds</h3>
            <p className="text-sm text-muted-foreground mb-6">Add your first mutual fund or SIP to start tracking.</p>
            <AddFundDialog />
          </FinanceCard>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20 shadow-sm shadow-blue-500/5">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-300 uppercase tracking-widest">Total Invested</span>
                <h2 className="text-2xl font-heading font-bold mt-1 text-blue-950 dark:text-blue-100">{formatINR(totalInvested)}</h2>
              </FinanceCard>
            </motion.div>
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm shadow-primary/5">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-primary uppercase tracking-widest">Current Value</span>
                <div className="flex items-center gap-2 mt-1">
                  <h2 className="text-2xl font-heading font-bold text-foreground">{formatINR(totalValue)}</h2>
                  {totalInvested > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${totalGain >= 0 ? 'bg-primary/20 text-emerald-700 dark:text-primary' : 'bg-destructive/20 text-destructive'}`}>
                      {totalGain >= 0 ? '+' : ''}{((totalGain / totalInvested) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </FinanceCard>
            </motion.div>
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Gain</span>
                <h2 className={`text-2xl font-heading font-bold mt-1 ${totalGain >= 0 ? 'text-primary' : 'text-destructive'}`}>
                  {totalGain >= 0 ? '+' : ''}{formatINR(totalGain)}
                </h2>
              </FinanceCard>
            </motion.div>
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Monthly SIP</span>
                <h2 className="text-2xl font-heading font-bold mt-1 text-foreground">{formatINR(totalSip)}</h2>
              </FinanceCard>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6">
                <h2 className="text-lg font-heading font-semibold mb-4 text-foreground">Category Allocation</h2>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={110}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        stroke="none"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-2">
                  {categoryData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="font-medium uppercase tracking-wider text-[10px]">{d.name}</span>
                    </div>
                  ))}
                </div>
              </FinanceCard>
            </motion.div>

            <motion.div variants={FADE_UP}>
              <FinanceCard className="p-6">
                <h2 className="text-lg font-heading font-semibold mb-4 text-foreground">Invested vs Current Value</h2>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonData} barGap={4}>
                      <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
                      <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.7 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.7 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                      <Tooltip
                        contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border) / 0.5)', borderRadius: '12px', fontSize: '12px' }}
                        formatter={((value: number, name: string) => [formatINR(value), name]) as never}
                        labelStyle={{ color: 'hsl(var(--foreground))' }}
                      />
                      <ReferenceLine y={0} stroke="currentColor" opacity={0.2} />
                      <Bar dataKey="Invested" fill="#3ABEFF" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Current">
                        {comparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.Current >= entry.Invested ? "#00FF9C" : "#FF4D4D"} radius={[4, 4, 0, 0] as any} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </FinanceCard>
            </motion.div>
          </div>

          <motion.div variants={FADE_UP}>
            <FinanceCard className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-heading font-semibold text-foreground">Fund Holdings</h2>
                <AddFundDialog />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {funds.map((mf) => {
                  const gain = mf.current - mf.invested;
                  return (
                    <div key={mf.id} className="p-5 rounded-2xl border border-border/50 bg-foreground/5 hover:bg-foreground/10 transition-all group relative overflow-hidden h-full">
                      <button onClick={() => handleDelete(mf.id)} className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-destructive/20 text-destructive transition-all" title="Delete fund">
                        <Trash2 size={14} />
                      </button>
                      <div className="flex justify-between items-start mb-4 pr-8">
                        <div>
                          <h4 className="font-bold text-sm leading-tight text-foreground">{mf.fund}</h4>
                          <span className="text-[10px] uppercase font-bold text-muted-foreground bg-foreground/10 px-1.5 py-0.5 rounded mt-1.5 inline-block border border-border/10 tracking-widest">{mf.category}</span>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${mf.xirr > 0 ? 'bg-primary/20 text-primary' : 'bg-destructive/20 text-destructive'}`}>
                            {mf.xirr > 0 ? `${mf.xirr}% XIRR` : `${gain >= 0 ? '+' : ''}${((gain / (mf.invested || 1)) * 100).toFixed(1)}%`}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-auto pt-4 border-t border-foreground/5">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Invested</p>
                          <p className="text-sm font-semibold text-foreground">{formatINR(mf.invested)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Current</p>
                          <p className="text-sm font-semibold text-foreground">{formatINR(mf.current)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-0.5">Monthly SIP</p>
                          <p className="text-sm font-semibold text-foreground">{formatINR(mf.sipAmount)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </FinanceCard>
          </motion.div>
        </>
      )}
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </motion.div>
  );
}

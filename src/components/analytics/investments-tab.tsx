"use client";

import React from "react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip
} from "recharts";

export function InvestmentsTab({ stats }: { stats: any }) {
  const perf = stats.portfolio;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: "Invested Value", val: formatINR(perf.totalInvested) },
          { label: "Current Value", val: formatINR(perf.totalValue) },
          { label: "Total Unrealized Gain", val: formatINR(perf.totalGain), sub: `${perf.gainPct.toFixed(1)}%` },
          { label: "Portfolio Yield", val: "14.2%", sub: "Last 12m" }
        ].map((item, i) => (
          <FinanceCard key={i} className="p-5">
            <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{item.label}</p>
            <h3 className="text-xl font-black mt-2 text-foreground">{item.val}</h3>
            {item.sub && <p className={`text-[10px] font-bold mt-1 ${item.sub.startsWith('-') ? 'text-destructive' : 'text-primary'}`}>{item.sub}</p>}
          </FinanceCard>
        ))}
      </div>

      <FinanceCard className="p-6 min-h-[400px]">
        <h3 className="font-heading font-bold mb-8">Performance Tracker</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={[
            { month: 'Jan', value: perf.totalInvested * 0.9 },
            { month: 'Feb', value: perf.totalInvested * 0.95 },
            { month: 'Mar', value: perf.totalInvested },
            { month: 'Apr', value: perf.totalValue }
          ]}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={10} axisLine={false} tickLine={false} />
            <YAxis hide />
            <RechartsTooltip 
              contentStyle={{ backgroundColor: "rgba(18, 18, 26, 0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
              formatter={(val: any) => [formatINR(Number(val))]}
            />
            <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </FinanceCard>
    </div>
  );
}

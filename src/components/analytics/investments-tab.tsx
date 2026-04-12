"use client";

import React, { useMemo } from "react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip,
  PieChart, Pie, Cell, Legend, AreaChart, Area
} from "recharts";
import { TrendingUp, TrendingDown, AlertTriangle, Trophy, Target, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const InvestmentsTab = React.memo(function InvestmentsTab({ stats }: { stats: any }) {
  const perf = stats.portfolio;
  const history = stats.historicalData || [];
  const assetMix = stats.assetMix || [];
  const risk = stats.concentrationRisk;

  const latestPerf = history.length > 0 ? history[history.length - 1] : null;
  const alpha = latestPerf ? (((latestPerf.value - latestPerf.benchmark) / latestPerf.benchmark) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6 lg:pb-10 gpu-accelerated will-change-transform">
      {/* Top Level Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        {[
          { label: "Invested", val: formatINR(perf.totalInvested), icon: Target, color: "text-blue-500" },
          { label: "Current", val: formatINR(perf.totalValue), icon: ShieldCheck, color: "text-primary" },
          { label: "Total Gain", val: formatINR(perf.totalGain), sub: `${perf.gainPct.toFixed(1)}%`, icon: TrendingUp, color: "text-primary" },
          { label: "Market Alpha", val: `${alpha}%`, sub: "vs Nifty 50", icon: Trophy, color: "text-amber-500" }
        ].map((item, i) => (
          <FinanceCard key={i} className="p-4 lg:p-6 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <item.icon size={48} />
            </div>
            <p className="text-[9px] lg:text-[10px] uppercase font-black text-muted-foreground tracking-[0.2em]">{item.label}</p>
            <h3 className="text-lg lg:text-2xl font-black mt-2 text-foreground truncate">{item.val}</h3>
            {item.sub && (
              <p className={cn(
                "text-[10px] font-bold mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full",
                item.sub.startsWith('-') ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
              )}>
                {item.sub.startsWith('-') ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
                {item.sub}
              </p>
            )}
          </FinanceCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Performance Chart */}
        <FinanceCard className="lg:col-span-2 p-6 min-h-[450px] flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-heading font-black text-xl mb-1">Performance Tracker</h3>
              <p className="text-xs text-muted-foreground font-medium italic">Your portfolio vs Nifty 50 Benchmark</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] font-black uppercase text-muted-foreground">Portfolio</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                <span className="text-[10px] font-black uppercase text-muted-foreground">Nifty 50</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="month" 
                  stroke="var(--muted-foreground)" 
                  fontSize={10} 
                  fontWeight={700}
                  axisLine={false} 
                  tickLine={false} 
                  dy={10}
                />
                <YAxis 
                   tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 700, opacity: 0.3 }} 
                   axisLine={false} 
                   tickLine={false} 
                   tickFormatter={(v) => `₹${(v/100000).toFixed(1)}L`}
                />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "rgba(18, 18, 26, 0.95)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "12px" }}
                  formatter={(val: any) => [formatINR(Number(val))]}
                  itemStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="var(--primary)" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorPortfolio)" 
                  animationDuration={1500}
                />
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="currentColor" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  opacity={0.3}
                  dot={false}
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </FinanceCard>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Asset Allocation */}
          <FinanceCard className="p-6">
            <h3 className="font-black text-sm uppercase tracking-widest mb-6">Asset Allocation</h3>
            <div className="h-[200px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetMix}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {assetMix.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity cursor-pointer" />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(val: any) => [formatINR(Number(val))]}
                    contentStyle={{ borderRadius: '12px', border: 'none', background: 'rgba(0,0,0,0.8)', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black text-muted-foreground uppercase">Equities</span>
                <span className="text-lg font-black">{((assetMix.find((a: any) => a.name === 'Equities')?.value / stats.netWorth) * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {assetMix.map((item: any) => (
                <div key={item.name} className="flex justify-between items-center text-[10px] font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground uppercase">{item.name}</span>
                  </div>
                  <span className="text-foreground">{formatINR(item.value)}</span>
                </div>
              ))}
            </div>
          </FinanceCard>

          {/* Risk Intelligence */}
          {risk && (
            <FinanceCard className={cn(
              "p-5 border-l-4",
              risk.isHigh ? "border-l-destructive bg-destructive/5" : "border-l-primary bg-primary/5"
            )}>
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-xl shrink-0",
                  risk.isHigh ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
                )}>
                  {risk.isHigh ? <AlertTriangle size={20} /> : <ShieldCheck size={20} />}
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest mb-1">
                    {risk.isHigh ? "Concentration Warning" : "Portfolio Health"}
                  </h4>
                  <p className="text-xs font-bold leading-relaxed text-foreground/80">
                    {risk.isHigh 
                      ? `${risk.name} makes up ${risk.percentage.toFixed(1)}% of your wealth. Consider diversifying.` 
                      : "Your portfolio is well diversified with no single asset exceeding 25%."}
                  </p>
                </div>
              </div>
            </FinanceCard>
          )}
        </div>
      </div>
    </div>
  );
});

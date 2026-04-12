"use client";

import React from "react";
import { Clock, Flame, Percent, Info, Activity } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR, formatINRCompact } from "@/lib/format";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip
} from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from "@/components/ui/tooltip";

export const SpendingTab = React.memo(function SpendingTab({ stats }: { stats: any }) {
  const COLORS = ["#00FF9C", "#60A5FA", "#F59E0B", "#EF4444", "#A855F7", "#EC4899"];

  const kpis = [
    { 
      title: "Financial Runway", 
      value: `${stats.runway.toFixed(1)} Months`, 
      icon: Clock, 
      color: "text-blue-500", 
      info: "How many months you can sustain your current lifestyle if your income stops today."
    },
    { 
      title: "Monthly Burn", 
      value: formatINR(stats.burn.monthly), 
      icon: Flame, 
      color: "text-orange-500", 
      info: "Your average monthly cash outflow (maintenance cost of lifestyle)."
    },
    { 
      title: "Savings Rate", 
      value: `${stats.savingsRate.toFixed(1)}%`, 
      icon: Percent, 
      color: "text-amber-500", 
      info: "The percentage of your income kept after all expenses."
    },
  ];

  return (
    <div className="space-y-6">
      {/* High-Level Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <FinanceCard key={kpi.title} className="p-4 flex flex-col justify-between hover:border-primary/30 transition-all cursor-default">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-1.5 rounded-lg bg-foreground/5 ${kpi.color}`}>
                <kpi.icon size={16} />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="text-muted-foreground/30 hover:text-primary transition-colors cursor-help">
                      <Info size={12} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[180px] text-[10px] p-2 bg-background border border-border shadow-xl">
                    {kpi.info}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-wider font-black text-muted-foreground">{kpi.title}</p>
              <h3 className={`text-lg font-black mt-0.5 ${kpi.color}`}>{kpi.value}</h3>
            </div>
          </FinanceCard>
        ))}
      </div>

      {/* Spending Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinanceCard className="p-6 min-h-[450px]">
          <h3 className="font-heading font-bold mb-6">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                {...({
                  data: stats.spendingCategories,
                  innerRadius: 80,
                  outerRadius: 110,
                  paddingAngle: 5,
                  dataKey: "value",
                  animationDuration: 1000
                } as any)}
              >
                {stats.spendingCategories.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <RechartsTooltip 
                contentStyle={{ backgroundColor: "rgba(18, 18, 26, 0.8)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                formatter={(val: any) => [formatINR(Number(val))]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-y-3 mt-4">
            {stats.spendingCategories.slice(0, 6).map((cat: any, index: number) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-muted-foreground truncate">{cat.name}</span>
                <span className="font-bold ml-auto pr-4">{formatINRCompact(cat.value)}</span>
              </div>
            ))}
          </div>
        </FinanceCard>

        <FinanceCard className="p-6">
          <h3 className="font-heading font-bold mb-1">Burn Analysis</h3>
          <p className="text-xs text-muted-foreground mb-8">Average daily spend: {formatINRCompact(stats.burn.daily)}</p>
          
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-border/50">
              <h4 className="text-[10px] uppercase tracking-widest font-black text-muted-foreground mb-3">Top Leaks</h4>
              <div className="space-y-4">
                {stats.spendingCategories.slice(0, 3).map((cat: any) => (
                  <div key={cat.name} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>{cat.name}</span>
                      <span>{formatINR(cat.value)}</span>
                    </div>
                    <div className="h-1.5 w-full bg-foreground/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary" 
                        style={{ width: `${(cat.value / (stats.spendingCategories[0]?.value || 1)) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-5 rounded-2xl bg-primary/[0.03] border border-primary/10">
              <div className="flex items-center gap-3">
                <Activity className="text-primary" size={24} />
                <div>
                  <h4 className="text-sm font-bold">Spending Efficiency</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">Your current burn rate suggests you can save {formatINRCompact(stats.burn.monthly * 0.15)} more per month with minor optimizations.</p>
                </div>
              </div>
            </div>
          </div>
        </FinanceCard>
      </div>
    </div>
  );
});

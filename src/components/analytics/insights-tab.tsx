"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Landmark, Clock, Flame, Percent, Info, Target, Zap 
} from "lucide-react";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR, formatINRCompact } from "@/lib/format";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Sector
} from "recharts";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

function InsightItem({ icon: Icon, title, desc, urgent }: any) {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${urgent ? 'bg-destructive/5 border-destructive/20' : 'bg-foreground/[0.02] border-border/50'}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={urgent ? 'text-destructive' : 'text-primary'} />
        <span className="text-xs font-black uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-[10px] leading-normal text-muted-foreground font-medium">{desc}</p>
    </div>
  );
}

export function InsightsTab({ stats }: { stats: any }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const kpis = [
    { 
      title: "Net Worth", 
      value: formatINR(stats.netWorth), 
      icon: Landmark, 
      color: "text-primary", 
      label: "Assets + Cash",
      info: "The total value of everything you own (Cash + Investments) minus any debts. It's the ultimate measure of your current wealth."
    },
    { 
      title: "Financial Runway", 
      value: `${stats.runway.toFixed(1)} Months`, 
      icon: Clock, 
      color: "text-blue-500", 
      label: "Survival based on liquidity",
      info: "How many months you can sustain your current lifestyle if your income stops today, based on your liquid cash reserves."
    },
    { 
      title: "Monthly Burn", 
      value: formatINR(stats.burn.monthly), 
      icon: Flame, 
      color: "text-orange-500", 
      label: "Avg monthly spending",
      info: "Your average monthly cash outflow. This represents the 'maintenance cost' of your lifestyle and determines how fast you use your cash."
    },
    { 
      title: "Savings Rate", 
      value: `${stats.savingsRate.toFixed(1)}%`, 
      icon: Percent, 
      color: "text-amber-500", 
      label: "This month's efficiency",
      info: "The percentage of your income that you keep after all expenses. A higher savings rate is the fastest way to achieve financial independence."
    },
  ];

  const allocationData = [
    { name: 'Liquid Cash', value: stats.cash, color: 'var(--primary)', gradient: 'url(#cashGrad)' },
    { name: 'Direct Equity', value: stats.stocksValue, color: '#60A5FA', gradient: 'url(#equityGrad)' },
    { name: 'Mutual Funds', value: stats.fundsValue, color: '#A855F7', gradient: 'url(#mfGrad)' }
  ].filter(d => d.value > 0);

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 8}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          style={{ filter: `drop-shadow(0 0 8px ${fill})` }}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 12}
          outerRadius={outerRadius + 14}
          fill={fill}
        />
      </g>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <motion.div key={kpi.title} variants={FADE_UP}>
            <FinanceCard className="p-5 h-full flex flex-col justify-between hover:border-primary/30 transition-all cursor-default relative overflow-visible">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl bg-foreground/5 ${kpi.color}`}>
                  <kpi.icon size={20} />
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="text-muted-foreground/40 hover:text-primary transition-colors p-1 cursor-help">
                        <Info size={14} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-[200px] text-center p-3 font-medium bg-background/95 backdrop-blur-md border border-border shadow-2xl text-foreground">
                      {kpi.info}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground">{kpi.title}</p>
                <h3 className={`text-xl md:text-2xl font-black mt-1 ${kpi.color}`}>{kpi.value}</h3>
                <p className="text-[10px] text-muted-foreground mt-1 truncate">{kpi.label}</p>
              </div>
            </FinanceCard>
          </motion.div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FinanceCard className="lg:col-span-2 p-6 h-[400px] relative overflow-hidden group">
           <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-heading font-bold">Asset Allocation</h3>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Portfolio breakdown</p>
              </div>
              {activeIndex !== null && (
                <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="text-right">
                  <p className="text-[10px] font-black text-primary uppercase">{allocationData[activeIndex].name}</p>
                  <p className="text-sm font-bold">{((allocationData[activeIndex].value / stats.netWorth) * 100).toFixed(1)}%</p>
                </motion.div>
              )}
           </div>

           <div className="relative h-[280px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <defs>
                   <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="var(--primary)" stopOpacity={1}/>
                     <stop offset="100%" stopColor="#059669" stopOpacity={1}/>
                   </linearGradient>
                   <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#60A5FA" stopOpacity={1}/>
                     <stop offset="100%" stopColor="#2563EB" stopOpacity={1}/>
                   </linearGradient>
                   <linearGradient id="mfGrad" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="0%" stopColor="#A855F7" stopOpacity={1}/>
                     <stop offset="100%" stopColor="#7C3AED" stopOpacity={1}/>
                   </linearGradient>
                 </defs>
                  <Pie
                    {...({
                      activeIndex: activeIndex !== null ? activeIndex : undefined,
                      activeShape: renderActiveShape,
                      data: allocationData,
                      cx: "50%",
                      cy: "50%",
                      innerRadius: 75,
                      outerRadius: 100,
                      dataKey: "value",
                      onMouseEnter: (_: any, index: number) => setActiveIndex(index),
                      onMouseLeave: () => setActiveIndex(null),
                      stroke: "none",
                      paddingAngle: 5,
                      animationBegin: 0,
                      animationDuration: 1500
                    } as any)}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.gradient} />
                    ))}
                  </Pie>
               </PieChart>
             </ResponsiveContainer>
             
             {/* Central Content */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
               <motion.div
                 animate={{ scale: activeIndex !== null ? 1.05 : 1 }}
                 className="space-y-0.5"
               >
                 <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                   {activeIndex !== null ? allocationData[activeIndex].name : "Net Worth"}
                 </p>
                 <h4 className="text-xl md:text-2xl font-black text-foreground">
                   {activeIndex !== null ? formatINRCompact(allocationData[activeIndex].value) : formatINRCompact(stats.netWorth)}
                 </h4>
                 {activeIndex === null && (
                   <p className="text-[10px] text-primary font-bold">↑ Active Balance</p>
                 )}
               </motion.div>
             </div>
           </div>

           <div className="flex justify-center gap-6 mt-4">
             {allocationData.map((item, i) => (
               <div 
                key={i} 
                className={`flex items-center gap-2 cursor-pointer transition-all ${activeIndex === i ? 'scale-110 opacity-100' : 'opacity-60 hover:opacity-100'}`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
               >
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                 <span className="text-[10px] font-bold uppercase tracking-wider">{item.name}</span>
               </div>
             ))}
           </div>
        </FinanceCard>
        
        <FinanceCard className="p-6 h-[400px] bg-gradient-to-br from-primary/[0.02] to-transparent">
          <h3 className="font-heading font-bold mb-2">Alpha Insights</h3>
          <p className="text-xs text-muted-foreground mb-6 italic">Derived from your financial patterns</p>
          
          <div className="space-y-4">
            <InsightItem 
              icon={Target} 
              title="Runway Health" 
              desc={stats.runway > 6 ? "Expertly balanced. You have over 6 months of buffer." : "Consider building a larger cash buffer for safety."}
              urgent={stats.runway < 3}
            />
            <InsightItem 
              icon={Zap} 
              title="Savings Pulse" 
              desc={stats.savingsRate > 30 ? "High efficiency! Your savings rate is above average." : "Try reducing discretionary spending to boost savings."}
              urgent={stats.savingsRate < 10}
            />
          </div>
        </FinanceCard>
      </div>
    </div>
  );
}

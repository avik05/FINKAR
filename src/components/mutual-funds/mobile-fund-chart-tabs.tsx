"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ReferenceLine, 
  Tooltip, 
  CartesianGrid 
} from "recharts";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MobileMutualFundChartTabsProps {
  categoryData: any[];
  comparisonData: any[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background/90 backdrop-blur-xl border border-primary/20 rounded-2xl p-3 shadow-2xl min-w-[140px] z-50">
      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 truncate max-w-[120px]">{label}</p>
      <div className="space-y-1">
        {payload.map((p, i) => (
          <div key={i} className="flex justify-between items-center gap-2 text-[10px] font-bold">
            <span className="text-muted-foreground uppercase opacity-70">{p.name}</span>
            <span className={p.name === 'Current' ? (p.value >= (payload[0]?.value || 0) ? 'text-primary' : 'text-destructive') : 'text-foreground'}>
              {formatINR(p.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobileMutualFundChartTabs({ categoryData, comparisonData }: MobileMutualFundChartTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      id: "allocation",
      label: "Allocation",
      component: (
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
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
      )
    },
    {
      id: "performance",
      label: "Performance",
      component: (
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} barGap={4} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'currentColor', fontSize: 8, fontWeight: 700, opacity: 0.5 }} 
                axisLine={false} 
                tickLine={false} 
              />
              <YAxis 
                tick={{ fill: 'currentColor', fontSize: 8, fontWeight: 700, opacity: 0.5 }} 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} isAnimationActive={false} />
              <ReferenceLine y={0} stroke="currentColor" opacity={0.2} strokeDasharray="3 3" />
              <Bar dataKey="Invested" fill="#3ABEFF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Current" radius={[4, 4, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.Current >= entry.Invested ? "#00FF9C" : "#FF4D4D"} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }
  ];

  return (
    <FinanceCard className="relative overflow-hidden">
      <div className="p-5">
        {/* Segmented Control Tabs */}
        <div className="flex p-1 bg-foreground/5 rounded-2xl mb-6 relative">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(idx)}
              className={cn(
                "relative flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-colors z-10",
                activeTab === idx ? "text-background dark:text-black" : "text-muted-foreground"
              )}
            >
              {tab.label}
              {activeTab === idx && (
                <motion.div
                  layoutId="activeFundTab"
                  className="absolute inset-0 bg-primary rounded-xl -z-10 shadow-[0_0_15px_rgba(0,255,156,0.3)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="relative h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center pt-2"
            >
              {tabs[activeTab].component}
              
              {activeTab === 0 && (
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-4 max-h-[50px] overflow-y-auto px-4 scrollbar-hide">
                  {categoryData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-muted-foreground font-bold uppercase tracking-tight">{d.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </FinanceCard>
  );
}

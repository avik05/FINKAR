"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, ReferenceLine, Tooltip, CartesianGrid } from "recharts";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MobileChartCarouselProps {
  allocationData: any[];
  plData: any[];
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  const value = payload[0].value;
  return (
    <div className="bg-background/90 backdrop-blur-xl border border-primary/20 rounded-2xl p-3 shadow-2xl min-w-[140px] z-50">
      <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{label}</p>
      <h4 className={`text-xs font-bold ${value >= 0 ? 'text-primary' : 'text-destructive'}`}>
        {value >= 0 ? '+' : ''}{formatINR(value)}
      </h4>
    </div>
  );
}

export function MobileChartCarousel({ allocationData, plData }: MobileChartCarouselProps) {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: "allocation",
      title: "Portfolio Allocation",
      component: (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={allocationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
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
      )
    },
    {
      id: "pl",
      title: "Profit & Loss",
      component: (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={plData} barGap={4} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.05} />
              <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 8, fontWeight: 700, opacity: 0.5 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'currentColor', fontSize: 8, fontWeight: 700, opacity: 0.5 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'currentColor', opacity: 0.05 }} isAnimationActive={false} />
              <ReferenceLine y={0} stroke="currentColor" opacity={0.2} strokeDasharray="3 3" />
              <Bar dataKey="pl">
                {plData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.pl >= 0 ? "url(#mobProfitGrad)" : "url(#mobLossGrad)"} 
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="mobProfitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00FF9C" stopOpacity={1} />
                  <stop offset="100%" stopColor="#059669" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="mobLossGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4D4D" stopOpacity={1} />
                  <stop offset="100%" stopColor="#DC2626" stopOpacity={1} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    }
  ];

  return (
    <FinanceCard className="relative overflow-hidden group">
      <div className="p-5">
        {/* Segmented Control Tabs */}
        <div className="flex p-1 bg-foreground/5 rounded-2xl mb-6 relative">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(idx)}
              className={cn(
                "relative flex-1 py-2 text-[10px] font-black uppercase tracking-wider transition-colors z-10",
                activeSlide === idx ? "text-background dark:text-black" : "text-muted-foreground"
              )}
            >
              {slide.title.replace("Portfolio ", "").replace("per Stock", "")}
              {activeSlide === idx && (
                <motion.div
                  layoutId="activeTab"
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
              key={activeSlide}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center pt-2"
            >
              {slides[activeSlide].component}
              
              {activeSlide === 0 && (
                <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5 mt-4 max-h-[40px] overflow-y-auto px-4 scrollbar-hide">
                  {allocationData.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[9px]">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-muted-foreground font-bold uppercase">{d.name}</span>
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

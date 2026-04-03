"use client";

import React, { useMemo } from "react";
import { format, subDays, startOfWeek } from "date-fns";
import { useTransactionsStore } from "@/stores/transactions-store";

export function TransactionHeatmap() {
  const transactions = useTransactionsStore((s) => s.transactions);

  // Generate last 364 days to make 52 weeks of 7 days
  const days = useMemo(() => {
    const today = new Date();
    const lastYear = Array.from({ length: 364 }, (_, i) => {
      const d = subDays(today, 363 - i);
      return format(d, "yyyy-MM-dd");
    });

    // Map transaction counts to days
    const activityMap: Record<string, number> = {};
    transactions.forEach(tx => {
      const dateKey = tx.date.split("T")[0]; // Assuming ISO string
      activityMap[dateKey] = (activityMap[dateKey] || 0) + 1;
    });

    return lastYear.map(date => {
      const count = activityMap[date] || Math.floor(Math.random() * 0.5); // Add slight random noise for demo visually if extremely empty
      let intensity = 0;
      if (count > 0) intensity = 1;
      if (count > 2) intensity = 2;
      if (count > 4) intensity = 3;
      if (count > 6) intensity = 4;
      
      return { date, count, intensity };
    });
  }, [transactions]);

  // Group into weeks for column-based CSS grid
  const weeks = useMemo(() => {
    const result = [];
    for (let i = 0; i < days.length; i += 7) {
      result.push(days.slice(i, i + 7));
    }
    return result;
  }, [days]);

  return (
    <div className="w-full overflow-x-auto no-scrollbar py-4">
      <div className="min-w-max flex gap-1 items-end">
        {/* Days of week labels */}
        <div className="flex flex-col gap-1 pr-2 text-[10px] text-muted-foreground/60 pb-[20px]">
          <span className="h-3 flex items-center">Mon</span>
          <span className="h-3 flex items-center">Wed</span>
          <span className="h-3 flex items-center">Fri</span>
        </div>
        
        {/* Heatmap Grid */}
        <div className="flex gap-1">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1 relative group/col">
              {/* Optional month label for first week of month */}
              {week[0].date.endsWith("-01") && (
                 <span className="absolute -top-5 text-[10px] text-muted-foreground/60 truncate">
                   {format(new Date(week[0].date), "MMM")}
                 </span>
              )}
              {week.map((day, dIdx) => (
                <div 
                  key={day.date} 
                  className={`w-3 h-3 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer z-10 relative
                    ${day.intensity === 0 ? 'bg-secondary/30 border border-border/20' : ''}
                    ${day.intensity === 1 ? 'bg-primary/30 shadow-[0_0_4px_rgba(0,255,156,0.2)]' : ''}
                    ${day.intensity === 2 ? 'bg-primary/60 shadow-[0_0_6px_rgba(0,255,156,0.3)]' : ''}
                    ${day.intensity === 3 ? 'bg-primary/80 shadow-[0_0_8px_rgba(0,255,156,0.4)]' : ''}
                    ${day.intensity === 4 ? 'bg-primary shadow-[0_0_12px_rgba(0,255,156,0.8)]' : ''}
                  `}
                  title={`${day.date}: ${day.count} transactions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-secondary/30 border border-border/20"></div>
          <div className="w-3 h-3 rounded-sm bg-primary/30"></div>
          <div className="w-3 h-3 rounded-sm bg-primary/60"></div>
          <div className="w-3 h-3 rounded-sm bg-primary/80"></div>
          <div className="w-3 h-3 rounded-sm bg-primary shadow-[0_0_8px_rgba(0,255,156,0.5)]"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
}

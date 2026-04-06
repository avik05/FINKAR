"use client";

import React, { useMemo } from "react";
import { format, subDays, parseISO, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useTransactionsStore } from "@/stores/transactions-store";
import { formatINR, formatINRCompact } from "@/lib/format";
import { EditTransactionDialog } from "@/components/dialogs/edit-transaction-dialog";

const CELL = 12;  // px
const GAP  = 3;   // px
const DAY_LABEL_W = 28; // px

export function TransactionHeatmap() {
  const transactions = useTransactionsStore((s) => s.transactions);
  const [hoveredIntensity, setHoveredIntensity] = React.useState<number | null>(null);
  const [selectedDay, setSelectedDay] = React.useState<any | null>(null);
  const [hoveredDay, setHoveredDay] = React.useState<any | null>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  // Build a 52-week x 7-day grid (364 days, oldest first)
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();

    // Activity map
    const activityMap: Record<string, number> = {};
    transactions.forEach((tx) => {
      const dateKey = tx.date.split("T")[0];
      activityMap[dateKey] = (activityMap[dateKey] || 0) + 1;
    });

    // Build 364-day array (oldest → newest), padded so the first cell is always Monday
    const days: { date: string; count: number; total: number; intensity: number; txs: any[] }[] = [];
    for (let i = 363; i >= 0; i--) {
      const d = subDays(today, i);
      const dateKey = format(d, "yyyy-MM-dd");
      
      const dayTxs = transactions.filter(t => t.date.split("T")[0] === dateKey);
      const count = dayTxs.length;
      const total = dayTxs.reduce((s, t) => s + Math.abs(t.amount), 0);
      
      let intensity = 0;
      if (count > 0) intensity = 1;
      if (count > 2) intensity = 2;
      if (count > 4) intensity = 3;
      if (count > 6) intensity = 4;
      
      days.push({ 
        date: dateKey, 
        count, 
        total,
        intensity,
        txs: dayTxs 
      });
    }

    // Group into weeks of 7
    const weeks: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    // Compute month labels: for each week, if any day is the 1st → label that column
    const monthLabels: { colIndex: number; label: string }[] = [];
    weeks.forEach((week, wIdx) => {
      week.forEach((day) => {
        if (day.date.endsWith("-01")) {
          // Avoid duplicate months
          const label = format(new Date(day.date + "T00:00:00"), "MMM");
          if (!monthLabels.find((m) => m.label === label)) {
            monthLabels.push({ colIndex: wIdx, label });
          }
        }
      });
    });

    return { weeks, monthLabels };
  }, [transactions]);

  const totalW = weeks.length * (CELL + GAP) - GAP;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ 
      x: e.clientX - rect.left, 
      y: e.clientY - rect.top 
    });
  };

  return (
    <div className="w-full relative group" onMouseMove={handleMouseMove}>
      <div className="w-full overflow-x-auto no-scrollbar pb-2">
        <div style={{ minWidth: DAY_LABEL_W + totalW + 8 }} className="relative px-2">

          {/* ── Month labels row ── */}
          <div
            className="relative mb-1"
            style={{ height: 16, marginLeft: DAY_LABEL_W + 4 }}
          >
            {monthLabels.map(({ colIndex, label }) => (
              <span
                key={label}
                className="absolute text-[10px] font-black text-muted-foreground/60 leading-none pointer-events-none -translate-x-1/2 uppercase tracking-tighter"
                style={{ left: colIndex * (CELL + GAP) + (CELL / 2) }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* ── Grid + day labels ── */}
          <div className="flex" style={{ gap: 0 }}>
            {/* Day-of-week labels — 7 rows */}
            <div
              className="flex flex-col text-[10px] text-muted-foreground/60 shrink-0 font-bold"
              style={{ width: DAY_LABEL_W, gap: GAP, paddingRight: 4 }}
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <span
                  key={d}
                  style={{ height: CELL, lineHeight: `${CELL}px` }}
                  className={i % 2 === 0 ? "opacity-100" : "opacity-0 select-none"}
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Heatmap columns */}
            <div className="flex" style={{ gap: GAP }}>
              {weeks.map((week, wIdx) => (
                <motion.div 
                  key={wIdx} 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: wIdx * 0.02 }}
                  className="flex flex-col" 
                  style={{ gap: GAP }}
                >
                  {week.map((day) => {
                    const isSelected = selectedDay?.date === day.date;
                    const isHighlighted = hoveredIntensity !== null && day.intensity === hoveredIntensity;
                    
                    return (
                      <motion.div
                        key={day.date}
                        onMouseEnter={() => setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        onClick={() => setSelectedDay(selectedDay?.date === day.date ? null : day)}
                        animate={{ 
                          scale: isSelected ? 1.4 : isHighlighted ? 1.2 : 1,
                          zIndex: isSelected ? 10 : isHighlighted ? 5 : 0
                        }}
                        style={{ 
                          width: CELL, 
                          height: CELL,
                          borderRadius: '2px',
                        }}
                        className={[
                          "transition-colors duration-200 cursor-pointer",
                          day.intensity === 0 && "bg-secondary/30",
                          day.intensity === 1 && "bg-primary/20",
                          day.intensity === 2 && "bg-primary/40",
                          day.intensity === 3 && "bg-primary/70",
                          day.intensity === 4 && "bg-primary shadow-[0_0_10px_rgba(0,255,156,0.5)]",
                          isHighlighted && "ring-1 ring-primary brightness-125 z-10",
                          isSelected && "ring-2 ring-primary brightness-150 z-20"
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Legend ── */}
          <div className="mt-4 flex items-center justify-end gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            <span>Less</span>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div 
                  key={level} 
                  style={{ width: CELL, height: CELL }} 
                  onMouseEnter={() => setHoveredIntensity(level)}
                  onMouseLeave={() => setHoveredIntensity(null)}
                  className={`rounded-sm transition-all cursor-pointer hover:scale-125 ${
                    level === 0 ? "bg-secondary/30" : 
                    level === 1 ? "bg-primary/20" : 
                    level === 2 ? "bg-primary/40" : 
                    level === 3 ? "bg-primary/70" : 
                    "bg-primary shadow-[0_0_8px_rgba(0,255,156,0.4)]"
                  }`} 
                />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
      </div>

      {/* ── Floating Tooltip ── */}
      <AnimatePresence>
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ 
              position: 'absolute',
              top: mousePos.y - 80,
              left: mousePos.x + 10,
              zIndex: 100,
              pointerEvents: 'none'
            }}
            className="p-3 bg-background/90 backdrop-blur-xl border border-primary/20 rounded-xl shadow-2xl min-w-[140px]"
          >
            <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">
              {format(parseISO(hoveredDay.date), "EEEE")}
            </p>
            <h4 className="text-xs font-bold text-foreground mb-2">
              {format(parseISO(hoveredDay.date), "dd MMM yyyy")}
            </h4>
            <div className="flex justify-between items-center bg-foreground/5 rounded-lg p-1.5 border border-border/50">
              <span className="text-[10px] font-medium text-muted-foreground">{hoveredDay.count} Txs</span>
              <span className="text-[10px] font-black text-foreground">{formatINRCompact(hoveredDay.total)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Day Inspector ── */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-6"
          >
            <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-border/50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-black uppercase tracking-widest text-primary">
                  Activity on {format(parseISO(selectedDay.date), "dd MMM")}
                </h4>
                <button onClick={() => setSelectedDay(null)} className="text-[10px] font-bold text-muted-foreground hover:text-foreground">Close</button>
              </div>
              <div className="space-y-2">
                {selectedDay.txs.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No transactions recorded for this day.</p>
                ) : (
                  selectedDay.txs.slice(0, 5).map((tx: any) => (
                    <div key={tx.id} className="flex justify-between items-center p-2.5 rounded-xl bg-background/50 border border-border/30">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-foreground">{tx.merchant}</span>
                        <span className="text-[10px] text-muted-foreground">{tx.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-black ${tx.amount > 0 ? "text-primary" : "text-foreground"}`}>
                          {tx.amount > 0 ? "+" : ""}{formatINR(tx.amount)}
                        </span>
                        <EditTransactionDialog transaction={tx} />
                      </div>
                    </div>
                  ))
                )}
                {selectedDay.txs.length > 5 && (
                  <p className="text-[10px] text-center text-muted-foreground mt-2">+ {selectedDay.txs.length - 5} more transactions</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


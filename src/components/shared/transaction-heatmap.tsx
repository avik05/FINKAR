"use client";

import React, { useMemo } from "react";
import { format, subDays } from "date-fns";
import { useTransactionsStore } from "@/stores/transactions-store";

const CELL = 12;  // px
const GAP  = 3;   // px
const DAY_LABEL_W = 28; // px

export function TransactionHeatmap() {
  const transactions = useTransactionsStore((s) => s.transactions);

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
    const days: { date: string; count: number; intensity: number }[] = [];
    for (let i = 363; i >= 0; i--) {
      const d = subDays(today, i);
      const dateKey = format(d, "yyyy-MM-dd");
      const count = activityMap[dateKey] || 0;
      let intensity = 0;
      if (count > 0) intensity = 1;
      if (count > 2) intensity = 2;
      if (count > 4) intensity = 3;
      if (count > 6) intensity = 4;
      days.push({ date: dateKey, count, intensity });
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

  return (
    <div className="w-full overflow-x-auto no-scrollbar">
      <div style={{ minWidth: DAY_LABEL_W + totalW + 8 }} className="relative">

        {/* ── Month labels row ── */}
        <div
          className="relative mb-1"
          style={{ height: 16, marginLeft: DAY_LABEL_W + 4 }}
        >
          {monthLabels.map(({ colIndex, label }) => (
            <span
              key={label}
              className="absolute text-[10px] font-medium text-muted-foreground leading-none pointer-events-none -translate-x-1/2"
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
            className="flex flex-col text-[10px] text-muted-foreground/60 shrink-0"
            style={{ width: DAY_LABEL_W, gap: GAP, paddingRight: 4 }}
          >
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <span
                key={d}
                style={{ height: CELL, lineHeight: `${CELL}px` }}
                className={d === "Tue" || d === "Thu" || d === "Sat" || d === "Sun" ? "opacity-0 select-none" : ""}
              >
                {d}
              </span>
            ))}
          </div>

          {/* Heatmap columns */}
          <div className="flex" style={{ gap: GAP }}>
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col" style={{ gap: GAP }}>
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} transaction${day.count !== 1 ? "s" : ""}`}
                    style={{ width: CELL, height: CELL }}
                    className={[
                      "rounded-sm transition-all duration-200 hover:scale-125 cursor-pointer",
                      day.intensity === 0 && "bg-secondary/30 border border-border/20",
                      day.intensity === 1 && "bg-primary/30 shadow-[0_0_4px_rgba(0,255,156,0.2)]",
                      day.intensity === 2 && "bg-primary/60 shadow-[0_0_6px_rgba(0,255,156,0.3)]",
                      day.intensity === 3 && "bg-primary/80 shadow-[0_0_8px_rgba(0,255,156,0.4)]",
                      day.intensity === 4 && "bg-primary shadow-[0_0_12px_rgba(0,255,156,0.8)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Legend ── */}
        <div className="mt-3 flex items-center justify-end gap-2 text-[10px] text-muted-foreground">
          <span>Less</span>
          {[
            "bg-secondary/30 border border-border/20",
            "bg-primary/30",
            "bg-primary/60",
            "bg-primary/80",
            "bg-primary shadow-[0_0_8px_rgba(0,255,156,0.5)]",
          ].map((cls, i) => (
            <div key={i} style={{ width: CELL, height: CELL }} className={`rounded-sm ${cls}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}


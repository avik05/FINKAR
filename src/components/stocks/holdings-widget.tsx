"use client";

import React, { useState } from "react";
import { Eye, EyeOff, BarChart2, MoreVertical, ChevronDown } from "lucide-react";
import { formatINR } from "@/lib/format";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface HoldingsWidgetProps {
  holdingsCount: number;
  totalCurrent: number;
  totalInvested: number;
}

export function HoldingsWidget({ holdingsCount, totalCurrent, totalInvested }: HoldingsWidgetProps) {
  const [showBalances, setShowBalances] = useState(true);

  const totalGain = totalCurrent - totalInvested;
  const gainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  const isPositive = totalGain >= 0;

  // Mask function
  const renderValue = (val: number, formatted: string) => {
    return showBalances ? formatted : "••••••";
  };

  const renderGain = (val: number, formatted: string, pct: number) => {
    if (!showBalances) return "••••••";
    return `${val >= 0 ? '+' : ''}${formatted} (${val >= 0 ? '+' : ''}${pct.toFixed(2)}%)`;
  };

  return (
    <div className="w-full font-sans tracking-tight">
      
      {/* =======================================================================
          MOBILE VIEW (Matches Screenshot 1)
          ======================================================================= */}
      <div className="block md:hidden">
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-5 shadow-lg">
          
          {/* Header Row */}
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center gap-1.5 text-white/70 hover:text-white cursor-pointer transition-colors">
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase">Holdings ({holdingsCount})</span>
              <ChevronDown size={14} className="opacity-70" />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowBalances(!showBalances)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/80"
              >
                {showBalances ? <Eye size={14} /> : <EyeOff size={14} />}
              </button>
              
              <Link href="/analytics" className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/80">
                <BarChart2 size={14} />
              </Link>

              <button 
                onClick={() => alert("More options coming soon!")}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/80"
              >
                <MoreVertical size={14} />
              </button>
            </div>
          </div>

          {/* Current Value */}
          <div className="mb-5">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {renderValue(totalCurrent, formatINR(totalCurrent))}
            </h1>
          </div>

          {/* Separator */}
          <div className="w-full h-px border-b border-dashed border-white/10 mb-5"></div>

          {/* Metrics Rows */}
          <div className="space-y-4">
            {/* 1D Returns (Hidden until backend support) */}
            {/* 
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-white/60">1D returns</span>
              <span className="text-[13px] font-medium text-[#FF4D4D]">-₹69.31 (1.07%)</span>
            </div> 
            */}

            {/* Total Returns */}
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-white/60">Total returns</span>
              <span className={cn(
                "text-[13px] font-medium",
                isPositive ? "text-[#00FF9C]" : "text-[#FF5252]"
              )}>
                {renderGain(totalGain, formatINR(Math.abs(totalGain)), Math.abs(gainPct))}
              </span>
            </div>

            {/* Invested */}
            <div className="flex justify-between items-center">
              <span className="text-[13px] text-white/60">Invested</span>
              <span className="text-[13px] font-medium text-white">
                {renderValue(totalInvested, formatINR(totalInvested))}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =======================================================================
          DESKTOP VIEW (Matches Screenshot 2)
          ======================================================================= */}
      <div className="hidden md:block">
        
        {/* Top Floating Header */}
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-1.5 text-white cursor-pointer hover:opacity-80 transition-opacity">
            <h2 className="text-xl font-bold">Holdings ({holdingsCount})</h2>
            <ChevronDown size={20} className="opacity-70 mt-0.5" />
          </div>
          
          <button 
            onClick={() => setShowBalances(!showBalances)}
            className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/80"
          >
            {showBalances ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>

        {/* The Card */}
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 shadow-lg">
          
          {/* Card Top Row */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-white/60 mb-1">Current value</p>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {renderValue(totalCurrent, formatINR(Math.round(totalCurrent)))}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/analytics" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-sm font-semibold text-white">
                <BarChart2 size={16} />
                <span>Analyse</span>
              </Link>
              
              <button 
                onClick={() => alert("More options coming soon!")}
                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors text-white/80"
              >
                <MoreVertical size={16} />
              </button>
            </div>
          </div>

          {/* Separator */}
          <div className="w-full h-px border-b border-dashed border-white/10 mb-6"></div>

          {/* Card Bottom Row */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-[13px] text-white/60 mb-1.5">Invested value</p>
              <p className="text-base font-medium text-white">
                {renderValue(totalInvested, formatINR(Math.round(totalInvested)))}
              </p>
            </div>

            <div>
              {/* 1D Returns (Hidden until backend support) */}
              {/* 
              <p className="text-[13px] text-white/60 text-right mb-1.5">1D returns</p>
              <p className="text-base font-medium text-[#FF5252] text-right">
                -₹69.31 (1.07%)
              </p> 
              */}
            </div>

            <div>
              <p className="text-[13px] text-white/60 text-right mb-1.5">Total returns</p>
              <p className={cn(
                "text-base font-medium text-right",
                isPositive ? "text-[#00FF9C]" : "text-[#FF5252]"
              )}>
                {renderGain(totalGain, formatINR(Math.abs(totalGain)), Math.abs(gainPct))}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

"use client";

import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trash2, 
  ChevronDown, 
  TrendingUp, 
  TrendingDown, 
  History, 
  Activity,
  CreditCard,
  Building2
} from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { MutualFund } from "@/types/finance";
import { EditFundDialog } from "@/components/dialogs/edit-fund-dialog";

interface MobileMutualFundCardProps {
  fund: MutualFund;
  onDelete: (id: string) => void;
}

const SNAPPY_SPRING = { type: "spring", stiffness: 500, damping: 35 };

export const MobileMutualFundCard = memo(function MobileMutualFundCard({ fund, onDelete }: MobileMutualFundCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const gain = fund.current - fund.invested;
  const gainPct = fund.invested > 0 ? (gain / fund.invested) * 100 : 0;
  const isProfit = gain >= 0;

  return (
    <div className="p-4 active:bg-foreground/5 transition-all">
      <FinanceCard 
        className={cn(
          "overflow-hidden transition-all duration-300 border-border/40 gpu-accelerated",
          isExpanded ? "ring-2 ring-primary/20 shadow-2xl scale-[1.02]" : "shadow-sm"
        )}
      >
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-4 cursor-pointer"
        >
          {/* Top Row: Brand & Value */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center font-black text-xs text-primary shadow-inner">
                {fund.fund.slice(0, 1)}
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-sm tracking-tight text-foreground truncate max-w-[140px]">
                  {fund.fund}
                </h4>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black">
                    {fund.category}
                  </span>
                  {fund.sipAmount > 0 && (
                    <span className="flex items-center gap-0.5 text-[8px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-black uppercase tracking-tighter">
                      <Activity size={8} className="animate-pulse" /> SIP Active
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-black tabular-nums text-foreground">
                {formatINR(fund.current)}
              </div>
              <div className={cn(
                "text-[9px] font-black uppercase px-2 py-0.5 rounded-lg inline-flex items-center gap-1 mt-1",
                isProfit ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
              )}>
                {isProfit ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {gainPct.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Core Metrics strip */}
          <div className="flex items-center gap-4 mt-2 opacity-60">
            <div className="flex items-center gap-1">
              <History size={10} className="text-muted-foreground" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                XIRR: <span className={fund.xirr > 0 ? "text-primary" : "text-destructive"}>{fund.xirr}%</span>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <CreditCard size={10} className="text-muted-foreground" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">
                SIP: {formatINR(fund.sipAmount)}
              </span>
            </div>
            <div className="ml-auto">
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={SNAPPY_SPRING}
              >
                <ChevronDown size={14} className="text-muted-foreground" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={SNAPPY_SPRING}
              className="gpu-accelerated will-change-transform"
            >
              <div className="px-4 pb-4 border-t border-border/10 pt-4 space-y-4 bg-foreground/[0.02]">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground">Investment</p>
                    <p className="text-xs font-bold text-foreground tabular-nums">{formatINR(fund.invested)}</p>
                    {fund.units && (
                      <p className="text-[9px] text-muted-foreground font-medium">
                        Units: <span className="text-foreground font-mono">{fund.units.toFixed(3)}</span>
                      </p>
                    )}
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground">Returns</p>
                    <p className={cn(
                      "text-xs font-bold tabular-nums font-mono",
                      isProfit ? "text-primary" : "text-destructive"
                    )}>
                      {isProfit ? "+" : ""}{formatINR(gain)}
                    </p>
                    {fund.subCategory && (
                      <p className="text-[9px] uppercase font-black tracking-widest text-primary/80">
                        {fund.subCategory}
                      </p>
                    )}
                  </div>
                </div>

                {fund.amc && (
                  <div className="flex items-center gap-1.5 p-2 rounded-xl bg-foreground/5 border border-border/40">
                    <Building2 size={12} className="text-muted-foreground shrink-0" />
                    <span className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-wider">
                      {fund.amc}
                    </span>
                  </div>
                )}

                {/* Actions Grid */}
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex-1">
                    <EditFundDialog fund={fund} />
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(fund.id);
                    }} 
                    className="p-3 bg-destructive/10 text-destructive rounded-xl active:bg-destructive/20 transition-all active:scale-95"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </FinanceCard>
    </div>
  );
});

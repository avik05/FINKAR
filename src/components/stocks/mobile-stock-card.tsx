import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ChevronDown, TrendingUp, TrendingDown, DollarSign, Layers } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SellStockDialog } from "@/components/dialogs/sell-stock-dialog";
import { EditStockDialog } from "@/components/dialogs/edit-stock-dialog";
import { StockHolding } from "@/stores/stocks-store";

interface MobileStockCardProps {
  holding: StockHolding;
  onDelete: (id: string) => void;
}

const SNAPPY_SPRING = { type: "spring", stiffness: 500, damping: 35 };

export const MobileStockCard = memo(function MobileStockCard({ holding, onDelete }: MobileStockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const pl = (holding.currentPrice - holding.avgBuyPrice) * holding.quantity;
  const plPct = holding.avgBuyPrice > 0 ? ((holding.currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100 : 0;
  const isProfit = pl >= 0;

  const totalValue = holding.currentPrice * holding.quantity;

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
          {/* Top Row: Basic Info */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-foreground/5 border border-border/50 flex items-center justify-center font-black text-xs text-primary bg-clip-text text-transparent bg-gradient-to-br from-primary via-primary/80 to-primary animate-shimmer bg-[length:200%_100%]">
                {holding.symbol.slice(0, 2)}
              </div>
              <div className="min-w-0">
                <h4 className="font-black text-sm tracking-tight text-foreground truncate max-w-[120px]">
                  {holding.symbol}
                </h4>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold truncate max-w-[100px]">
                  {holding.name}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-black tabular-nums text-foreground">
                {formatINR(totalValue)}
              </div>
              <div className={cn(
                "text-[9px] font-black uppercase px-2 py-0.5 rounded-lg inline-flex items-center gap-1",
                isProfit ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
              )}>
                {isProfit ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {plPct.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Quick Stats: Visible even when collapsed */}
          <div className="flex items-center gap-4 mt-1 opacity-60">
            <div className="flex items-center gap-1">
              <Layers size={10} className="text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{holding.quantity} Shares</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={10} className="text-muted-foreground" />
              <span className="text-[10px] font-bold text-muted-foreground tabular-nums">{formatINR(holding.currentPrice)}</span>
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
                    <p className="text-xs font-bold text-foreground tabular-nums">{formatINR(holding.avgBuyPrice * holding.quantity)}</p>
                    <p className="text-[8px] text-muted-foreground">@ {formatINR(holding.avgBuyPrice)} avg</p>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground">Total P&L</p>
                    <p className={cn(
                      "text-xs font-bold tabular-nums font-mono",
                      isProfit ? "text-primary" : "text-destructive"
                    )}>
                      {isProfit ? "+" : ""}{formatINR(pl)}
                    </p>
                    <p className="text-[10px] uppercase font-black tracking-widest text-primary/80">
                      Sector: {holding.sector}
                    </p>
                  </div>
                </div>

                {/* Actions Grid */}
                <div className="flex items-center gap-2 pt-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <SellStockDialog holding={holding} />
                    <EditStockDialog holding={holding} />
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(holding.id);
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

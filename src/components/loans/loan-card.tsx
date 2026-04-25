"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2, Calendar, TrendingUp } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { formatINR } from "@/lib/format";
import { Loan, useLoansStore } from "@/stores/loans-store";
import { EditLoanDialog } from "./edit-loan-dialog";

export function LoanCard({ loan }: { loan: Loan }) {
  const deleteLoan = useLoansStore((s) => s.deleteLoan);

  const stats = useMemo(() => {
    const P = loan.principal;
    const r = loan.interestRate / 12 / 100;
    const n = loan.tenureMonths;
    
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    // Calculate months passed
    const start = new Date(loan.startDate);
    const now = new Date();
    const monthsPassed = Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()));
    
    // Remaining balance formula: P * [(1+r)^n - (1+r)^m] / [(1+r)^n - 1]
    // where m is months passed
    const remainingBalance = P * (Math.pow(1 + r, n) - Math.pow(1 + r, monthsPassed)) / (Math.pow(1 + r, n) - 1);
    const safeBalance = Math.max(0, remainingBalance);
    
    const progress = Math.min(100, (monthsPassed / n) * 100);
    
    return {
      emi,
      remainingBalance: safeBalance,
      progress,
      monthsPassed,
      monthsRemaining: Math.max(0, n - monthsPassed)
    };
  }, [loan]);

  return (
    <FinanceCard className="p-5 relative overflow-hidden group bg-card/40 backdrop-blur-xl border-border/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-heading font-black text-foreground tracking-tight uppercase">{loan.name}</h3>
          <div className="flex items-center gap-2 mt-1">
             <Calendar size={12} className="text-muted-foreground" />
             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Started {new Date(loan.startDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <EditLoanDialog loan={loan} />
          <button 
            onClick={() => deleteLoan(loan.id)}
            className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Monthly EMI</p>
          <p className="text-lg font-black text-primary tracking-tighter">{formatINR(stats.emi)}</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Interest Rate</p>
          <p className="text-lg font-black text-foreground tracking-tighter">{loan.interestRate}% <span className="text-[10px] text-muted-foreground">p.a</span></p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Remaining Balance</p>
            <p className="text-xl font-black text-foreground tracking-tighter">{formatINR(stats.remainingBalance)}</p>
          </div>
          <div className="text-right">
             <p className="text-[10px] font-black text-primary uppercase tracking-widest">{stats.progress.toFixed(0)}% Paid</p>
          </div>
        </div>
        
        <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${stats.progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,156,0.3)]"
          />
        </div>
        
        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-muted-foreground pt-1">
          <span>{stats.monthsPassed} Months Paid</span>
          <span>{stats.monthsRemaining} Months Left</span>
        </div>
      </div>
    </FinanceCard>
  );
}

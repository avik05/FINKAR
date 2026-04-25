"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Calculator, ShieldCheck } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { useLoansStore } from "@/stores/loans-store";
import { useAuthStore } from "@/stores/auth-store";
import { LoanCalculator } from "@/components/loans/loan-calculator";
import { LoanCard } from "@/components/loans/loan-card";

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

export default function LoansPage() {
  const { loans, fetchLoans } = useLoansStore();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      fetchLoans();
    }
  }, [isLoggedIn, fetchLoans]);

  return (
    <motion.div 
      initial="hidden" 
      animate="show" 
      variants={{ show: { transition: { staggerChildren: 0.1 } } }} 
      className="space-y-10 pb-20"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl lg:text-4xl font-heading font-black text-foreground uppercase tracking-tight">Loans</h1>
        <p className="text-muted-foreground mt-2 font-medium tracking-wide">Plan your debt and track active repayment progress.</p>
      </div>

      {/* Loan Calculator */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
           <Calculator size={18} className="text-primary" />
           <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">EMI Calculator</h2>
        </div>
        <LoanCalculator />
      </section>

      {/* Active Loans */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-primary" />
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Active Loans</h2>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {loans.length} Tracking
          </p>
        </div>

        {loans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loans.map((loan) => (
              <motion.div key={loan.id} variants={FADE_UP}>
                <LoanCard loan={loan} />
              </motion.div>
            ))}
          </div>
        ) : (
          <FinanceCard className="p-12 text-center border-border/50 border-dashed bg-transparent">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-2">No Active Loans</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">Use the calculator above to plan a loan and add it to your tracker.</p>
          </FinanceCard>
        )}
      </section>
    </motion.div>
  );
}

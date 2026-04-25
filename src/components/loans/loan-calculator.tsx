"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Plus, Info } from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/format";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useLoansStore } from "@/stores/loans-store";
import { useAuthStore } from "@/stores/auth-store";

export function LoanCalculator() {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [loanName, setLoanName] = useState("");
  
  const addLoan = useLoansStore((s) => s.addLoan);
  const { isLoggedIn } = useAuthStore();

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const r = interestRate / 12 / 100;
    const n = tenureYears * 12;
    if (r === 0) return { emi: principal / n, totalInterest: 0, totalPayable: principal };
    
    const emiVal = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayableVal = emiVal * n;
    const totalInterestVal = totalPayableVal - principal;
    
    return {
      emi: emiVal,
      totalInterest: totalInterestVal,
      totalPayable: totalPayableVal
    };
  }, [principal, interestRate, tenureYears]);

  const chartData = [
    { name: "Principal", value: principal, color: "var(--primary)" },
    { name: "Total Interest", value: totalInterest, color: "#60A5FA" },
  ];

  const handleAddLoan = () => {
    addLoan({
      name: loanName || "New Loan",
      principal,
      interestRate,
      tenureMonths: tenureYears * 12,
      startDate: new Date().toISOString(),
      color: "var(--primary)"
    });
    setLoanName("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <FinanceCard className="p-6 space-y-6 bg-card/40 backdrop-blur-xl border-border/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="text-lg font-heading font-black text-foreground uppercase tracking-tight">EMI Calculator</h3>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">Plan your debt</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loan Amount (₹)</Label>
              <Input 
                type="number" 
                value={principal} 
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="w-32 h-8 text-right font-black text-primary bg-foreground/5 border-transparent focus:border-primary/30 text-xs"
              />
            </div>
            <input 
              type="range" 
              min="100000" 
              max="10000000" 
              step="50000" 
              value={principal} 
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full h-1.5 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Interest Rate (% p.a)</Label>
              <Input 
                type="number" 
                step="0.1"
                value={interestRate} 
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-20 h-8 text-right font-black text-foreground bg-foreground/5 border-transparent focus:border-primary/30 text-xs"
              />
            </div>
            <input 
              type="range" 
              min="1" 
              max="20" 
              step="0.1" 
              value={interestRate} 
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-1.5 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tenure (Years)</Label>
              <Input 
                type="number" 
                value={tenureYears} 
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-20 h-8 text-right font-black text-foreground bg-foreground/5 border-transparent focus:border-primary/30 text-xs"
              />
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              step="1" 
              value={tenureYears} 
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-1.5 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="pt-4 border-t border-border/5 space-y-4">
             <div className="space-y-2">
               <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loan Label (Optional)</Label>
               <Input 
                 placeholder="e.g. Home Loan, HDFC Car Loan" 
                 value={loanName} 
                 onChange={(e) => setLoanName(e.target.value)}
                 className="bg-foreground/5 border-transparent focus:border-primary/30 transition-all rounded-xl"
               />
             </div>
             <Button 
               onClick={handleAddLoan}
               className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-xl font-black uppercase tracking-widest text-[10px] h-10 transition-all"
             >
               <Plus size={14} className="mr-2" /> Add to Active Loans
             </Button>
          </div>
        </div>
      </FinanceCard>

      {/* Results & Chart */}
      <FinanceCard className="p-6 flex flex-col items-center justify-center relative overflow-hidden bg-card/40 backdrop-blur-xl border-border/10">
        <div className="absolute top-4 left-4">
           <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-40">Repayment Summary</p>
        </div>

        <div className="grid grid-cols-2 w-full gap-4 mb-8">
           <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-border/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Monthly EMI</p>
              <p className="text-xl font-black text-primary tracking-tighter">{formatINR(emi)}</p>
           </div>
           <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-border/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total Interest</p>
              <p className="text-xl font-black text-foreground tracking-tighter">{formatINR(totalInterest)}</p>
           </div>
        </div>

        <div className="relative w-full h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: 'none', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Payable</p>
            <p className="text-lg font-black text-foreground tracking-tighter">{formatINR(totalPayable)}</p>
          </div>
        </div>

        <div className="flex gap-6 mt-6">
          {chartData.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </FinanceCard>
    </div>
  );
}

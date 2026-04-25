"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loan, useLoansStore } from "@/stores/loans-store";

export function EditLoanDialog({ loan }: { loan: Loan }) {
  const [open, setOpen] = useState(false);
  const updateLoan = useLoansStore((s) => s.updateLoan);
  
  const [name, setName] = useState(loan.name);
  const [principal, setPrincipal] = useState(loan.principal.toString());
  const [rate, setRate] = useState(loan.interestRate.toString());
  const [tenure, setTenure] = useState((loan.tenureMonths / 12).toString());
  const [startDate, setStartDate] = useState(loan.startDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLoan(loan.id, {
      name,
      principal: parseFloat(principal),
      interestRate: parseFloat(rate),
      tenureMonths: parseFloat(tenure) * 12,
      startDate,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100">
            <Edit2 size={16} />
          </button>
        }
      />
      <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground uppercase tracking-tight">Edit Loan Details</DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs uppercase tracking-widest font-bold opacity-60">Update your repayment plan</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Loan Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-foreground/5 border-border/50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Principal (₹)</Label>
              <Input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rate (% p.a)</Label>
              <Input type="number" step="0.1" value={rate} onChange={(e) => setRate(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Tenure (Years)</Label>
              <Input type="number" value={tenure} onChange={(e) => setTenure(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-xs h-11 shadow-[0_0_20px_rgba(0,255,156,0.2)]">
            Save Changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

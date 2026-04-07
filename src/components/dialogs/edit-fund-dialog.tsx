"use client";

import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { useAuthStore } from "@/stores/auth-store";
import { useAccountsStore } from "@/stores/accounts-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { MutualFund } from "@/types/finance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Wallet } from "lucide-react";

interface EditFundDialogProps {
  fund: MutualFund;
}

export function EditFundDialog({ fund: initialFund }: EditFundDialogProps) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  
  const updateFund = useMutualFundsStore((s) => s.updateFund);
  
  const [fund, setFund] = useState(initialFund.fund);
  const [category, setCategory] = useState<MutualFund["category"]>(initialFund.category);
  const [invested, setInvested] = useState(initialFund.invested.toString());
  const [current, setCurrent] = useState(initialFund.current.toString());
  const [sipAmount, setSipAmount] = useState(initialFund.sipAmount.toString());
  const [xirr, setXirr] = useState(initialFund.xirr.toString());
  const [sipDay, setSipDay] = useState(initialFund.sipDay?.toString() || "5");
  const [sipAccountId, setSipAccountId] = useState(initialFund.sipAccountId || "");

  const { accounts } = useAccountsStore();

  useEffect(() => {
    if (open) {
      setFund(initialFund.fund);
      setCategory(initialFund.category);
      setInvested(initialFund.invested.toString());
      setCurrent(initialFund.current.toString());
      setSipAmount(initialFund.sipAmount.toString());
      setXirr(initialFund.xirr.toString());
      setSipDay(initialFund.sipDay?.toString() || "5");
      setSipAccountId(initialFund.sipAccountId || "");
    }
  }, [initialFund, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fund.trim() || !invested) return;

    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }

    updateFund(initialFund.id, {
      fund: fund.trim(),
      category,
      invested: parseFloat(invested) || 0,
      current: parseFloat(current) || initialFund.current,
      sipAmount: parseFloat(sipAmount) || 0,
      xirr: parseFloat(xirr) || 0,
      sipDay: parseInt(sipDay) || 5,
      sipAccountId,
    });

    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<button className="flex items-center justify-center p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-all" title="Edit fund" />}>
          <Pencil size={14} />
        </DialogTrigger>
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground">Edit Mutual Fund</DialogTitle>
            <DialogDescription className="text-muted-foreground">Modify your mutual fund holding details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mf-name-edit">Fund Name</Label>
                <Input id="mf-name-edit" placeholder="Parag Parikh Flexi Cap" value={fund} onChange={(e) => setFund(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mf-cat-edit">Category</Label>
                <Select value={category} onValueChange={(val: string | null) => setCategory(val as MutualFund["category"])}>
                  <SelectTrigger className="w-full bg-foreground/5 border-border/50 h-10">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/50">
                    <SelectItem value="Equity">Equity</SelectItem>
                    <SelectItem value="Debt">Debt</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Index">Index</SelectItem>
                    <SelectItem value="ELSS">ELSS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mf-invested-edit">Invested Amount (₹)</Label>
                <Input id="mf-invested-edit" type="number" step="0.01" placeholder="100000" value={invested} onChange={(e) => setInvested(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mf-current-edit">Current Value (₹)</Label>
                <Input id="mf-current-edit" type="number" step="0.01" placeholder="125000" value={current} onChange={(e) => setCurrent(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-mf-sip">Monthly SIP (₹)</Label>
                <Input id="edit-mf-sip" type="number" step="0.01" value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-mf-xirr">XIRR (%)</Label>
                <Input id="edit-mf-xirr" type="number" step="0.1" value={xirr} onChange={(e) => setXirr(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  SIP Day (1-31)
                </Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="31" 
                  value={sipDay} 
                  onChange={(e) => setSipDay(e.target.value)} 
                  className="bg-foreground/5 border-border/50" 
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Wallet size={14} className="text-primary" />
                  Deduction Account
                </Label>
                <Select value={sipAccountId} onValueChange={(val: string | null) => setSipAccountId(val ?? "")}>
                  <SelectTrigger className="bg-foreground/5 border-border/50">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/50">
                    {accounts.map(acc => (
                      <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
              {isLoggedIn ? "Update Fund" : "Sign Up to Update"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

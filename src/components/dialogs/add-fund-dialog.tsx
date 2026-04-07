"use client";

import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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

interface AddFundDialogProps {
  label?: string;
}

export function AddFundDialog({ label = "Add Manual Fund" }: AddFundDialogProps) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  
  const addFund = useMutualFundsStore((s) => s.addFund);
  
  const [fund, setFund] = useState("");
  const [category, setCategory] = useState<MutualFund["category"]>("Equity");
  const [invested, setInvested] = useState("");
  const [current, setCurrent] = useState("");
  const [sipAmount, setSipAmount] = useState("");
  const [xirr, setXirr] = useState("");
  const [sipDay, setSipDay] = useState("5");
  const [sipAccountId, setSipAccountId] = useState("");
  
  const { accounts } = useAccountsStore();
  
  // Auto-select first account if available
  useEffect(() => {
    if (accounts.length > 0 && !sipAccountId) {
      setSipAccountId(accounts[0].id);
    }
  }, [accounts, sipAccountId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fund.trim() || !invested) return;

    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }

    addFund({
      fund: fund.trim(),
      category,
      invested: parseFloat(invested) || 0,
      current: parseFloat(current) || (parseFloat(invested) || 0),
      sipAmount: parseFloat(sipAmount) || 0,
      xirr: parseFloat(xirr) || 0,
      sipDay: parseInt(sipDay) || 5,
      sipAccountId,
    });

    // Reset
    setFund("");
    setCategory("Equity");
    setInvested("");
    setCurrent("");
    setSipAmount("");
    setXirr("");
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" size="sm" className="h-10 px-4 rounded-xl gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-bold w-full sm:w-auto" />}>
          <Plus size={16} /> <span className="sm:hidden">Add Fund</span><span className="hidden sm:inline">{label}</span>
        </DialogTrigger>
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground">Add Mutual Fund</DialogTitle>
            <DialogDescription className="text-muted-foreground">Track your mutual fund holdings and performance.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mf-name">Fund Name</Label>
                <Input id="mf-name" placeholder="Parag Parikh Flexi Cap" value={fund} onChange={(e) => setFund(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mf-cat">Category</Label>
                <Select value={category} onValueChange={(val) => setCategory(val as MutualFund["category"])}>
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
                <Label htmlFor="mf-invested">Invested Amount (₹)</Label>
                <Input id="mf-invested" type="number" step="0.01" placeholder="100000" value={invested} onChange={(e) => setInvested(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mf-current">Current Value (₹)</Label>
                <Input id="mf-current" type="number" step="0.01" placeholder="125000" value={current} onChange={(e) => setCurrent(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mf-sip">Monthly SIP (₹)</Label>
                <Input id="mf-sip" type="number" step="0.01" placeholder="5000" value={sipAmount} onChange={(e) => setSipAmount(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mf-xirr">XIRR (%)</Label>
                <Input id="mf-xirr" type="number" step="0.1" placeholder="14.5" value={xirr} onChange={(e) => setXirr(e.target.value)} className="bg-foreground/5 border-border/50" />
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
              {isLoggedIn ? "Add Fund" : "Sign Up to Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

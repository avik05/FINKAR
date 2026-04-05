"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { MutualFund } from "@/types/finance";

export function AddFundDialog() {
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
        <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" />}>
          <Plus size={16} /> Add Fund
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
                <select id="mf-cat" value={category} onChange={(e) => setCategory(e.target.value as MutualFund["category"])} className="w-full rounded-md bg-foreground/5 border border-border/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary">
                  <option value="Equity">Equity</option>
                  <option value="Debt">Debt</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Index">Index</option>
                  <option value="ELSS">ELSS</option>
                </select>
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
                <Input id="mf-xirr" type="number" step="0.1" placeholder="14.5" value={xirr} onChange={(e) => setSipAmount(e.target.value)} className="bg-foreground/5 border-border/50" />
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

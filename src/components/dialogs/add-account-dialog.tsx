"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAccountsStore } from "@/stores/accounts-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { BankAccount } from "@/types/finance";

export function AddAccountDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  
  const addAccount = useAccountsStore((s) => s.addAccount);
  const [name, setName] = useState("");
  const [type, setType] = useState<BankAccount["type"]>("Savings");
  const [balance, setBalance] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }

    addAccount({ name: name.trim(), type, balance: parseFloat(balance) || 0 });
    setName("");
    setType("Savings");
    setBalance("");
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {children ? (
          <span onClick={() => setOpen(true)} className="cursor-pointer">
            {children}
          </span>
        ) : (
          <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" />}>
            <Plus size={16} /> Add Account
          </DialogTrigger>
        )}
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground">Add Bank Account</DialogTitle>
            <DialogDescription className="text-muted-foreground">Add a new bank account, card, or wallet to track.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="acc-name">Account Name</Label>
              <Input id="acc-name" placeholder="e.g. HDFC Salary Account" value={name} onChange={(e) => setName(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acc-type">Account Type</Label>
              <select id="acc-type" value={type} onChange={(e) => setType(e.target.value as BankAccount["type"])} className="w-full rounded-md bg-foreground/5 border border-border/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary">
                <option value="Savings">Savings</option>
                <option value="Checking">Checking</option>
                <option value="Credit">Credit Card</option>
                <option value="Wallet">Wallet</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="acc-balance">Current Balance (₹)</Label>
              <Input id="acc-balance" type="number" step="0.01" placeholder="0.00" value={balance} onChange={(e) => setBalance(e.target.value)} className="bg-foreground/5 border-border/50" />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
              {isLoggedIn ? "Add Account" : "Sign Up to Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

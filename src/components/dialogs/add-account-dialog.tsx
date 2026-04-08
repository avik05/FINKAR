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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";

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
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Add Bank Account"
        description="Add a new bank account, card, or wallet to track."
        nativeButton={!children}
        trigger={
          children ? (
            <span className="cursor-pointer">{children}</span>
          ) : (
            <Button variant="outline" size="sm" className="gap-2 bg-primary/10 text-primary border-primary/20 md:hover:bg-primary/20 active:bg-primary/20 transition-all">
              <Plus size={16} /> Add Account
            </Button>
          )
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="acc-name">Account Name</Label>
            <Input id="acc-name" placeholder="e.g. HDFC Salary Account" value={name} onChange={(e) => setName(e.target.value)} className="bg-foreground/5 border-border/50" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="acc-type">Account Type</Label>
            <Select value={type} onValueChange={(val) => setType(val as BankAccount["type"])}>
              <SelectTrigger className="w-full bg-foreground/5 border-border/50 h-11">
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/50">
                <SelectItem value="Savings" textValue="Savings">Savings</SelectItem>
                <SelectItem value="Checking" textValue="Checking">Checking</SelectItem>
                <SelectItem value="Salary" textValue="Salary Account">Salary Account</SelectItem>
                <SelectItem value="Credit" textValue="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Wallet" textValue="Wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="acc-balance">Current Balance (₹)</Label>
            <Input id="acc-balance" type="number" step="0.01" placeholder="0.00" value={balance} onChange={(e) => setBalance(e.target.value)} className="bg-foreground/5 border-border/50" />
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground md:hover:bg-primary/90 active:scale-[0.98] transition-all font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
            {isLoggedIn ? "Add Account" : "Sign Up to Add"}
          </Button>
        </form>
      </ResponsiveDialog>

      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

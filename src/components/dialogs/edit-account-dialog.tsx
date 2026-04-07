"use client";

import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAccountsStore } from "@/stores/accounts-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { BankAccount } from "@/types/finance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EditAccountDialog({ account }: { account: BankAccount }) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const updateAccount = useAccountsStore((s) => s.updateAccount);
  
  const [name, setName] = useState(account.name);
  const [type, setType] = useState<BankAccount["type"]>(account.type);
  const [balance, setBalance] = useState(account.balance.toString());

  // Sync state if account prop changes
  useEffect(() => {
    if (open) {
      setName(account.name);
      setType(account.type);
      setBalance(account.balance.toString());
    }
  }, [open, account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }

    updateAccount(account.id, { 
      name: name.trim(), 
      type, 
      balance: parseFloat(balance) || 0 
    });
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger
          render={
            <button 
              className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary/20 text-muted-foreground hover:text-primary transition-all border border-transparent hover:border-primary/20" 
              title="Edit account"
            />
          }
        >
          <Pencil size={14} />
        </DialogTrigger>
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground">Edit Bank Account</DialogTitle>
            <DialogDescription className="text-muted-foreground">Update your account details and balance.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="edit-acc-name">Account Name</Label>
              <Input 
                id="edit-acc-name" 
                placeholder="e.g. HDFC Salary Account" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="bg-foreground/5 border-border/50" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-acc-type">Account Type</Label>
              <Select value={type} onValueChange={(val) => setType(val as BankAccount["type"])}>
                <SelectTrigger className="w-full bg-foreground/5 border-border/50 h-11">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/50">
                  <SelectItem value="Savings">Savings</SelectItem>
                  <SelectItem value="Checking">Checking</SelectItem>
                  <SelectItem value="Salary">Salary Account</SelectItem>
                  <SelectItem value="Credit">Credit Card</SelectItem>
                  <SelectItem value="Wallet">Wallet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-acc-balance">Current Balance (₹)</Label>
              <Input 
                id="edit-acc-balance" 
                type="number" 
                step="0.01" 
                placeholder="0.00" 
                value={balance} 
                onChange={(e) => setBalance(e.target.value)} 
                className="bg-foreground/5 border-border/50" 
              />
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
              {isLoggedIn ? "Save Changes" : "Sign Up to Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

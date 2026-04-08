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
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";

function EditAccountForm({ 
  account, 
  onSuccess,
  isLoggedIn,
  setAuthPromptOpen 
}: { 
  account: BankAccount; 
  onSuccess: () => void;
  isLoggedIn: boolean;
  setAuthPromptOpen: (open: boolean) => void;
}) {
  const updateAccount = useAccountsStore((s) => s.updateAccount);
  const [name, setName] = useState(account.name);
  const [type, setType] = useState<BankAccount["type"]>(account.type);
  const [balance, setBalance] = useState(account.balance.toString());

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
    onSuccess();
  };

  return (
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
            <SelectItem value="Savings" textValue="Savings">Savings</SelectItem>
            <SelectItem value="Checking" textValue="Checking">Checking</SelectItem>
            <SelectItem value="Salary" textValue="Salary Account">Salary Account</SelectItem>
            <SelectItem value="Credit" textValue="Credit Card">Credit Card</SelectItem>
            <SelectItem value="Wallet" textValue="Wallet">Wallet</SelectItem>
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
      <Button type="submit" className="w-full bg-primary text-primary-foreground md:hover:bg-primary/90 active:scale-[0.98] transition-all font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
        {isLoggedIn ? "Save Changes" : "Sign Up to Save Changes"}
      </Button>
    </form>
  );
}

export function EditAccountDialog({ account }: { account: BankAccount }) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();

  return (
    <>
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit Bank Account"
        description="Update your account details and balance."
        nativeButton={true}
        trigger={
          <button 
            className="p-2 rounded-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 md:hover:bg-primary/20 text-muted-foreground md:hover:text-primary transition-all border border-transparent md:hover:border-primary/20 active:scale-95 active:bg-primary/10" 
            title="Edit account"
          >
            <Pencil size={14} />
          </button>
        }
      >
        <EditAccountForm 
          key={open ? `edit-${account.id}` : 'closed'}
          account={account}
          isLoggedIn={isLoggedIn}
          setAuthPromptOpen={setAuthPromptOpen}
          onSuccess={() => setOpen(false)}
        />
      </ResponsiveDialog>

      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

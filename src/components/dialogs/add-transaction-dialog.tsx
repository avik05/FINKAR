"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransactionsStore, CATEGORIES } from "@/stores/transactions-store";
import { useAccountsStore } from "@/stores/accounts-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddTransactionDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  
  const addTransaction = useTransactionsStore((s) => s.addTransaction);
  const accounts = useAccountsStore((s) => s.accounts);

  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [accountId, setAccountId] = useState("none");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !amount) return;

    // IF GUEST: Prompt for auth instead of saving
    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }

    const selectedAccount = accounts.find((a) => a.id === accountId);
    const finalCategory = category === "Other" && customCategory.trim() ? customCategory.trim() : category;
    const finalAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

    addTransaction({
      date,
      merchant: merchant.trim(),
      category: finalCategory,
      amount: finalAmount,
      accountId: accountId === "none" ? null : accountId,
      accountName: selectedAccount?.name || "Unlinked",
    });

    // Reset
    setMerchant("");
    setAmount("");
    setCategory(CATEGORIES[0]);
    setCustomCategory("");
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
            <Plus size={16} /> Add Transaction
          </DialogTrigger>
        )}
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground">Add Transaction</DialogTitle>
            <DialogDescription className="text-muted-foreground">Record an income credit or expense debit.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsExpense(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isExpense ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-foreground/5 text-muted-foreground border border-border/50"}`}>
                Expense (-)
              </button>
              <button type="button" onClick={() => setIsExpense(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${!isExpense ? "bg-primary/10 text-primary border border-primary/20" : "bg-foreground/5 text-muted-foreground border border-border/50"}`}>
                Income (+)
              </button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-merchant">Merchant / Description</Label>
              <Input id="tx-merchant" placeholder="e.g. Zomato, Salary Credit" value={merchant} onChange={(e) => setMerchant(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-amount">Amount (₹)</Label>
              <Input id="tx-amount" type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tx-date">Date</Label>
                <Input id="tx-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tx-category">Category</Label>
                <Select value={category} onValueChange={(val) => setCategory(val || CATEGORIES[0])}>
                  <SelectTrigger className="w-full bg-foreground/5 border-border/50 h-10">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/50">
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {category === "Other" && (
              <div className="space-y-2">
                <Label htmlFor="tx-custom-cat">Custom Category</Label>
                <Input id="tx-custom-cat" placeholder="Type your category..." value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
            )}
            {accounts.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="tx-account">Account</Label>
                <Select value={accountId} onValueChange={(val) => setAccountId(val || "")}>
                  <SelectTrigger className="w-full bg-foreground/5 border-border/50 h-10">
                    <SelectValue placeholder="Select Account" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border/50">
                    <SelectItem value="none">Unlinked</SelectItem>
                    {accounts.map((a) => (
                      <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
              {isLoggedIn ? "Save Transaction" : "Sign Up to Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

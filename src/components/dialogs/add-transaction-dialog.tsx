"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransactionsStore, CATEGORIES } from "@/stores/transactions-store";
import { useAccountsStore } from "@/stores/accounts-store";

export function AddTransactionDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const addTransaction = useTransactionsStore((s) => s.addTransaction);
  const accounts = useAccountsStore((s) => s.accounts);

  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !amount) return;
    const selectedAccount = accounts.find((a) => a.id === accountId);
    const finalCategory = category === "Other" && customCategory.trim() ? customCategory.trim() : category;
    const finalAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

    addTransaction({
      date,
      merchant: merchant.trim(),
      category: finalCategory,
      amount: finalAmount,
      accountId: accountId || "none",
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
          <DialogTitle className="font-heading text-xl">Add Transaction</DialogTitle>
          <DialogDescription>Record an income credit or expense debit.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex gap-2">
            <button type="button" onClick={() => setIsExpense(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isExpense ? "bg-destructive/20 text-destructive border border-destructive/30" : "bg-foreground/5 text-muted-foreground border border-border/50"}`}>
              Expense (-)
            </button>
            <button type="button" onClick={() => setIsExpense(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${!isExpense ? "bg-primary/20 text-primary border border-primary/30" : "bg-foreground/5 text-muted-foreground border border-border/50"}`}>
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
              <select id="tx-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-md bg-foreground/5 border border-border/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary">
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
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
              <select id="tx-account" value={accountId} onChange={(e) => setAccountId(e.target.value)} className="w-full rounded-md bg-foreground/5 border border-border/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-1 focus:ring-primary">
                <option value="">Unlinked</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
          )}
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
            Save Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

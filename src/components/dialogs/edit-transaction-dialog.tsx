"use client";

import React, { useState, useEffect } from "react";
import { Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTransactionsStore, CATEGORIES } from "@/stores/transactions-store";
import { Transaction } from "@/types/finance";
import { useAccountsStore } from "@/stores/accounts-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EditTransactionDialog({ transaction, children }: { transaction: Transaction, children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  
  const updateTransaction = useTransactionsStore((s) => s.updateTransaction);
  const accounts = useAccountsStore((s) => s.accounts);

  const [merchant, setMerchant] = useState("");
  const [amount, setAmount] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState("");
  const [accountId, setAccountId] = useState("none");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (open) {
      setMerchant(transaction.merchant);
      setAmount(Math.abs(transaction.amount).toString());
      setIsExpense(transaction.amount < 0);
      setAccountId(transaction.accountId || "none");
      setDate(transaction.date);
      if (CATEGORIES.includes(transaction.category as any)) {
        setCategory(transaction.category);
        setCustomCategory("");
      } else {
        setCategory("Other");
        setCustomCategory(transaction.category);
      }
    }
  }, [open, transaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant.trim() || !amount) return;

    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }

    const selectedAccount = accounts.find((a) => a.id === accountId);
    const finalCategory = category === "Other" && customCategory.trim() ? customCategory.trim() : category;
    const finalAmount = isExpense ? -Math.abs(parseFloat(amount)) : Math.abs(parseFloat(amount));

    updateTransaction(transaction.id, {
      date,
      merchant: merchant.trim(),
      category: finalCategory,
      amount: finalAmount,
      accountId: accountId === "none" ? null : accountId,
      accountName: selectedAccount?.name || "Unlinked",
    });

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
          <DialogTrigger render={
            <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-foreground/10 transition-all text-muted-foreground hover:text-foreground" title="Edit">
              <Edit2 size={14} />
            </button>
          } />
        )}
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground">Edit Transaction</DialogTitle>
            <DialogDescription className="text-muted-foreground">Update transaction details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Same form as AddTransaction */}
            <div className="flex gap-2">
              <button type="button" onClick={() => setIsExpense(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isExpense ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-foreground/5 text-muted-foreground border border-border/50"}`}>
                Expense (-)
              </button>
              <button type="button" onClick={() => setIsExpense(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${!isExpense ? "bg-primary/10 text-primary border border-primary/20" : "bg-foreground/5 text-muted-foreground border border-border/50"}`}>
                Income (+)
              </button>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tx-merchant">Merchant / Description</Label>
              <Input id="edit-tx-merchant" placeholder="e.g. Zomato, Salary Credit" value={merchant} onChange={(e) => setMerchant(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tx-amount">Amount (₹)</Label>
              <Input id="edit-tx-amount" type="number" step="0.01" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-tx-date">Date</Label>
                <Input id="edit-tx-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tx-category">Category</Label>
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
                <Label htmlFor="edit-tx-custom-cat">Custom Category</Label>
                <Input id="edit-tx-custom-cat" placeholder="Type your category..." value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
            )}
            {accounts.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="edit-tx-account">Account</Label>
                <Select value={accountId} onValueChange={(val) => setAccountId(val || "none")}>
                  <SelectTrigger className="w-full bg-foreground/5 border-border/50 h-10">
                    <SelectValue placeholder="Select Account">
                      {accounts.find(a => a.id === accountId)?.name || (accountId === "none" ? "Unlinked" : "Select Account")}
                    </SelectValue>
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
              {isLoggedIn ? "Save Changes" : "Sign Up to Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

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
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";

function EditTransactionForm({ 
  transaction, 
  onSuccess,
  isLoggedIn,
  setAuthPromptOpen 
}: { 
  transaction: Transaction; 
  onSuccess: () => void;
  isLoggedIn: boolean;
  setAuthPromptOpen: (open: boolean) => void;
}) {
  const updateTransaction = useTransactionsStore((s) => s.updateTransaction);
  const accounts = useAccountsStore((s) => s.accounts);

  const [merchant, setMerchant] = useState(transaction.merchant);
  const [amount, setAmount] = useState(Math.abs(transaction.amount).toString());
  const [isExpense, setIsExpense] = useState(transaction.amount < 0);
  const [category, setCategory] = useState<Transaction["category"]>(
    CATEGORIES.includes(transaction.category as any) ? (transaction.category as Transaction["category"]) : "Other"
  );
  const [customCategory, setCustomCategory] = useState(
    CATEGORIES.includes(transaction.category as any) ? "" : transaction.category
  );
  const [accountId, setAccountId] = useState(transaction.accountId || "none");
  const [date, setDate] = useState(transaction.date);

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

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="flex gap-2">
        <button type="button" onClick={() => setIsExpense(true)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${isExpense ? "bg-destructive/10 text-destructive border border-destructive/20" : "bg-foreground/5 text-muted-foreground border border-border/50 md:hover:bg-foreground/10 active:bg-foreground/10"}`}>
          Expense (-)
        </button>
        <button type="button" onClick={() => setIsExpense(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${!isExpense ? "bg-primary/10 text-primary border border-primary/20" : "bg-foreground/5 text-muted-foreground border border-border/50 md:hover:bg-foreground/10 active:bg-foreground/10"}`}>
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
          <Select value={category} onValueChange={(val) => setCategory((val || CATEGORIES[0]) as Transaction["category"])}>
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
      <Button type="submit" className="w-full bg-primary text-primary-foreground md:hover:bg-primary/90 active:scale-[0.98] transition-all font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
        {isLoggedIn ? "Save Changes" : "Sign Up to Save"}
      </Button>
    </form>
  );
}

export function EditTransactionDialog({ transaction, children }: { transaction: Transaction, children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();

  return (
    <>
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit Transaction"
        description="Update transaction details."
        nativeButton={!children}
        trigger={
          children ? (
            <span className="cursor-pointer">{children}</span>
          ) : (
            <button 
              className="p-2 rounded-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 md:hover:bg-foreground/10 transition-all text-muted-foreground md:hover:text-foreground active:scale-95 active:bg-foreground/10" 
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
          )
        }
      >
        <EditTransactionForm 
          key={open ? `edit-${transaction.id}` : 'closed'}
          transaction={transaction}
          isLoggedIn={isLoggedIn}
          setAuthPromptOpen={setAuthPromptOpen}
          onSuccess={() => setOpen(false)}
        />
      </ResponsiveDialog>
      
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

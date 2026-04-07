"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, HandCoins, Wallet, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStocksStore } from "@/stores/stocks-store";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { StockHolding } from "@/types/finance";
import { formatINR } from "@/lib/format";

interface SellStockDialogProps {
  holding: StockHolding;
}

export function SellStockDialog({ holding }: SellStockDialogProps) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  const { deleteHolding, updateHolding } = useStocksStore();
  const { accounts, updateAccount } = useAccountsStore();
  const { addTransaction } = useTransactionsStore();

  const [sellQty, setSellQty] = useState(holding.quantity.toString());
  const [sellPrice, setSellPrice] = useState(holding.currentPrice.toString());
  const [targetAccountId, setTargetAccountId] = useState("");

  const qty = parseFloat(sellQty) || 0;
  const price = parseFloat(sellPrice) || 0;
  const totalProceeds = qty * price;
  const costBasis = qty * holding.avgBuyPrice;
  const profitLoss = totalProceeds - costBasis;
  const isProfit = profitLoss >= 0;

  useEffect(() => {
    if (open) {
      setSellQty(holding.quantity.toString());
      setSellPrice(holding.currentPrice.toString());
      if (accounts.length > 0 && !targetAccountId) {
        setTargetAccountId(accounts[0].id);
      }
    }
  }, [open, holding, accounts, targetAccountId]);

  const handleSell = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }
    if (qty <= 0 || qty > holding.quantity) return;

    // Only update Bank/Transaction if it's a PROFIT
    if (isProfit && targetAccountId) {
      const targetAccount = accounts.find(a => a.id === targetAccountId);
      if (targetAccount) {
        // 1. Transaction Record
        await addTransaction({
          date: new Date().toISOString(),
          merchant: `Stock Sale: ${holding.symbol}`,
          category: "Income",
          amount: totalProceeds,
          accountId: targetAccountId,
          accountName: targetAccount.name,
        });

        // 2. Update Bank Balance (Manual update for state consistency if needed, 
        // though addTransaction handles it for DB users)
        if (!isLoggedIn) {
          updateAccount(targetAccountId, { balance: targetAccount.balance + totalProceeds });
        }
      }
    }

    // 3. Update/Delete Holding (Always happens)
    if (qty === holding.quantity) {
      await deleteHolding(holding.id);
    } else {
      await updateHolding(holding.id, { quantity: holding.quantity - qty });
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<button className="flex items-center justify-center p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-all" title="Sell holding" />}>
        <HandCoins size={14} />
      </DialogTrigger>
      <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground flex items-center gap-2">
            Sell {holding.symbol}
            <span className="text-xs font-normal text-muted-foreground uppercase tracking-widest bg-secondary/20 px-2 py-0.5 rounded">
              {holding.exchange}
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete the sale and realize your {isProfit ? "profit" : "loss"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSell} className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sell-qty">Qty to Sell (Max: {holding.quantity})</Label>
              <Input 
                id="sell-qty" 
                type="number" 
                max={holding.quantity} 
                min="0.000001" 
                step="any"
                value={sellQty} 
                onChange={(e) => setSellQty(e.target.value)} 
                className="bg-foreground/5 border-border/50" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sell-price">Sell Price (₹)</Label>
              <Input 
                id="sell-price" 
                type="number" 
                step="0.01" 
                value={sellPrice} 
                onChange={(e) => setSellPrice(e.target.value)} 
                className="bg-foreground/5 border-border/50" 
                required 
              />
            </div>
          </div>

          {isProfit && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <Label>Destination Account</Label>
              <Select value={targetAccountId} onValueChange={(v) => setTargetAccountId(v || "")}>
                <SelectTrigger className="bg-foreground/5 border-border/50 text-foreground">
                  <SelectValue placeholder="Select Bank Account" />
                </SelectTrigger>
                <SelectContent sideOffset={4} className="bg-card/95 backdrop-blur-2xl border-border shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-auto min-w-[280px] z-[100]">
                  {accounts.map(acc => (
                    <SelectItem key={acc.id} value={acc.id} className="cursor-pointer focus:bg-primary/20 transition-colors">
                      <div className="flex flex-col py-1">
                        <span className="font-bold text-sm text-foreground">{acc.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{formatINR(acc.balance)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground italic px-1 pt-1 flex items-center gap-1">
                <Wallet size={10} /> Funds will be added to this account immediately.
              </p>
            </div>
          )}

          <div className={`p-4 rounded-2xl border transition-colors ${isProfit ? "bg-primary/5 border-primary/20" : "bg-red-500/5 border-red-500/20"}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Estimated Summary</span>
              {isProfit ? (
                <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-tighter">
                  <TrendingUp size={12} /> Profit
                </div>
              ) : (
                <div className="flex items-center gap-1 text-red-500 text-[10px] font-black uppercase tracking-tighter">
                  <TrendingDown size={12} /> Loss
                </div>
              )}
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Total Proceeds</p>
                <p className="text-xl font-heading font-black tracking-tight">{formatINR(totalProceeds)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Realized {isProfit ? "Gains" : "Loss"}</p>
                <p className={`text-lg font-heading font-black tracking-tight ${isProfit ? "text-primary" : "text-red-500"}`}>
                  {isProfit ? "+" : ""}{formatINR(profitLoss)}
                </p>
              </div>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={isLoggedIn && (qty <= 0 || qty > holding.quantity || !targetAccountId)}
            className={`w-full font-bold uppercase tracking-widest transition-all ${
              isProfit 
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_rgba(0,255,156,0.3)]" 
                : "bg-red-500 text-white hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            }`}
          >
            {isLoggedIn ? "Confirm & Sell Shares" : "Sign Up to Sell"}
          </Button>
        </form>
      </DialogContent>
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </Dialog>
  );
}

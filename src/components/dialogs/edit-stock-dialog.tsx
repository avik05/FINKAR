"use client";

import React, { useState, useEffect } from "react";
import { Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStocksStore } from "@/stores/stocks-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";
import { StockHolding } from "@/types/finance";

interface EditStockDialogProps {
  holding: StockHolding;
}

export function EditStockDialog({ holding }: EditStockDialogProps) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  
  const updateHolding = useStocksStore((s) => s.updateHolding);
  
  const [symbol, setSymbol] = useState(holding.symbol);
  const [name, setName] = useState(holding.name);
  const [quantity, setQuantity] = useState(holding.quantity.toString());
  const [buyPrice, setBuyPrice] = useState(holding.avgBuyPrice.toString());
  const [currentPrice, setCurrentPrice] = useState(holding.currentPrice.toString());

  // Reset state when holding changes or dialog opens
  useEffect(() => {
    if (open) {
      setSymbol(holding.symbol);
      setName(holding.name);
      setQuantity(holding.quantity.toString());
      setBuyPrice(holding.avgBuyPrice.toString());
      setCurrentPrice(holding.currentPrice.toString());
    }
  }, [holding, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !name.trim() || !quantity) return;

    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }

    updateHolding(holding.id, {
      symbol: symbol.toUpperCase().trim(),
      name: name.trim(),
      quantity: parseFloat(quantity) || 0,
      avgBuyPrice: parseFloat(buyPrice) || 0,
      currentPrice: parseFloat(currentPrice) || (parseFloat(buyPrice) || 0),
    });

    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<button className="flex items-center justify-center p-1.5 rounded-lg hover:bg-primary/20 text-primary transition-all" title="Edit holding" />}>
          <Pencil size={14} />
        </DialogTrigger>
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground">Edit Stock Holding</DialogTitle>
            <DialogDescription className="text-muted-foreground">Modify your equity holding details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock-symbol-edit">Symbol</Label>
                <Input id="stock-symbol-edit" placeholder="RELIANCE" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock-name-edit">Company Name</Label>
                <Input id="stock-name-edit" placeholder="Reliance Industries" value={name} onChange={(e) => setName(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock-qty-edit">Quantity</Label>
              <Input id="stock-qty-edit" type="number" step="1" placeholder="10" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock-buy-edit">Avg Buy Price (₹)</Label>
                <Input id="stock-buy-edit" type="number" step="0.01" placeholder="2450.00" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock-current-edit">Current Price (₹)</Label>
                <Input id="stock-current-edit" type="number" step="0.01" placeholder="2550.00" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
              Update Holding
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

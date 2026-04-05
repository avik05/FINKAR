"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStocksStore } from "@/stores/stocks-store";
import { useAuthStore } from "@/stores/auth-store";
import { AuthRequiredDialog } from "@/components/shared/auth-required-dialog";

export function AddStockDialog() {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();
  
  const addHolding = useStocksStore((s) => s.addHolding);
  
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !name.trim() || !quantity) return;

    if (!isLoggedIn) {
      setAuthPromptOpen(true);
      return;
    }

    addHolding({
      symbol: symbol.toUpperCase().trim(),
      name: name.trim(),
      quantity: parseFloat(quantity) || 0,
      avgBuyPrice: parseFloat(buyPrice) || 0,
      currentPrice: parseFloat(currentPrice) || (parseFloat(buyPrice) || 0),
    });

    // Reset
    setSymbol("");
    setName("");
    setQuantity("");
    setBuyPrice("");
    setCurrentPrice("");
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" size="sm" className="gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20" />}>
          <Plus size={16} /> Add Stock
        </DialogTrigger>
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground">Add Stock Holding</DialogTitle>
            <DialogDescription className="text-muted-foreground">Add a new equity holding to your portfolio.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock-symbol">Symbol</Label>
                <Input id="stock-symbol" placeholder="RELIANCE" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock-name">Company Name</Label>
                <Input id="stock-name" placeholder="Reliance Industries" value={name} onChange={(e) => setName(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock-qty">Quantity</Label>
              <Input id="stock-qty" type="number" step="1" placeholder="10" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock-buy">Avg Buy Price (₹)</Label>
                <Input id="stock-buy" type="number" step="0.01" placeholder="2450.00" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock-current">Current Price (₹)</Label>
                <Input id="stock-current" type="number" step="0.01" placeholder="2550.00" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} className="bg-foreground/5 border-border/50" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
              {isLoggedIn ? "Add Holding" : "Sign Up to Add"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

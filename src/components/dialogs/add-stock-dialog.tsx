"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useStocksStore } from "@/stores/stocks-store";

export function AddStockDialog({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const addHolding = useStocksStore((s) => s.addHolding);

  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [avgPrice, setAvgPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol.trim() || !quantity) return;
    addHolding({
      symbol: symbol.trim().toUpperCase(),
      name: name.trim() || symbol.trim().toUpperCase(),
      quantity: parseInt(quantity) || 0,
      avgBuyPrice: parseFloat(avgPrice) || 0,
      currentPrice: parseFloat(currentPrice) || parseFloat(avgPrice) || 0,
    });
    setSymbol("");
    setName("");
    setQuantity("");
    setAvgPrice("");
    setCurrentPrice("");
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
          <Plus size={16} /> Add Stock
        </DialogTrigger>
      )}
      <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Add Stock Holding</DialogTitle>
          <DialogDescription>Track a new equity position in your portfolio.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stk-symbol">Symbol</Label>
              <Input id="stk-symbol" placeholder="RELIANCE" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="bg-foreground/5 border-border/50 uppercase" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stk-name">Company Name</Label>
              <Input id="stk-name" placeholder="Reliance Industries" value={name} onChange={(e) => setName(e.target.value)} className="bg-foreground/5 border-border/50" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stk-qty">Quantity (Shares)</Label>
            <Input id="stk-qty" type="number" min="1" placeholder="10" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="bg-foreground/5 border-border/50" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stk-avg">Avg. Buy Price (₹)</Label>
              <Input id="stk-avg" type="number" step="0.01" placeholder="2450.00" value={avgPrice} onChange={(e) => setAvgPrice(e.target.value)} className="bg-foreground/5 border-border/50" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stk-cur">Current Price (₹)</Label>
              <Input id="stk-cur" type="number" step="0.01" placeholder="2950.00" value={currentPrice} onChange={(e) => setCurrentPrice(e.target.value)} className="bg-foreground/5 border-border/50" />
            </div>
          </div>
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
            Add to Portfolio
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

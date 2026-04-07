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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SECTORS = [
  "Technology", "Financials", "Healthcare", "Consumer Discretionary", 
  "Consumer Staples", "Energy", "Industrials", "Materials", 
  "Utilities", "Real Estate", "Automobile", "Others"
];

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
  const [sector, setSector] = useState("Others");
  const [exchange, setExchange] = useState<"NSE" | "BSE" | "US">("NSE");

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
      sector,
      exchange,
    });

    // Reset
    setSymbol("");
    setName("");
    setQuantity("");
    setBuyPrice("");
    setCurrentPrice("");
    setSector("Others");
    setExchange("NSE");
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" className="h-10 px-4 rounded-xl gap-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 font-bold transition-all shrink-0 w-full sm:w-auto" />}>
          <Plus size={16} /> <span className="sm:hidden">Add Stock</span><span className="hidden sm:inline">Add Stocks Manually</span>
        </DialogTrigger>
        <DialogContent className="bg-card border-border/50 backdrop-blur-2xl sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-foreground">Add Stock Holding</DialogTitle>
            <DialogDescription className="text-muted-foreground">Add a new equity holding with professional tracking details.</DialogDescription>
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sector</Label>
                <Select value={sector} onValueChange={(v) => setSector(v || "Others")}>
                  <SelectTrigger className="bg-foreground/5 border-border/50 text-foreground">
                    <SelectValue placeholder="Select Sector" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {SECTORS.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Exchange</Label>
                <Select value={exchange} onValueChange={(v: any) => setExchange(v || "NSE")}>
                  <SelectTrigger className="bg-foreground/5 border-border/50 text-foreground">
                    <SelectValue placeholder="NSE" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="NSE">NSE</SelectItem>
                    <SelectItem value="BSE">BSE</SelectItem>
                    <SelectItem value="US">US Market</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1">
              <div className="space-y-2">
                <Label htmlFor="stock-qty">Quantity</Label>
                <Input id="stock-qty" type="number" step="1" placeholder="10" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="bg-foreground/5 border-border/50" required />
              </div>
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

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponsiveDialog } from "@/components/shared/responsive-dialog";

const SECTORS = [
  "Technology", "Financials", "Healthcare", "Consumer Discretionary", 
  "Consumer Staples", "Energy", "Industrials", "Materials", 
  "Utilities", "Real Estate", "Automobile", "Others"
];

interface EditStockDialogProps {
  holding: StockHolding;
}

function EditStockForm({ 
  holding, 
  onSuccess,
  isLoggedIn,
  setAuthPromptOpen 
}: { 
  holding: StockHolding; 
  onSuccess: () => void;
  isLoggedIn: boolean;
  setAuthPromptOpen: (open: boolean) => void;
}) {
  const updateHolding = useStocksStore((s) => s.updateHolding);
  
  const [symbol, setSymbol] = useState(holding.symbol);
  const [name, setName] = useState(holding.name);
  const [quantity, setQuantity] = useState(holding.quantity.toString());
  const [buyPrice, setBuyPrice] = useState(holding.avgBuyPrice.toString());
  const [currentPrice, setCurrentPrice] = useState(holding.currentPrice.toString());
  const [sector, setSector] = useState(holding.sector || "Others");
  const [exchange, setExchange] = useState<"NSE" | "BSE" | "US">(holding.exchange || "NSE");

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
      sector,
      exchange,
    });

    onSuccess();
  };

  return (
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Sector</Label>
          <Select value={sector} onValueChange={(v) => setSector(v || "Others")}>
            <SelectTrigger className="bg-foreground/5 border-border/50 text-foreground h-10">
              <SelectValue placeholder="Select Sector" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {SECTORS.map(s => (
                <SelectItem key={s} value={s} textValue={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Exchange</Label>
          <Select value={exchange} onValueChange={(v) => v && setExchange(v)}>
            <SelectTrigger className="bg-foreground/5 border-border/50 text-foreground h-10">
              <SelectValue placeholder="NSE" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="NSE" textValue="NSE">NSE</SelectItem>
              <SelectItem value="BSE" textValue="BSE">BSE</SelectItem>
              <SelectItem value="US" textValue="US Market">US Market</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1">
        <div className="space-y-2">
          <Label htmlFor="stock-qty-edit">Quantity</Label>
          <Input id="stock-qty-edit" type="number" step="1" placeholder="10" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="bg-foreground/5 border-border/50" required />
        </div>
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
      <Button type="submit" className="w-full bg-primary text-primary-foreground md:hover:bg-primary/90 active:scale-[0.98] transition-all font-semibold shadow-[0_0_20px_rgba(0,255,156,0.2)]">
        {isLoggedIn ? "Update Holding" : "Sign Up to Update"}
      </Button>
    </form>
  );
}

export function EditStockDialog({ holding }: EditStockDialogProps) {
  const [open, setOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);
  const { isLoggedIn } = useAuthStore();

  return (
    <>
      <ResponsiveDialog
        open={open}
        onOpenChange={setOpen}
        title="Edit Stock Holding"
        description="Modify your equity holding details."
        nativeButton={true}
        trigger={
          <button 
            className="flex items-center justify-center p-2 rounded-lg opacity-100 lg:opacity-0 lg:group-hover:opacity-100 md:hover:bg-primary/20 text-primary transition-all active:scale-95 active:bg-primary/10" 
            title="Edit holding"
          >
            <Pencil size={15} />
          </button>
        }
      >
        <EditStockForm 
          key={open ? `edit-${holding.id}-${holding.symbol}` : 'closed'}
          holding={holding}
          isLoggedIn={isLoggedIn}
          setAuthPromptOpen={setAuthPromptOpen}
          onSuccess={() => setOpen(false)}
        />
      </ResponsiveDialog>
      
      <AuthRequiredDialog open={authPromptOpen} setOpen={setAuthPromptOpen} />
    </>
  );
}

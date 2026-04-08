"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, X } from "lucide-react";

export function AuthRequiredDialog({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-card/95 border-border/50 backdrop-blur-2xl sm:max-w-md p-0 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Logo / Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(0,255,156,0.2)] mb-6 animate-float">
            <Sparkles className="text-primary" size={32} />
          </div>

          <DialogTitle className="text-2xl font-heading font-bold text-foreground mb-2">
            Elevate Your Finance Game
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-relaxed mb-8">
            You&apos;re exploring Finkar as a Guest. Sign up now to sync your data across devices, unlock real-time analytics, and secure your financial future.
          </DialogDescription>

          <div className="w-full space-y-3">
            <Button 
              onClick={() => router.push("/login")}
              className="w-full h-12 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,255,156,0.3)] group"
            >
              Sign Up / Login 
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full h-12 bg-foreground/5 border-border/50 hover:bg-foreground/10 text-muted-foreground hover:text-foreground rounded-xl transition-all"
            >
              Continue as Guest
            </Button>
          </div>
        </div>

        <button 
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all"
        >
          <X size={20} />
        </button>

        {/* Ambient blobs */}
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[80px] pointer-events-none" />
      </DialogContent>
    </Dialog>
  );
}

"use client";

import React from "react";
import { WifiOff, RotateCw, Landmark } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center select-none">
      {/* Background Blobs for Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 ambient-blob" />
        <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-primary/5 ambient-blob style={{ animationDelay: '-5s' }}" />
      </div>

      <div className="relative z-10 max-w-sm w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {/* Brand Logo */}
        <div className="flex flex-center justify-center mb-12">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <Landmark size={24} className="text-primary animate-pulse" />
            </div>
            <span className="font-heading font-black text-3xl tracking-tighter uppercase italic text-foreground">
              Finkar
            </span>
          </div>
        </div>

        {/* Offline Illustration/Icon */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center rounded-full bg-secondary/50 border border-border/50 group">
          <WifiOff size={48} className="text-muted-foreground group-hover:text-primary transition-colors duration-500" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin opacity-20" />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-2xl font-heading font-black uppercase tracking-tight text-foreground">
            You&apos;re Currently Offline
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Finkar is having trouble reaching the command center. Check your connection to resume tracking your financial destiny.
          </p>
        </div>

        {/* Actions */}
        <div className="pt-8 space-y-4">
          <button 
            onClick={() => window.location.reload()}
            className="w-full h-12 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-black uppercase text-xs tracking-widest rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 touch-snappy"
          >
            <RotateCw size={16} />
            Retry Connection
          </button>

          <Link 
            href="/dashboard"
            className="block text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors py-2"
          >
            Try Refreshing Dashboard &rarr;
          </Link>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="fixed bottom-8 left-0 right-0 text-center opacity-30">
        <p className="text-[9px] font-black uppercase tracking-[0.5em]">
          Finkar Actionable Finance
        </p>
      </div>
    </div>
  );
}

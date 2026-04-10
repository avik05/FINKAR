"use client";

import React from "react";
import { Download, Sparkles, X } from "lucide-react";
import { usePWAInstall } from "@/hooks/use-pwa-install";

export function InstallCard() {
  const { isInstallable, installApp } = usePWAInstall();
  const [dismissed, setDismissed] = React.useState(false);

  // If not installable or user dismissed it, don't show anything
  if (!isInstallable || dismissed) return null;

  return (
    <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="glass-card p-6 rounded-3xl relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex-shrink-0 animate-float">
            <Sparkles size={24} className="text-primary" />
          </div>
          
          <div className="flex-grow text-center md:text-left space-y-1">
            <h3 className="font-heading font-black uppercase tracking-tight text-lg text-foreground flex items-center justify-center md:justify-start gap-2">
              Get the Finkar App
              <span className="bg-primary/20 text-primary text-[8px] px-1.5 py-0.5 rounded font-black tracking-widest leading-none">ALPHA</span>
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Level up your experience with instant access, full-screen dashboard, and optimized mobile performance.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={installApp}
              className="flex-grow md:flex-grow-0 h-10 px-6 bg-primary text-primary-foreground font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 tap-highlight-none"
            >
              <Download size={14} />
              Install Now
            </button>
            
            <button
              onClick={() => setDismissed(true)}
              className="p-2.5 rounded-xl hover:bg-secondary/80 transition-all text-muted-foreground/40 hover:text-foreground"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

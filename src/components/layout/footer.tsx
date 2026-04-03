"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Heart, Eye } from "lucide-react";

export function Footer() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    // Simulate a realistic visitor counter using localStorage
    const key = "finkar_visitor_count";
    let count = parseInt(localStorage.getItem(key) || "1283");
    
    // Increment the count once per session
    if (!sessionStorage.getItem("finkar_visited")) {
      count += Math.floor(Math.random() * 3) + 1; // Add 1-3 new visitors
      localStorage.setItem(key, count.toString());
      sessionStorage.setItem("finkar_visited", "true");
    }
    
    setVisitorCount(count);
  }, []);

  return (
    <footer className="mt-12 py-8 border-t border-border/40 relative z-10 w-full bg-background/50 backdrop-blur-sm px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-foreground glow-hover cursor-pointer tracking-wider text-lg">FINKAR</span>
            <span className="text-muted-foreground/60">/</span>
            <span className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em]">Actionable Finance. Futuristic Control.</p>
        </div>

        <div className="flex items-center gap-4 order-last md:order-none">
          <Link href="https://github.com/avik05" target="_blank" className="p-2 rounded-full hover:bg-secondary/80 transition-all hover:text-primary glow-hover border border-transparent hover:border-primary/20">
            <Github size={18} />
          </Link>
          <Link href="#" className="p-2 rounded-full hover:bg-secondary/80 transition-all hover:text-primary glow-hover border border-transparent hover:border-primary/20">
            <Twitter size={18} />
          </Link>
          <Link href="#" className="p-2 rounded-full hover:bg-secondary/80 transition-all hover:text-primary glow-hover border border-transparent hover:border-primary/20">
            <Linkedin size={18} />
          </Link>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-3">
          <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/40 text-glow-sm cursor-default transition-all duration-300 hover:border-primary/20 hover:bg-secondary/50">
            <Eye size={14} className="text-primary/70 animate-pulse" />
            <span className="font-mono text-[10px] text-primary/90 font-medium">
              {visitorCount ? visitorCount.toLocaleString() : "..."} visitors established
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/50">
            <span>Made with</span>
            <Heart size={10} className="text-red-500/60 fill-red-500/20" />
            <span>for users who matter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

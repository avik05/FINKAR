"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Landmark, ArrowUpRight, Palette, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTheme, setActiveTheme] = useState("emerald");
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("finkar-theme") || "emerald";
    setTheme(savedTheme);
  }, []);

  const setTheme = (theme: string) => {
    const root = document.documentElement;
    root.classList.remove("dark");
    root.removeAttribute("data-theme");
    
    if (theme === "light") {
      // Stay light
    } else if (theme === "emerald") {
      root.classList.add("dark");
    } else {
      root.classList.add("dark");
      root.setAttribute("data-theme", theme);
    }
    
    localStorage.setItem("finkar-theme", theme);
    setActiveTheme(theme);
  };

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "h-16 bg-background/60 backdrop-blur-xl border-b border-border/10 shadow-sm" 
          : "h-20 bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        {/* --- Logo Area --- */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors border border-primary/20">
            <Landmark size={20} className="text-primary" />
          </div>
          <span className="font-heading font-black tracking-tighter text-xl uppercase italic text-foreground transition-all group-hover:tracking-normal">
            Finkar
          </span>
        </Link>

        {/* --- Actions --- */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all outline-none">
                  <Palette size={18} />
                </button>
              }
            />
            <DropdownMenuContent align="end" className="w-48 p-1 rounded-2xl border-border/50 backdrop-blur-xl">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2">Visual Style</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                
                {[
                  { id: 'emerald', label: 'Emerald', color: '#00FF9C' },
                  { id: 'light', label: 'Daylight', color: '#00C77B' },
                  { id: 'midnight', label: 'Midnight', color: '#FFFFFF' },
                  { id: 'rose', label: 'Rose Gold', color: '#E29578' },
                  { id: 'nord', label: 'Arctic', color: '#7AA2F7' },
                  { id: 'luxury', label: 'Obsidian', color: '#D4AF37' },
                ].map((t) => (
                  <DropdownMenuItem 
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className="flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer focus:bg-primary/10 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: t.color }} />
                      <span className={`text-sm font-medium ${activeTheme === t.id ? 'text-primary' : ''}`}>{t.label}</span>
                    </div>
                    {activeTheme === t.id && <CheckCircle2 size={14} className="text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link 
            href="/dashboard"
            className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background dark:bg-white dark:text-black rounded-full text-xs font-black uppercase tracking-tighter hover:scale-105 active:scale-95 transition-all shadow-xl shadow-foreground/10"
          >
            Dashboard
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Landmark, ArrowUpRight, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
      const isDarkTheme = document.documentElement.classList.contains("dark");
      setIsDark(isDarkTheme);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("finkar-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("finkar-theme", "dark");
    }
    setIsDark(!isDark);
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
          <button 
            onClick={toggleTheme}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

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

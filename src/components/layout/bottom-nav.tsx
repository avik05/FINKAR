"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Landmark, 
  TrendingUp, 
  PieChart, 
  Menu 
} from "lucide-react";
import { useLayoutStore } from "@/stores/layout-store";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Banks", href: "/banks", icon: Landmark },
  { name: "Stocks", href: "/stocks", icon: TrendingUp },
  { name: "Funds", href: "/mutual-funds", icon: PieChart },
];

export function BottomNav() {
  const pathname = usePathname();
  const { toggleMobileMenu } = useLayoutStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[40] md:hidden bg-background/80 backdrop-blur-2xl border-t border-border/10 pb-[env(safe-area-inset-bottom)] sm:pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-around h-16 sm:h-18 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div
              whileTap={{ scale: 0.95 }}
              key={item.name}
              className={cn(
                "relative flex flex-col items-center justify-center w-full h-full gap-1 transition-colors duration-200 tap-highlight-none no-select",
                isActive ? "text-primary transition-none" : "text-muted-foreground"
              )}
            >
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center w-full h-full gap-1"
              >
                <item.icon size={20} className={cn("transition-transform duration-200", isActive && "scale-110")} />
                <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
              </Link>
              
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-indicator"
                  className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full shadow-[0_4px_10px_rgba(0,255,156,0.5)]"
                  transition={{ type: "spring", stiffness: 700, damping: 35, mass: 0.5 }}
                />
              )}
            </motion.div>
          );
        })}

        {/* More/Menu Button */}
        <motion.button
          onClick={toggleMobileMenu}
          className="relative flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground tap-highlight-none no-select"
        >
          <Menu size={20} />
          <span className="text-[10px] font-black uppercase tracking-tighter">More</span>
        </motion.button>
      </div>
    </nav>
  );
}

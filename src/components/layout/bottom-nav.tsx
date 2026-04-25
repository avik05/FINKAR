"use client";

import React, { memo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Landmark, 
  BarChart2, 
  Menu,
  Plus
} from "lucide-react";
import { useLayoutStore } from "@/stores/layout-store";
import { cn } from "@/lib/utils";
import { AddTransactionDialog } from "@/components/dialogs/add-transaction-dialog";

const NAV_ITEMS_LEFT = [
  { name: "Home", href: "/dashboard", icon: LayoutDashboard },
  { name: "Banks", href: "/banks", icon: Landmark },
] as const;

const NAV_ITEMS_RIGHT = [
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
] as const;

/**
 * BottomNav — Mobile navigation bar.
 * 
 * Performance: 
 * - Memoized to prevent re-renders from parent layout changes
 * - Removed Framer Motion (whileTap, layoutId animations) — uses CSS-only
 * - Passive touch handling via CSS `active` pseudo-class
 * - GPU-composited indicator via CSS transform
 */
export const BottomNav = memo(function BottomNav() {
  const pathname = usePathname();
  const { toggleMobileMenu } = useLayoutStore();

  const renderNavItem = (item: { name: string; href: string; icon: React.ElementType }) => {
    const isActive = pathname === item.href;
    return (
      <div
        key={item.name}
        className={cn(
          "relative flex flex-col items-center justify-center w-full h-full gap-1 tap-highlight-none no-select active:scale-95 transition-transform duration-100",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Link
          href={item.href}
          prefetch={true}
          className="flex flex-col items-center justify-center w-full h-full gap-1"
        >
          <item.icon size={20} className={cn(isActive && "scale-110")} />
          <span className="text-[10px] font-black uppercase tracking-tighter">{item.name}</span>
        </Link>
        
        {isActive && (
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full shadow-[0_4px_10px_rgba(0,255,156,0.5)]" />
        )}
      </div>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[40] md:hidden bg-[#121212]/90 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)] sm:pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
      <div className="relative flex items-center justify-around h-16 sm:h-18 px-2 max-w-lg mx-auto">
        
        {/* Left Items */}
        {NAV_ITEMS_LEFT.map(renderNavItem)}

        {/* Center Prominent FAB (Add Transaction) */}
        <div className="relative flex flex-col items-center justify-center w-full h-full z-50">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <AddTransactionDialog>
              <div className="w-14 h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,255,156,0.4)] active:scale-95 transition-transform">
                <Plus size={28} className="text-[#0a0a0a]" strokeWidth={2.5} />
              </div>
            </AddTransactionDialog>
          </div>
        </div>

        {/* Right Items */}
        {NAV_ITEMS_RIGHT.map(renderNavItem)}

        {/* More/Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="relative flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground tap-highlight-none no-select active:scale-95 transition-transform duration-100"
        >
          <Menu size={20} />
          <span className="text-[10px] font-black uppercase tracking-tighter">More</span>
        </button>

      </div>
    </nav>
  );
});

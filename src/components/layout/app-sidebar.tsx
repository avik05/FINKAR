"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";
import {
  LayoutDashboard,
  Landmark,
  TrendingUp,
  PieChart,
  CreditCard,
  BarChart3,
  Target,
  Settings,
  Info,
  ArrowUpRight,
  Globe,
  ExternalLink,
  HelpCircle,
  LifeBuoy,
  MessageSquare
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { Menu, X } from "lucide-react";
import { useLayoutStore } from "@/stores/layout-store";

const navItems = [
  { name: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { name: "Analytics", url: "/analytics", icon: BarChart3 },
  { name: "Banks", url: "/banks", icon: Landmark },
  { name: "Stocks", url: "/stocks", icon: TrendingUp },
  { name: "Mutual Funds", url: "/mutual-funds", icon: PieChart },
  { name: "Expenses", url: "/expenses", icon: CreditCard },
  { name: "Goals", url: "/goals", icon: Target },
  { name: "Settings", url: "/settings", icon: Settings },
  { name: "About", url: "/about", icon: Info },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobileMenuOpen, setMobileMenuOpen } = useLayoutStore();

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-border/10 bg-sidebar flex flex-col transition-transform duration-500 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}`}>
        
        {/* Branding Header */}
        <div className="md:h-24 h-20 flex items-center justify-between px-8 border-b border-border/10 shrink-0">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-0.5 group md:hover:scale-[1.02] transition-all duration-300 relative"
          >
            <span className="text-5xl font-sans font-bold text-foreground tracking-tighter">Fin</span>
            <span className="text-5xl font-sans font-bold text-primary tracking-tighter">कर</span>
            <span className="text-[10px] font-bold text-muted-foreground/60 align-top relative -top-4 ml-0.5">TM</span>
          </Link>

          {/* Mobile Close Button */}
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-3 -mr-2 text-muted-foreground md:hover:text-foreground md:hover:bg-foreground/10 md:hidden rounded-full transition-colors active:bg-foreground/10"
          >
            <X size={28} />
          </button>
        </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto md:py-6 py-6 px-4 scrollbar-hide">
        <nav className="md:space-y-1.5 space-y-4">
          {navItems.map((item) => {
            const isActive = pathname === item.url || pathname?.startsWith(`${item.url}/`);
            return (
              <div key={item.name} className="relative group px-1">
                <Link
                  href={item.url}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 md:py-3.5 py-4 rounded-2xl transition-[background-color,color,border-color,box-shadow] duration-300 group
                      ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(0,255,156,0.05)] border border-primary/20" 
                      : "text-muted-foreground md:hover:bg-foreground/5 md:hover:text-foreground active:bg-foreground/5"
                    }`}
                >
                  <item.icon className={`h-5 w-5 shrink-0 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="font-bold text-sm tracking-wide">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(0,255,156,0.6)] will-change-transform"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 md:pb-4 pb-20 border-t border-border/10 space-y-4 shrink-0 bg-sidebar/20 backdrop-blur-sm">
        <Link 
          href="https://finkar.substack.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block md:p-4 p-3 rounded-2xl bg-primary/5 border border-primary/10 md:hover:bg-primary/10 transition-[background-color] duration-300 group/newsletter overflow-hidden active:bg-primary/10"
        >
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-foreground block truncate">Finkar Newsletter</span>
              <span className="text-[10px] text-muted-foreground block truncate uppercase tracking-tighter">on Substack</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover/newsletter:text-primary group-hover/newsletter:translate-x-1 group-hover/newsletter:-translate-y-1 transition-all" />
          </div>
        </Link>

        <div className="p-1 rounded-[24px] bg-sidebar-accent/5 border border-border/10 flex flex-col gap-1 overflow-hidden transition-all duration-500 md:hover:border-primary/20 active:border-primary/20">
          {/* Top: Market Status (Full width) */}
          <div className="md:p-4 p-3 bg-foreground/[0.02] rounded-t-[20px] rounded-b-[4px] flex flex-col gap-2 border-b border-border/5">
             <div className="flex items-center gap-2 opacity-60">
                <Globe size={12} className="text-muted-foreground" />
                <span className="text-[9px] uppercase tracking-[0.2em] font-black text-muted-foreground">Market Pulse</span>
             </div>
             <MarketStatusIndicator />
          </div>
          
          {/* Bottom: FAQ & Contact (Split) */}
          <div className="grid grid-cols-2 gap-1 px-1 pb-1">
             <Link 
               href="/faq" 
               onClick={() => setMobileMenuOpen(false)}
               className="flex items-center justify-center gap-2 py-3 rounded-bl-[4px] rounded-br-[4px] rounded-tl-[4px] rounded-tr-[4px] bg-foreground/[0.03] md:hover:bg-primary/10 border border-transparent md:hover:border-primary/20 transition-all group active:bg-primary/5"
             >
                <HelpCircle size={14} className="text-muted-foreground md:group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground md:group-hover:text-primary transition-colors">FAQ</span>
             </Link>
             <Link 
               href="/contact" 
               onClick={() => setMobileMenuOpen(false)}
               className="flex items-center justify-center gap-2 py-3 rounded-bl-[20px] rounded-br-[20px] rounded-tl-[4px] rounded-tr-[4px] bg-foreground/[0.03] md:hover:bg-primary/10 border border-transparent md:hover:border-primary/20 transition-all group active:bg-primary/5"
             >
                <LifeBuoy size={14} className="text-muted-foreground md:group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground md:group-hover:text-primary transition-colors">Support</span>
             </Link>
          </div>
        </div>

      </div>
    </aside>
    </>
  );
}

function MarketStatusIndicator() {
  const [status, setStatus] = React.useState(getMarketStatus());

  React.useEffect(() => {
    const interval = setInterval(() => setStatus(getMarketStatus()), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-primary shadow-[0_0_8px_rgba(0,255,156,0.8)] animate-pulse' : 'bg-muted-foreground'}`} />
        <span className="text-sm font-black text-foreground">{status.label}</span>
      </div>
      {!status.isOpen && status.nextOpen && (
        <p className="text-[10px] text-muted-foreground font-medium">{status.nextOpen}</p>
      )}
    </>
  );
}

// NSE/BSE market holidays (YYYY-MM-DD format) — updated for 2025
const NSE_HOLIDAYS_2025 = new Set([
  "2025-01-26", // Republic Day
  "2025-02-26", // Mahashivratri
  "2025-03-14", // Holi
  "2025-03-31", // Id-Ul-Fitr (Ramzan Id)
  "2025-04-10", // Shri Ram Navami
  "2025-04-14", // Dr. Baba Saheb Ambedkar Jayanti
  "2025-04-18", // Good Friday
  "2025-05-01", // Maharashtra Day
  "2025-08-15", // Independence Day
  "2025-08-27", // Ganesh Chaturthi
  "2025-10-02", // Mahatma Gandhi Jayanti
  "2025-10-02", // Dussehra
  "2025-10-20", // Diwali (Laxmi Puja)
  "2025-10-21", // Diwali (Balipratipada)
  "2025-11-05", // Prakash Gurpurb Sri Guru Nanak Dev Ji
  "2025-12-25", // Christmas
]);

function getMarketStatus(): { isOpen: boolean; label: string; nextOpen?: string } {
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const istOffset = 5.5 * 60;
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = utcMinutes + istOffset;
  const istHour = Math.floor((istMinutes % 1440) / 60);
  const istMin = Math.floor(istMinutes % 60);
  const istDay = now.getUTCDay();
  const adjustedDay = istMinutes >= 1440 ? (istDay + 1) % 7 : istDay;

  // Get current IST date as YYYY-MM-DD
  const istDate = new Date(now.getTime() + (istOffset * 60 * 1000));
  const istDateStr = istDate.toISOString().split("T")[0];

  const marketOpen = 9 * 60 + 15;  // 9:15 AM IST
  const marketClose = 15 * 60 + 30; // 3:30 PM IST
  const currentIST = istHour * 60 + istMin;

  const isHoliday = NSE_HOLIDAYS_2025.has(istDateStr);

  if (isHoliday) {
    return { isOpen: false, label: "Market Holiday", nextOpen: "NSE/BSE holiday today" };
  }

  if (adjustedDay === 0 || adjustedDay === 6) {
    return { isOpen: false, label: "Weekend", nextOpen: "Opens Monday 9:15 AM" };
  }

  if (currentIST >= marketOpen && currentIST < marketClose) {
    return { isOpen: true, label: "Markets Open" };
  }

  if (currentIST < marketOpen) {
    return { isOpen: false, label: "Opening Soon", nextOpen: "Today 9:15 AM" };
  }

  return { isOpen: false, label: "Market Closed", nextOpen: "Tomorrow 9:15 AM" };
}

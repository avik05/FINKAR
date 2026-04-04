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

const navItems = [
  { name: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { name: "Banks", url: "/banks", icon: Landmark },
  { name: "Stocks", url: "/stocks", icon: TrendingUp },
  { name: "Mutual Funds", url: "/mutual-funds", icon: PieChart },
  { name: "Expenses", url: "/expenses", icon: CreditCard },
  { name: "Analytics", url: "/analytics", icon: BarChart3 },
  { name: "Goals", url: "/goals", icon: Target },
  { name: "Settings", url: "/settings", icon: Settings },
  { name: "About", url: "/about", icon: Info },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();

  return (
    <Sidebar 
      collapsible="icon"
      className="sticky top-0 h-screen border-r border-border/5 bg-sidebar/30 backdrop-blur-3xl shadow-[20px_0_50px_rgba(0,0,0,0.1)] transition-all duration-500 ease-in-out"
    >
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-border/10 overflow-hidden">
        {/* Placeholder for header alignment — Branding is now in the top bar */}
        <div className="w-10 h-10 rounded-2xl bg-primary/5 flex items-center justify-center group-data-[collapsible=icon]:scale-90 transition-transform">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.url || pathname?.startsWith(`${item.url}/`);
            return (
              <SidebarMenuItem key={item.name} className="py-0.5 flex justify-center">
                <SidebarMenuButton 
                  render={<Link href={item.url} className="flex items-center justify-start group-data-[collapsible=icon]:justify-center w-full" />}
                  isActive={isActive}
                  className={`relative flex items-center justify-start group-data-[collapsible=icon]:justify-center gap-3 px-3 py-6 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:mx-auto rounded-2xl transition-all duration-300 group
                    ${isActive 
                      ? "bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(0,255,156,0.05)] border border-primary/20" 
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                    }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  <span className="font-semibold text-sm tracking-wide group-data-[collapsible=icon]:hidden ml-3">{item.name}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_15px_rgba(0,255,156,0.6)] group-data-[collapsible=icon]:hidden"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-4">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem className="flex justify-center">
            <Link href="https://finkar.substack.com/" target="_blank" rel="noopener noreferrer" className="block p-4 group-data-[collapsible=icon]:p-3 group-data-[collapsible=icon]:w-11 rounded-3xl bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors group/newsletter overflow-hidden">
              <div className="flex items-center justify-start group-data-[collapsible=icon]:justify-center gap-3">
                <LayoutDashboard className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                  <span className="text-xs font-bold text-foreground block truncate">Finkar Newsletter</span>
                  <span className="text-[10px] text-muted-foreground block truncate">on Substack</span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover/newsletter:text-primary group-hover/newsletter:translate-x-1 group-hover/newsletter:-translate-y-1 transition-all group-data-[collapsible=icon]:hidden" />
              </div>
            </Link>
          </SidebarMenuItem>

          <SidebarMenuItem className="flex justify-center">
            <div className="p-4 group-data-[collapsible=icon]:p-3 group-data-[collapsible=icon]:w-11 rounded-3xl bg-sidebar-accent/50 border border-border/40 group/market overflow-hidden">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-start group-data-[collapsible=icon]:justify-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground shrink-0" />
                  <span className="text-xs font-bold text-muted-foreground group-data-[collapsible=icon]:hidden">Market Status</span>
                </div>
                <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
                  <MarketStatusIndicator />
                </div>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
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

  const isWeekday = adjustedDay >= 1 && adjustedDay <= 5;
  const isHoliday = NSE_HOLIDAYS_2025.has(istDateStr);
  const isDuringHours = currentIST >= marketOpen && currentIST < marketClose;

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

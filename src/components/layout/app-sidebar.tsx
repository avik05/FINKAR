"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { ExternalLink } from "lucide-react";
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
  { name: "About", url: "/", icon: Info },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isLoggedIn } = useAuthStore();

  return (
    <Sidebar className="border-r-border bg-sidebar/50 backdrop-blur-md">
      <SidebarHeader className="py-6 px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center translate-x-1">
            <span className="text-4xl font-sans font-bold text-foreground">Fin</span>
            <span className="text-4xl font-sans font-bold text-primary">कर</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.url || pathname?.startsWith(`${item.url}/`);
            return (
              <SidebarMenuItem key={item.name} className="py-1">
                <SidebarMenuButton 
                  render={<Link href={item.url} />}
                  isActive={isActive}
                  className={`relative flex items-center gap-3 px-4 py-6 rounded-xl transition-all duration-300 group
                    ${isActive 
                      ? "bg-primary/10 text-primary hover:bg-primary/20 shadow-[0_4px_20px_rgba(0,255,156,0.05)] translate-x-1" 
                      : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground hover:translate-x-1"
                    }`}
                >
                  <item.icon className={`h-5 w-5 transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-[0_0_8px_rgba(0,255,156,0.5)]" : "group-hover:scale-110"}`} />
                  <span className="font-medium text-sm">{item.name}</span>
                  {isActive && (
                    <span className="absolute left-0 w-1 h-8 bg-primary rounded-r-md blur-[1px] animate-pulse" />
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 space-y-4">
        {/* Guest Indicator */}
        {!isLoggedIn && (
          <div className="px-4 py-2 rounded-lg bg-foreground/5 border border-dashed border-border/50 text-[10px] text-muted-foreground font-medium text-center tracking-wider uppercase">
            Guest Mode
          </div>
        )}
        {/* Substack Link */}
        <Link
          href="https://finkar.substack.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between gap-2 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-200 group"
        >
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-primary">Finkar Newsletter</span>
            <span className="text-[10px] text-muted-foreground">on Substack</span>
          </div>
          <ExternalLink size={14} className="text-primary/60 group-hover:text-primary transition-colors flex-shrink-0" />
        </Link>
        <MarketStatusIndicator />
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
    <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-card border border-border/50 shadow-sm backdrop-blur-sm">
      <span className="text-xs text-muted-foreground">Market Status</span>
      <span className={`text-sm font-semibold flex items-center gap-1.5 ${status.isOpen ? 'text-primary' : 'text-muted-foreground'}`}>
        <span className={`w-2 h-2 rounded-full ${status.isOpen ? 'bg-primary shadow-[0_0_8px_rgba(0,255,156,0.8)] animate-pulse' : 'bg-muted-foreground'}`} />
        {status.label}
      </span>
      {!status.isOpen && status.nextOpen && (
        <span className="text-[10px] text-muted-foreground mt-0.5">{status.nextOpen}</span>
      )}
    </div>
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

  if (isWeekday && isDuringHours) {
    return { isOpen: true, label: "Markets Open" };
  }

  if (isWeekday && currentIST < marketOpen) {
    return { isOpen: false, label: "Markets Closed", nextOpen: "Opens today at 9:15 AM" };
  }
  if (adjustedDay === 5 && currentIST >= marketClose) {
    return { isOpen: false, label: "Markets Closed", nextOpen: "Opens Monday 9:15 AM" };
  }
  if (adjustedDay === 6) {
    return { isOpen: false, label: "Weekend", nextOpen: "Opens Monday 9:15 AM" };
  }
  if (adjustedDay === 0) {
    return { isOpen: false, label: "Weekend", nextOpen: "Opens tomorrow 9:15 AM" };
  }
  return { isOpen: false, label: "Markets Closed", nextOpen: "Opens tomorrow 9:15 AM" };
}

"use client";

import Link from "next/link";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, Calendar, ChevronDown, CheckCircle2, Sun, Moon, Download } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateInsightsFromData, type Insight } from "@/lib/insight-engine";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { useGoalsStore } from "@/stores/goals-store";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useAuthStore } from "@/stores/auth-store";

const DATE_RANGES = [
  { label: "This Week", days: 7 },
  { label: "This Month", days: 30 },
  { label: "Last 3 Months", days: 90 },
  { label: "This Year", days: 365 },
  { label: "All Time", days: 0 },
] as const;

export function Header() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState("This Month");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Auto-hide header state
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Local state to hide notifications marked as read
  const [clearedInsights, setClearedInsights] = useState<Record<string, boolean>>({});

  // Auth
  const { user, logout } = useAuthStore();
  const userInitials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "FI";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Check theme on mount
  useEffect(() => {
    const isDarkTheme = document.documentElement.classList.contains("dark");
    setIsDark(isDarkTheme);
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
  
  const accounts = useAccountsStore((s) => s.accounts);
  const transactions = useTransactionsStore((s) => s.transactions);
  const holdings = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);
  const goals = useGoalsStore((s) => s.goals);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const results: { label: string, type: string, href: string }[] = [];
    
    accounts.forEach(a => {
      if (a.name.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)) {
        results.push({ label: `${a.name} (${a.type})`, type: "Account", href: "/banks" });
      }
    });
    holdings.forEach(h => {
      if (h.symbol.toLowerCase().includes(q) || h.name.toLowerCase().includes(q)) {
        results.push({ label: `${h.name} (${h.symbol})`, type: "Stock", href: "/stocks" });
      }
    });
    funds.forEach(f => {
      if (f.fund.toLowerCase().includes(q) || f.category.toLowerCase().includes(q)) {
        results.push({ label: f.fund, type: "Mutual Fund", href: "/mutual-funds" });
      }
    });
    goals.forEach(g => {
      if (g.name.toLowerCase().includes(q)) {
        results.push({ label: g.name, type: "Goal", href: "/goals" });
      }
    });
    return results.slice(0, 5); // Limit to top 5
  }, [searchQuery, accounts, holdings, funds, goals]);

  const rawInsights: Insight[] = useMemo(() => {
    const now = new Date();
    const thisMonthExpenses = transactions.filter((t) => {
      if (t.amount >= 0) return false;
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthlyExpense = thisMonthExpenses.reduce((s, t) => s + Math.abs(t.amount), 0);
    const totalCash = accounts.reduce((s, a) => s + a.balance, 0);
    const stockValue = holdings.reduce((s, h) => s + h.quantity * h.currentPrice, 0);
    const stockInvested = holdings.reduce((s, h) => s + h.quantity * h.avgBuyPrice, 0);
    const fundValue = funds.reduce((s, f) => s + f.current, 0);
    const fundInvested = funds.reduce((s, f) => s + f.invested, 0);
    const goalsNearComplete = goals
      .filter((g) => g.targetAmount > 0 && g.currentAmount / g.targetAmount >= 0.75 && g.currentAmount < g.targetAmount)
      .map((g) => g.name);

    return generateInsightsFromData({
      accountCount: accounts.length,
      totalCash,
      transactionCount: thisMonthExpenses.length,
      monthlyExpense,
      stockCount: holdings.length,
      stockValue,
      stockInvested,
      fundCount: funds.length,
      fundValue,
      fundInvested,
      goalCount: goals.length,
      goalsNearComplete,
    });
  }, [accounts, transactions, holdings, funds, goals]);

  const insights = rawInsights.filter(i => !clearedInsights[i.id]);

  const markAllAsRead = () => {
    const newCleared = { ...clearedInsights };
    rawInsights.forEach(i => { newCleared[i.id] = true; });
    setClearedInsights(newCleared);
  };

  return (
    <motion.header 
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex h-16 w-full shrink-0 items-center px-4 sm:px-6 bg-background/60 backdrop-blur-xl border-b border-border/50 transition-all duration-300"
    >
      {/* --- Left Column: Sidebar & Search --- */}
      <div className="flex-1 flex items-center gap-2 sm:gap-4">
        <SidebarTrigger className="h-9 w-9 hover:bg-foreground/10 data-[state=open]:bg-foreground/10 transition-all rounded-full shrink-0" />
        <div className="hidden md:flex items-center">
          <div className="relative group" ref={searchContainerRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-[180px] lg:w-[280px] h-9 pl-10 bg-black/5 dark:bg-white/5 border-transparent focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:bg-background rounded-xl transition-all duration-300"
            />
            {/* Search Dropdown overlay */}
            {isSearchOpen && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 mt-3 w-full bg-card/95 border border-border/50 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-[100]">
                {searchResults.length > 0 ? (
                  <ul className="max-h-[300px] overflow-y-auto p-1">
                    {searchResults.map((res, idx) => (
                      <li key={idx}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-primary/10 rounded-xl flex flex-col items-start transition-colors group/res"
                          onClick={() => {
                            setSearchQuery("");
                            setIsSearchOpen(false);
                            router.push(res.href);
                          }}
                        >
                          <span className="font-medium text-sm text-foreground group-hover/res:text-primary transition-colors">{res.label}</span>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">{res.type}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Center Column: Logo --- */}
      <div className="flex-shrink-0 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10 transition-all">
        <Link href="/" className="flex items-center gap-0.5 group scale-90 sm:scale-105 hover:scale-110 transition-all duration-300">
          <span className="text-xl sm:text-2xl font-sans font-bold text-foreground">Fin</span>
          <span className="text-xl sm:text-2xl font-sans font-bold text-primary group-hover:drop-shadow-[0_0_8px_rgba(0,255,156,0.3)] transition-all">कर</span>
        </Link>
      </div>

      {/* --- Right Column: Actions --- */}
      <div className="flex-1 flex items-center justify-end gap-1.5 sm:gap-3">
        
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 h-9 w-9 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title="Toggle Theme"
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-muted-foreground group-hover:text-yellow-400 group-hover:scale-110 transition-all" />
          ) : (
            <Moon className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 group-hover:scale-110 transition-all" />
          )}
        </button>

        {/* Date Range Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="hidden md:flex items-center gap-2 px-4 py-1.5 h-9 rounded-full border border-transparent bg-foreground/5 hover:bg-foreground/10 cursor-pointer transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary" />}>
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground">{dateRange}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card/90 border-border/50 backdrop-blur-xl rounded-2xl p-1 shadow-2xl">
            {DATE_RANGES.map((range) => (
              <DropdownMenuItem
                key={range.label}
                className={`cursor-pointer rounded-xl px-3 py-2 text-xs ${dateRange === range.label ? "bg-primary/10 text-primary font-bold" : "focus:bg-primary/5 focus:text-foreground"}`}
                onClick={() => setDateRange(range.label)}
              >
                {range.label}
                {dateRange === range.label && <span className="ml-auto text-primary">✓</span>}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications — real data-driven insights */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="relative p-2 h-9 w-9 flex items-center justify-center rounded-full hover:bg-foreground/10 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-primary" />}>
            <Bell className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-all" />
            {insights.length > 0 && (
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,156,0.8)] animate-pulse" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 mt-2 bg-card/95 border-border/50 backdrop-blur-xl p-0 overflow-hidden shadow-2xl rounded-2xl">
            <div className="flex items-center justify-between p-4 border-b border-foreground/5 bg-foreground/5">
              <span className="font-bold text-sm tracking-tight">Insights & Alerts</span>
              {insights.length > 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <CheckCircle2 size={10} /> Mark read
                </button>
              ) : null}
            </div>
            <div className="max-h-[350px] overflow-y-auto no-scrollbar p-1">
              {insights.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="text-primary/40" size={20} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">You're all caught up!</span>
                </div>
              ) : (
                insights.map((insight) => (
                  <div key={insight.id} className="p-4 rounded-xl border border-transparent hover:border-foreground/5 hover:bg-foreground/5 transition-all cursor-default group/insight mb-1">
                    <div className="flex justify-between items-start mb-1.5">
                      <h4 className={`text-xs font-bold leading-tight ${insight.severity === 'warning' ? 'text-destructive' : insight.severity === 'positive' ? 'text-primary' : 'text-blue-400'}`}>
                        {insight.title}
                      </h4>
                      <span className="text-[9px] font-medium text-muted-foreground opacity-60 tracking-tight">{insight.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/80 leading-relaxed group-hover/insight:text-muted-foreground transition-colors line-clamp-2">
                      {insight.description}
                    </p>
                    {insight.actionable && insight.actionHref && (
                      <button
                        onClick={() => router.push(insight.actionHref!)}
                        className="mt-3 text-[10px] font-bold uppercase tracking-widest text-primary border border-primary/20 hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all"
                      >
                        {insight.actionLabel}
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile / Auth */}
        {user ? (
          // Logged-in profile dropdown
          <DropdownMenu>
            <DropdownMenuTrigger render={<button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary ring-offset-background transition-transform hover:scale-105 active:scale-95" />}>
              <Avatar className="h-8 w-8 border border-primary/30 shadow-[0_0_12px_rgba(0,255,156,0.15)]">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-[10px]">{userInitials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 mt-2 bg-card/95 border-border/50 backdrop-blur-xl rounded-2xl p-1 shadow-2xl">
              <div className="px-4 py-4 border-b border-border/50 flex items-center gap-3">
                <Avatar className="h-9 w-9 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate opacity-70 tracking-tight">{user.email}</p>
                </div>
              </div>
              <div className="p-1">
                <DropdownMenuItem className="rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-primary/10 focus:text-primary cursor-pointer transition-colors" onClick={() => router.push("/settings")}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-primary/10 focus:text-primary cursor-pointer transition-colors" onClick={() => router.push("/goals")}>
                  Goals
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl px-4 py-2.5 text-xs font-semibold focus:bg-primary/10 focus:text-primary cursor-pointer transition-colors" onClick={() => router.push("/analytics")}>
                  Analytics
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator className="bg-border/50 mx-2" />
              <div className="p-1">
                <DropdownMenuItem
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer transition-colors"
                  onClick={handleLogout}
                >
                  Log out
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Guest — show Sign In button
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 px-5 py-1.5 h-9 rounded-full bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-[0_8px_16px_rgba(0,255,156,0.2)]"
          >
            Sign In
          </button>
        )}
      </div>
    </motion.header>
  );
}

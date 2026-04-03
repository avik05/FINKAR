"use client";

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
  
  // Local state to hide notifications marked as read
  const [clearedInsights, setClearedInsights] = useState<Record<string, boolean>>({});

  // Auth
  const { user, logout } = useAuthStore();
  const userInitials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "FI";

  const handleLogout = () => {
    logout();
    router.push("/login");
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
  
  const handleExport = () => {
    window.print();
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
    <header className="sticky top-0 z-40 flex h-20 shrink-0 w-full items-center gap-4 border-b border-border/40 bg-background/60 px-6 backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2 hover:bg-foreground/5 data-[state=open]:bg-foreground/5 transition-colors" />
        <div className="hidden md:flex items-center">
          <div className="relative group" ref={searchContainerRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search accounts, stocks, or goals..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-[300px] lg:w-[400px] pl-10 bg-card/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary rounded-full transition-all duration-300"
            />
            
            {/* Search Dropdown overlay */}
            {isSearchOpen && searchQuery.trim() !== "" && (
              <div className="absolute top-full left-0 mt-2 w-full bg-card/95 border border-border/50 rounded-xl shadow-xl backdrop-blur-md overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <ul className="max-h-[300px] overflow-y-auto">
                    {searchResults.map((res, idx) => (
                      <li key={idx}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-foreground/5 flex flex-col items-start transition-colors"
                          onClick={() => {
                            setSearchQuery("");
                            setIsSearchOpen(false);
                            router.push(res.href);
                          }}
                        >
                          <span className="font-medium text-sm text-foreground">{res.label}</span>
                          <span className="text-xs text-muted-foreground mt-0.5">{res.type}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-6 text-center text-muted-foreground text-sm">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
        
        {/* Export / Print Report */}
        <button 
          onClick={handleExport}
          className="p-2 rounded-full hover:bg-foreground/10 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary hidden sm:block tooltip-trigger"
          title="Export Report"
        >
          <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-foreground/10 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary"
          title="Toggle Theme"
        >
          {isDark ? (
            <Sun className="h-5 w-5 text-muted-foreground group-hover:text-yellow-400 transition-colors" />
          ) : (
            <Moon className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 transition-colors" />
          )}
        </button>

        {/* Date Range Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card/50 hover:bg-card/80 cursor-pointer transition-colors backdrop-blur-sm outline-none focus-visible:ring-2 focus-visible:ring-primary" />}>
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{dateRange}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 bg-card border-border/50 backdrop-blur-xl">
            {DATE_RANGES.map((range) => (
              <DropdownMenuItem
                key={range.label}
                className={`cursor-pointer ${dateRange === range.label ? "text-primary font-semibold" : "focus:bg-foreground/5 focus:text-foreground"}`}
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
          <DropdownMenuTrigger render={<button className="relative p-2 rounded-full hover:bg-foreground/10 transition-colors group outline-none focus-visible:ring-2 focus-visible:ring-primary" />}>
            <Bell className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            {insights.length > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,255,156,0.8)] animate-pulse" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-card/90 border-border/50 backdrop-blur-xl p-0 overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-foreground/5 bg-black/20">
              <span className="font-semibold font-heading">Insights & Alerts</span>
              {insights.length > 0 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CheckCircle2 size={12} /> Mark read
                </button>
              ) : null}
            </div>
            <div className="max-h-[350px] overflow-y-auto no-scrollbar">
              {insights.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  You're all caught up!
                </div>
              ) : (
                insights.map((insight) => (
                  <div key={insight.id} className="p-4 border-b border-foreground/5 hover:bg-foreground/5 transition-colors cursor-default group/insight">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-semibold flex items-center gap-2 ${insight.severity === 'warning' ? 'text-destructive' : insight.severity === 'positive' ? 'text-primary' : 'text-blue-400'}`}>
                        {insight.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">{insight.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground/80 leading-relaxed group-hover/insight:text-muted-foreground transition-colors">
                      {insight.description}
                    </p>
                    {insight.actionable && insight.actionHref && (
                      <button
                        onClick={() => router.push(insight.actionHref!)}
                        className="mt-3 text-xs font-medium text-foreground bg-foreground/5 hover:bg-foreground/10 px-3 py-1.5 rounded-lg border border-foreground/10 transition-colors"
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
              <Avatar className="h-9 w-9 border border-primary/30 shadow-[0_0_12px_rgba(0,255,156,0.2)]">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">{userInitials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-card border-border/50 backdrop-blur-xl">
              <div className="px-4 py-3 border-b border-border/50">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="focus:bg-foreground/5 focus:text-foreground cursor-pointer" onClick={() => router.push("/settings")}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-foreground/5 focus:text-foreground cursor-pointer" onClick={() => router.push("/goals")}>
                Goals
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-foreground/5 focus:text-foreground cursor-pointer" onClick={() => router.push("/analytics")}>
                Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
                onClick={handleLogout}
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Guest — show Sign In button
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 hover:border-primary/50 transition-all shadow-[0_0_12px_rgba(0,255,156,0.15)] hover:shadow-[0_0_20px_rgba(0,255,156,0.3)]"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Bell,
  Search,
  Calendar,
  ChevronDown,
  CheckCircle2,
  Sun,
  Moon,
  Download,
  Menu,
  X,
} from "lucide-react";
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
import { useLayoutStore } from "@/stores/layout-store";

const DATE_RANGES = [
  { label: "This Week", days: 7 },
  { label: "This Month", days: 30 },
  { label: "Last 3 Months", days: 90 },
  { label: "This Year", days: 365 },
  { label: "All Time", days: 0 },
] as const;

export function Header() {
  const router = useRouter();
  const { toggleMobileMenu } = useLayoutStore();
  const [dateRange, setDateRange] = useState<string>("This Month");
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
        results.push({ label: a.name, type: "Bank Account", href: "/banks" });
      }
    });
    
    holdings.forEach(h => {
      if (h.symbol.toLowerCase().includes(q)) {
        results.push({ label: h.symbol, type: "Stock", href: "/stocks" });
      }
    });

    funds.forEach(f => {
      if (f.fund.toLowerCase().includes(q)) {
        results.push({ label: f.fund, type: "Mutual Fund", href: "/mutual-funds" });
      }
    });

    goals.forEach(g => {
      if (g.name.toLowerCase().includes(q)) {
        results.push({ label: g.name, type: "Goal", href: "/goals" });
      }
    });

    return results;
  }, [searchQuery, accounts, holdings, funds, goals]);

  const rawInsights = useMemo(() => {
    const totalCash = accounts.reduce((acc, curr) => acc + curr.balance, 0);
    const dateLimit = new Date();
    dateLimit.setDate(1); 
    const thisMonthExpenses = transactions.filter((t) => t.amount < 0 && new Date(t.date) >= dateLimit);
    const monthlyExpense = Math.abs(thisMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0));
    const stockValue = holdings.reduce((acc, curr) => acc + (curr.quantity * curr.currentPrice), 0);
    const stockInvested = holdings.reduce((acc, curr) => acc + (curr.quantity * curr.avgBuyPrice), 0);
    const fundValue = funds.reduce((acc, curr) => acc + curr.current, 0);
    const fundInvested = funds.reduce((acc, curr) => acc + curr.invested, 0);
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
    <header 
      className={`fixed top-0 right-0 z-40 flex h-16 md:left-64 shrink-0 items-center px-4 sm:px-6 bg-background/60 backdrop-blur-xl border-b border-border/50 transition-all duration-300 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* Mobile Menu Trigger */}
      <button 
        onClick={toggleMobileMenu}
        className="mr-4 p-2 text-muted-foreground hover:text-foreground md:hidden rounded-full hover:bg-foreground/5 transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* --- Left Column: Search --- */}
      <div className="flex-1 flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center">
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

      {/* --- Right Column: Actions --- */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Date Range Selector */}
        <DropdownMenu>
          <DropdownMenuTrigger className="hidden sm:flex items-center gap-2 px-3 py-1.5 h-9 rounded-xl hover:bg-foreground/5 transition-all text-xs font-bold text-muted-foreground outline-none">
            <Calendar size={14} />
            <span>{dateRange}</span>
            <ChevronDown size={14} className="ml-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1 rounded-2xl border-border/50 backdrop-blur-xl">
             <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground px-3 py-2">Select Range</DropdownMenuLabel>
             <DropdownMenuSeparator className="bg-border/50" />
             <DropdownMenuGroup>
               {DATE_RANGES.map((r) => (
                 <DropdownMenuItem 
                   key={r.label}
                   onClick={() => setDateRange(r.label)}
                   className="flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer focus:bg-primary/10 group"
                 >
                   <span className="text-sm font-medium">{r.label}</span>
                   {dateRange === r.label && <CheckCircle2 size={14} className="text-primary" />}
                 </DropdownMenuItem>
               ))}
             </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Export Button */}
        <button className="hidden sm:flex items-center gap-2 p-2 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all">
          <Download size={18} />
        </button>

        <div className="h-4 w-[1px] bg-border/50 mx-2 hidden sm:block" />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative p-2 text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all outline-none">
            <Bell size={18} />
            {insights.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(0,255,156,0.8)] animate-pulse" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] sm:w-[380px] p-2 rounded-3xl border-border/50 backdrop-blur-2xl shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight uppercase">Intelligence</span>
                <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">{insights.length}</span>
              </div>
              {insights.length > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-[10px] font-bold text-primary hover:underline transition-all"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
              {insights.length > 0 ? (
                <div className="space-y-2">
                  {insights.map((insight) => (
                    <motion.div 
                      key={insight.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-2xl bg-foreground/[0.03] border border-border/40 hover:border-primary/20 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl bg-background border border-border/50 text-foreground group-hover:text-primary transition-colors`}>
                          {insight.severity === 'positive' ? <CheckCircle2 size={16} /> : <Info size={16} />}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-xs font-bold leading-tight">{insight.title}</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{insight.description}</p>
                        </div>
                        <button 
                          onClick={() => setClearedInsights(prev => ({ ...prev, [insight.id]: true }))}
                          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-40 italic">
                  <div className="p-4 rounded-full bg-foreground/5 mb-4">
                    <CheckCircle2 size={32} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm">Everything is optimized.</p>
                </div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-9 w-9 border-2 border-border/50 hover:border-primary/50 transition-all cursor-pointer ring-offset-2 ring-offset-background hover:ring-2 hover:ring-primary/20 rounded-full overflow-hidden outline-none">
            <Avatar className="h-full w-full">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-border/50 backdrop-blur-xl">
            <div className="px-3 py-3 space-y-1">
              <p className="text-sm font-black text-foreground truncate">{user?.name || 'Guest User'}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">{user?.email || 'Public Session'}</p>
            </div>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-foreground/5">
                <Settings size={16} className="text-muted-foreground" />
                <span className="text-sm font-bold">Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-destructive/10 text-destructive group"
              >
                <Download size={16} className="group-hover:rotate-180 transition-transform" />
                <span className="text-sm font-bold">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

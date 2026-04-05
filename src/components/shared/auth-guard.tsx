"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useAccountsStore } from "@/stores/accounts-store";
import { useGoalsStore } from "@/stores/goals-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";

// Routes that logged-in users should be redirected away from (Auth Wall)
const AUTH_ROUTES = ["/login"];

// ONLY sensitive routes are strictly protected. 
// Dashboard, Analytics, etc. are now accessible to guests with sample data.
const PROTECTED_ROUTES = ["/settings"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn, isLoading, initialize } = useAuthStore();
  const { fetchTransactions } = useTransactionsStore();
  const { fetchAccounts } = useAccountsStore();
  const { fetchGoals } = useGoalsStore();
  const { fetchHoldings } = useStocksStore();
  const { fetchFunds } = useMutualFundsStore();
  
  const router = useRouter();
  const pathname = usePathname();

  // Initialize auth on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Sync data stores based on auth state
  useEffect(() => {
    if (isLoading) return;

    // If logged in, fetch user's data. If guest, fetchTransactions(null) loads sample data.
    const userId = isLoggedIn ? user?.id ?? null : null;
    
    fetchTransactions(userId);
    fetchAccounts(userId);
    fetchGoals(userId);
    fetchHoldings(userId);
    fetchFunds(userId);

  }, [isLoggedIn, isLoading, user?.id, fetchTransactions, fetchAccounts, fetchGoals, fetchHoldings, fetchFunds]);

  useEffect(() => {
    if (isLoading) return;

    // 1. Redirect logged-in users away from /login
    if (isLoggedIn && AUTH_ROUTES.includes(pathname)) {
      router.replace("/dashboard");
    }

    // 2. Redirect guests away from strictly protected routes (like settings)
    const isStrictlyProtected = PROTECTED_ROUTES.some(route => 
      pathname === route || pathname?.startsWith(`${route}/`)
    );

    if (!isLoggedIn && isStrictlyProtected) {
      router.replace("/login");
    }
  }, [isLoggedIn, isLoading, pathname, router]);

  // Initial session loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Syncing Engine</p>
        </div>
      </div>
    );
  }

  // Prevent flash of protected content
  if (!isLoggedIn && PROTECTED_ROUTES.some(r => pathname?.startsWith(r))) return null;
  if (isLoggedIn && AUTH_ROUTES.includes(pathname)) return null;

  return <>{children}</>;
}

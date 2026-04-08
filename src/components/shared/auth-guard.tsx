"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { supabase } from "@/lib/supabase";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useAccountsStore } from "@/stores/accounts-store";
import { useGoalsStore } from "@/stores/goals-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";

// Routes that logged-in users should be redirected away from (Auth Wall)
const AUTH_ROUTES = ["/login"];

// Sensitive routes that require a VERIFIED account if logged in
const SENSITIVE_ROUTES = ["/dashboard", "/banks", "/stocks", "/mutual-funds", "/expenses", "/goals", "/analytics", "/settings"];

// Verification page
const VERIFY_ROUTE = "/auth/verify";

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

    // If logged in, fetch user's data. 
    // If guest (isLoggedIn is false), fetch(null) loads sample data.
    const canSeeData = isLoggedIn;
    const userId = canSeeData ? user?.id ?? null : null;
    
    fetchTransactions(userId);
    fetchAccounts(userId);
    fetchGoals(userId);
    fetchHoldings(userId);
    fetchFunds(userId);

  }, [isLoggedIn, isLoading, user?.id, user?.isEmailVerified, fetchTransactions, fetchAccounts, fetchGoals, fetchHoldings, fetchFunds]);

  useEffect(() => {
    if (isLoading) return;

    // 1. Redirect logged-in users away from /login
    if (isLoggedIn && AUTH_ROUTES.includes(pathname)) {
      if (user && !user.isEmailVerified) {
        router.replace("/auth/verify");
      } else {
        router.replace("/dashboard");
      }
      return;
    }

    // 2. We no longer force-redirect unverified users to /auth/verify for Dashboard/Finance.
    // This allows them to use the app immediately after synchronization.

    // 3. Redirect guests away from strictly protected routes
    const isStrictlyProtected = ["/settings"].some(route => 
      pathname === route || pathname?.startsWith(`${route}/`)
    );

    if (!isLoggedIn && isStrictlyProtected) {
      router.replace("/login");
    }
  }, [isLoggedIn, user?.isEmailVerified, isLoading, pathname, router]);

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

  // Prevent flash of protected content and redirect unverified users
  if (isLoggedIn && !user?.isEmailVerified) {
    if (SENSITIVE_ROUTES.some(r => pathname === r || pathname?.startsWith(`${r}/`))) {
      router.replace("/auth/verify");
      return null;
    }
  }

  // Final check for strictly protected routes (guests)
  const isStrictlyProtected = ["/settings"].some(r => 
    pathname === r || pathname?.startsWith(`${r}/`)
  );
  if (!isLoggedIn && isStrictlyProtected) return null;

  // Block Auth routes for logged-in verified users
  if (isLoggedIn && user?.isEmailVerified && AUTH_ROUTES.includes(pathname)) return null;

  return <>{children}</>;
}

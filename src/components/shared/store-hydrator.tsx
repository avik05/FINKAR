"use client";

import { useEffect, useRef } from "react";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { SAMPLE_ACCOUNTS, SAMPLE_STOCKS, SAMPLE_MUTUAL_FUNDS, SAMPLE_TRANSACTIONS } from "@/data/sample-data";

export function StoreHydrator() {
  const accountsStore = useAccountsStore();
  const transactionsStore = useTransactionsStore();
  const stocksStore = useStocksStore();
  const fundsStore = useMutualFundsStore();
  
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    
    // Safety check: Avoid running outside browser
    if (typeof window === "undefined") return;

    // Check if we already seeded sample data for v3
    const isSeeded = localStorage.getItem("finkar-seeded-v3");
    if (isSeeded) {
      initialized.current = true;
      return;
    }

    // Check if the stores are actually empty.
    const hasAccounts = accountsStore.accounts.length > 0;
    const hasTransactions = transactionsStore.transactions.length > 0;
    const hasStocks = stocksStore.holdings.length > 0;
    const hasFunds = fundsStore.funds.length > 0;

    if (!hasAccounts && !hasTransactions && !hasStocks && !hasFunds) {
      console.log("Hydrating store with sample data for demonstration...");
      
      // Mark as seeded IMMEDIATELY so React Strict Mode second render doesn't double-seed
      localStorage.setItem("finkar-seeded-v3", "true");
      
      // Add accounts first to get IDs
      SAMPLE_ACCOUNTS.forEach(acc => accountsStore.addAccount(acc));
      SAMPLE_STOCKS.forEach(stk => stocksStore.addHolding(stk));
      SAMPLE_MUTUAL_FUNDS.forEach(fund => fundsStore.addFund(fund));
      
      // Delay transactions briefly to allow accounts to be stored
      setTimeout(() => {
        const latestAccounts = useAccountsStore.getState().accounts;
        const accountIds = latestAccounts.map((a: any) => a.id);
        SAMPLE_TRANSACTIONS(accountIds).forEach(tx => transactionsStore.addTransaction(tx));
        initialized.current = true;
      }, 100);
    } else {
      // Data already exists physically in store, mark as seeded
      localStorage.setItem("finkar-seeded-v3", "true");
      initialized.current = true;
    }
  }, [accountsStore, transactionsStore, stocksStore, fundsStore]);

  return null;
}

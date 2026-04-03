"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { useAuthStore } from "@/stores/auth-store";
import { formatINR } from "@/lib/format";

type ChatMessage = {
  id: string;
  sender: "user" | "ai";
  text: string;
};

export function AiChatbotPanel() {
  const { user } = useAuthStore();
  const firstName = user?.name?.split(" ")[0] || "there";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_0",
      sender: "ai",
      text: `Hi ${firstName}! I'm your Finkar AI assistant. Ask me about your net worth, expenses, income, stocks, or mutual funds.`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live store data
  const accounts = useAccountsStore((s) => s.accounts);
  const transactions = useTransactionsStore((s) => s.transactions);
  const stocks = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Update greeting when user changes
  useEffect(() => {
    setMessages([
      {
        id: "msg_0",
        sender: "ai",
        text: `Hi ${firstName}! I'm your Finkar AI assistant. Ask me about your net worth, expenses, income, stocks, or mutual funds.`,
      },
    ]);
  }, [firstName]);

  const processQuery = (query: string): string => {
    const q = query.toLowerCase().trim();

    // Derived computations from stores
    const cashBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
    const liquidCash = accounts.filter(a => a.balance > 0).reduce((sum, a) => sum + a.balance, 0);

    const stockValue = stocks.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0);
    const stockInvested = stocks.reduce((sum, s) => sum + s.avgBuyPrice * s.quantity, 0);
    const stockPnl = stockValue - stockInvested;
    const stockReturn = stockInvested > 0 ? (stockPnl / stockInvested) * 100 : 0;

    const mfValue = funds.reduce((sum, f) => sum + f.current, 0);
    const mfInvested = funds.reduce((sum, f) => sum + f.invested, 0);
    const mfPnl = mfValue - mfInvested;

    const netWorth = liquidCash + stockValue + mfValue;
    const invested = stockValue + mfValue;

    const now = new Date();
    const currentMonthTx = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const monthlyExpense = currentMonthTx
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const monthlyIncome = currentMonthTx
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome * 100) : 0;

    // Top expense category
    const categoryMap: Record<string, number> = {};
    transactions.filter(t => t.amount < 0).forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + Math.abs(t.amount);
    });
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

    // Best performing stock
    const bestStock = stocks.reduce<typeof stocks[0] | null>((best, s) => {
      const ret = (s.currentPrice - s.avgBuyPrice) / s.avgBuyPrice;
      if (!best) return s;
      const bestRet = (best.currentPrice - best.avgBuyPrice) / best.avgBuyPrice;
      return ret > bestRet ? s : best;
    }, null);

    // --- Intent matching ---
    if (q.match(/\b(hi|hello|hey|good morning|good evening|sup)\b/)) {
      return `Hello! How can I help you manage your finances today, ${firstName}?`;
    }

    if (q.match(/\bnet worth\b/)) {
      return `Your total net worth is ${formatINR(netWorth)} — comprising ${formatINR(liquidCash)} in liquid cash and ${formatINR(invested)} in investments.`;
    }

    if (q.match(/\b(cash|liquid|balance|bank|accounts?)\b/)) {
      if (accounts.length === 0) return "You haven't added any bank accounts yet. Head to Banks & Cards to add one.";
      return `You have ${formatINR(liquidCash)} in liquid savings across ${accounts.length} account${accounts.length !== 1 ? "s" : ""}. Your total balance (including credit) is ${formatINR(cashBalance)}.`;
    }

    if (q.match(/\b(spend|spent|expense|expenses)\b/)) {
      if (currentMonthTx.length === 0) return "No transactions recorded this month yet.";
      const resp = `You've spent ${formatINR(monthlyExpense)} this month on ${currentMonthTx.filter(t => t.amount < 0).length} transactions.`;
      return topCategory
        ? `${resp} Your biggest expense category is ${topCategory[0]} (${formatINR(topCategory[1])}).`
        : resp;
    }

    if (q.match(/\b(income|earn|salary|credited)\b/)) {
      if (monthlyIncome === 0) return "No income recorded this month. Add a transaction with a positive amount to track earnings.";
      return `Your total income this month is ${formatINR(monthlyIncome)}. Your savings rate is ${savingsRate.toFixed(1)}%.`;
    }

    if (q.match(/\b(saving|savings rate)\b/)) {
      if (monthlyIncome === 0) return "I need at least one income transaction to calculate your savings rate.";
      return `This month you're saving ${formatINR(monthlyIncome - monthlyExpense)}, which is a ${savingsRate.toFixed(1)}% savings rate. ${savingsRate > 30 ? "Great discipline!" : "Try to aim for 30% or more."}`;
    }

    if (q.match(/\b(stock|stocks|equity|portfolio|holdings?)\b/)) {
      if (stocks.length === 0) return "You haven't added any stock holdings yet. Go to Stocks to add them.";
      const gainLabel = stockPnl >= 0 ? "up" : "down";
      let reply = `Your stock portfolio is worth ${formatINR(stockValue)} (invested ${formatINR(stockInvested)}), ${gainLabel} ${Math.abs(stockReturn).toFixed(1)}% (${formatINR(Math.abs(stockPnl))}).`;
      if (bestStock) {
        const bestRet = ((bestStock.currentPrice - bestStock.avgBuyPrice) / bestStock.avgBuyPrice * 100).toFixed(1);
        reply += ` Your best performer is ${bestStock.symbol} at +${bestRet}%.`;
      }
      return reply;
    }

    if (q.match(/\b(mutual fund|mf|sip|fund|funds)\b/)) {
      if (funds.length === 0) return "You haven't added any mutual funds yet. Go to Mutual Funds to add them.";
      const gainLabel = mfPnl >= 0 ? "up" : "down";
      return `Your ${funds.length} mutual fund${funds.length !== 1 ? "s" : ""} are currently valued at ${formatINR(mfValue)} (invested ${formatINR(mfInvested)}), ${gainLabel} by ${formatINR(Math.abs(mfPnl))}. Total SIP: ${formatINR(funds.reduce((sum, f) => sum + f.sipAmount, 0))}/month.`;
    }

    if (q.match(/\b(top|biggest|largest|most) (spend|expens|categor)/)) {
      if (!topCategory) return "No expense transactions found yet.";
      return `Your biggest spending category is ${topCategory[0]} at ${formatINR(topCategory[1])}.`;
    }

    if (q.match(/\b(invest|invested|investments?)\b/)) {
      return `You have ${formatINR(invested)} invested — ${formatINR(stockValue)} in stocks and ${formatINR(mfValue)} in mutual funds. Total P&L: ${formatINR(stockPnl + mfPnl)}.`;
    }

    if (q.match(/\bhelp\b/)) {
      return "I can answer questions like: 'What is my net worth?', 'How much did I spend this month?', 'How is my stock portfolio performing?', 'What are my mutual fund returns?', or 'What is my savings rate?'";
    }

    return "I'm not sure about that yet! Try asking: 'What is my net worth?', 'How much did I spend this month?', or 'How is my portfolio doing?'";
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: ChatMessage = { id: `msg_${Date.now()}`, sender: "user", text: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // Simulate brief thinking delay
    setTimeout(() => {
      const responseText = processQuery(userMsg.text);
      setMessages((prev) => [...prev, { id: `msg_${Date.now() + 1}`, sender: "ai", text: responseText }]);
    }, 500);
  };

  return (
    <>
      {/* FAB button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 p-4 bg-primary text-primary-foreground rounded-full shadow-[0_0_20px_rgba(0,255,156,0.5)] hover:scale-110 transition-all duration-300 z-50 ${
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
        }`}
      >
        <Sparkles size={24} />
      </button>

      {/* Chat panel */}
      <div
        className={`fixed bottom-6 right-6 lg:bottom-10 lg:right-10 w-[350px] sm:w-[400px] h-[520px] bg-card/90 backdrop-blur-2xl border border-border/50 shadow-2xl rounded-2xl flex flex-col z-50 transition-all duration-500 origin-bottom-right ${
          isOpen ? "scale-100 opacity-100" : "scale-75 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-foreground/10 bg-primary/10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <h3 className="font-heading font-semibold text-sm">Finkar AI</h3>
            <span className="text-[10px] font-medium px-1.5 py-0.5 bg-primary/20 text-primary rounded-full">Beta</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-foreground/10 rounded-lg transition-colors"
          >
            <X size={18} className="text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-secondary border border-border/50 text-foreground rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-3 pb-2 flex flex-wrap gap-1.5">
            {["Net worth?", "This month's spend?", "Stock returns?", "Savings rate?"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInputValue(s);
                }}
                className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSend} className="p-3 border-t border-foreground/10 bg-background/30 rounded-b-2xl">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about your finances..."
              className="w-full bg-card border border-border/50 rounded-full py-3 px-4 pr-12 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 p-2 bg-primary/20 text-primary rounded-full hover:bg-primary hover:text-primary-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={15} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

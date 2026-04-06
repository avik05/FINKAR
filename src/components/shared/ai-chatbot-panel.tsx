"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { formatINR } from "@/lib/format";
import { getFinancialSnapshot, generateSmartResponse, AIResponse } from "@/lib/ai-logic";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import { useAuthStore } from "@/stores/auth-store";
import { useGoalsStore } from "@/stores/goals-store";

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
  const goals = useGoalsStore((s) => s.goals);

  const [isThinking, setIsThinking] = useState(false);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>(["Net worth?", "This month's spend?", "Financial advice?"]);

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

  const handleSend = (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const text = overrideText || inputValue;
    if (!text.trim() || isThinking) return;
  
    const userMsg: ChatMessage = { id: `msg_${Date.now()}`, sender: "user", text: text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);
  
    // Small delay to simulate "intelligence"
    setTimeout(() => {
      const snapshot = getFinancialSnapshot({ accounts, transactions, stocks, funds, goals });
      const response: AIResponse = generateSmartResponse(text, snapshot, firstName);
      
      setMessages((prev) => [...prev, { id: `msg_${Date.now() + 1}`, sender: "ai", text: response.text }]);
      if (response.suggestions) setCurrentSuggestions(response.suggestions);
      setIsThinking(false);
    }, 800);
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm shadow-lg shadow-primary/10"
                    : "bg-secondary border border-border/30 text-foreground rounded-bl-sm shadow-sm"
                }`}
              >
                {msg.text.split(/(\*\*.*?\*\*)/g).map((part, i) => 
                  part.startsWith('**') && part.endsWith('**') 
                    ? <strong key={i} className="text-primary-foreground dark:text-primary brightness-125">{part.slice(2, -2)}</strong> 
                    : part
                )}
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-secondary border border-border/30 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce shadow-[0_0_5px_rgba(0,255,156,0.5)]" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce shadow-[0_0_5px_rgba(0,255,156,0.5)]" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce shadow-[0_0_5px_rgba(0,255,156,0.5)]" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="px-3 pb-3 flex flex-wrap gap-1.5 justify-end">
          {currentSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(undefined, s)}
              disabled={isThinking}
              className="text-[10px] uppercase font-black px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
            >
              {s}
            </button>
          ))}
        </div>

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

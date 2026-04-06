"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { FinanceCard } from "@/components/ui/finance-card";
import { Mail, RefreshCw, LogOut, ShieldCheck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function VerifyPage() {
  const router = useRouter();
  const { user, logout, refreshUser, isLoggedIn } = useAuthStore();
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");

  // Auto-redirect if verified
  useEffect(() => {
    if (isLoggedIn && user?.isEmailVerified) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, user?.isEmailVerified, router]);

  const handleRefresh = async () => {
    setChecking(true);
    setMessage("");
    try {
      await refreshUser();
      // Logic inside refreshUser updates the store, which triggers the useEffect above
      setMessage("Status refreshed. If you've verified, you'll be redirected soon.");
    } catch (err) {
      setMessage("Failed to refresh. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  if (!isLoggedIn) {
    return null; // AuthGuard will handle redirection to login
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background fixed inset-0 z-50 p-4">
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg z-10"
      >
        <FinanceCard className="p-8 md:p-12 text-center relative overflow-hidden group">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShieldCheck size={120} className="text-primary" />
          </div>

          <div className="flex flex-col items-center gap-6">
            {/* Animated Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative h-24 w-24 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(0,255,156,0.2)]">
                <Mail size={48} className="animate-bounce-slow" />
              </div>
            </div>

            <div className="space-y-3 max-w-sm">
              <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">Verify Your Email</h1>
              <p className="text-muted-foreground leading-relaxed">
                We've sent a secure verification link to <br/>
                <span className="text-primary font-bold">{user?.email}</span>
              </p>
            </div>

            <div className="w-full space-y-4 pt-4">
              <div className="p-4 rounded-2xl bg-foreground/5 border border-border/50 text-xs text-muted-foreground leading-relaxed backdrop-blur-sm">
                Can't find the email? Check your <span className="text-foreground font-semibold uppercase tracking-tighter">Spam</span> folder. 
                Verification ensures your financial data stays exclusive to you.
              </div>

              {message && (
                <motion.p 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs font-medium text-primary animate-pulse"
                >
                  {message}
                </motion.p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={checking}
                  className="h-12 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,255,156,0.2)] active:scale-[0.98] disabled:opacity-50"
                >
                  {checking ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                  Check Status
                </button>
                
                <button
                  onClick={handleLogout}
                  className="h-12 flex items-center justify-center gap-2 bg-foreground/10 text-foreground font-bold rounded-xl hover:bg-foreground/15 transition-all active:scale-[0.98]"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>

              <button 
                onClick={() => router.push("/login")}
                className="flex items-center justify-center gap-2 w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2 font-medium"
              >
                <ArrowLeft size={14} />
                Try another account
              </button>
            </div>
          </div>
        </FinanceCard>

        {/* Brand signature */}
        <div className="mt-8 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/40">
            Finkar Dashboard Security
          </p>
        </div>
      </motion.div>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

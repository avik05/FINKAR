"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { FinanceCard } from "@/components/ui/finance-card";
import { Sparkles, Eye, EyeOff, ArrowRight, User, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, loginWithGoogle } = useAuthStore();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = mode === "signup"
        ? await signup(name, email, password)
        : await login(email, password);

      if (result.success) {
        if (mode === "signup" && result.pending) {
          setIsSignupSuccess(true);
        } else {
          router.push("/dashboard");
        }
      } else {
        // Handle specific common errors for better UX
        let errorMessage = result.error || "Authentication failed. Please try again.";
        
        if (errorMessage.includes("User already registered")) {
          errorMessage = "An account with this email already exists. Try signing in instead.";
        } else if (errorMessage.includes("Password should be")) {
          errorMessage = "Password is too weak. Please use at least 6 characters.";
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
    } catch (err) {
      setError("Google Sign-in failed.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background fixed inset-0 z-50 p-4">
      {/* Ambient blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px] pointer-events-none ambient-blob" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none ambient-blob" style={{ animationDelay: "5s" }} />

      <FinanceCard className="w-full max-w-md p-8 z-10 transition-all duration-500 overflow-hidden">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_20px_rgba(0,255,156,0.2)] mb-4 animate-float">
            <Sparkles className="text-primary" size={28} />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {isSignupSuccess ? "Verify Email" : (mode === "login" ? "Welcome back" : "Create account")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            {isSignupSuccess 
              ? "One last step to secure your workspace"
              : (mode === "login"
                ? "Sign in to your Finkar dashboard"
                : "Start your financial command centre")}
          </p>
        </div>

        {/* Error banner */}
        {error && !isSignupSuccess && (
          <div className="mb-4 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm animate-in fade-in shake-in duration-300">
            {error}
          </div>
        )}

        {isSignupSuccess ? (
          <div className="flex flex-col items-center text-center space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <div className="relative h-20 w-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Mail size={40} className="animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">Check your inbox</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We've sent a verification link to<br/>
                <span className="text-primary font-semibold block mt-1">{email}</span>
              </p>
              <p className="text-xs text-muted-foreground/60 pt-2 italic">
                Don't see it? Please check your spam folder.
              </p>
            </div>

            <div className="w-full pt-4 space-y-4">
              <button
                onClick={() => {
                  setIsSignupSuccess(false);
                  setMode("login");
                }}
                className="w-full h-11 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,255,156,0.3)]"
              >
                Go to Sign In
              </button>
              
              <button
                onClick={() => setIsSignupSuccess(false)}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                Try a different email
              </button>
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Avik Majumdar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={mode === "signup"}
                      className="w-full h-11 pl-10 pr-4 bg-foreground/5 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 pl-10 pr-4 bg-foreground/5 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full h-11 pl-10 pr-11 bg-foreground/5 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {mode === "signup" && (
                  <p className="text-xs text-muted-foreground">Minimum 6 characters.</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 mt-2 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,255,156,0.3)] hover:shadow-[0_0_30px_rgba(0,255,156,0.5)] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                  className="text-primary hover:underline underline-offset-4 font-medium transition-colors"
                >
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>

              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-border/50"></div>
                <span className="flex-shrink mx-4 text-[10px] text-muted-foreground/60 uppercase tracking-widest">or</span>
                <div className="flex-grow border-t border-border/50"></div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-11 flex items-center justify-center gap-3 bg-foreground/5 text-foreground hover:bg-foreground/10 border border-border/50 rounded-xl font-medium transition-all group"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => router.push("/")}
                disabled={loading}
                className="w-full h-11 flex items-center justify-center gap-2 bg-transparent text-muted-foreground hover:text-foreground border border-transparent hover:border-border/30 rounded-xl font-medium transition-all text-sm"
              >
                Continue as Guest
              </button>
            </div>
          </>
        )}

        {/* Data privacy note */}
        <p className="text-[11px] text-muted-foreground/50 mt-6 text-center leading-relaxed font-medium">
          Guest data is stored locally. Sign in to sync your data across devices securely.
        </p>
      </FinanceCard>
    </div>
  );
}

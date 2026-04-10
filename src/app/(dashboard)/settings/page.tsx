"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Database,
  Cloud,
  Shield,
  Scale,
  Smartphone,
  AlertTriangle,
  ChevronRight,
  Download,
  Trash2,
  RefreshCw,
  Lock,
  Eye,
  CheckCircle2,
  XCircle,
  Mail,
  KeyRound,
  FileJson,
  FileSpreadsheet,
  RotateCcw,
  Info,
  ExternalLink,
  Fingerprint,
  CloudOff,
  Clock,
  Bell,
  LogOut,
  Heart,
  Building2,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { FinanceCard } from "@/components/ui/finance-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAccountsStore } from "@/stores/accounts-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { useStocksStore } from "@/stores/stocks-store";
import { useMutualFundsStore } from "@/stores/mutualfunds-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── Animation Variants ───────────────────────────────────────────
const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 18 } },
};
const STAGGER = { show: { transition: { staggerChildren: 0.06 } } };

// ─── Section Definitions ──────────────────────────────────────────
const SECTIONS = [
  { id: "account",  label: "Account",           icon: User },
  { id: "data",     label: "Your Data",         icon: Database },
  { id: "sync",     label: "Cloud Sync",        icon: Cloud },
  { id: "security", label: "Security & Privacy", icon: Shield },
  { id: "legal",    label: "Legal & Brand",     icon: Scale },
  { id: "app",      label: "App Info",          icon: Smartphone },
  { id: "danger",   label: "Danger Zone",       icon: AlertTriangle },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

// ─── Inline Toggle Component ──────────────────────────────────────
function Toggle({ checked, onChange, disabled }: { checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${
        checked ? "bg-primary" : "bg-foreground/15"
      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────
function StatusBadge({ status, label }: { status: "success" | "warning" | "error" | "info"; label: string }) {
  const colors = {
    success: "bg-primary/10 text-primary border-primary/20",
    warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${colors[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "success" ? "bg-primary" : status === "warning" ? "bg-yellow-500" : status === "error" ? "bg-destructive" : "bg-blue-500"}`} />
      {label}
    </span>
  );
}

// ─── Settings Item Row ────────────────────────────────────────────
function SettingsRow({
  label,
  description,
  children,
  icon: Icon,
}: {
  label: string;
  description?: string;
  children?: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 group">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        {Icon && <Icon size={18} className="text-muted-foreground shrink-0 mt-0.5" />}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{label}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>}
        </div>
      </div>
      {children && <div className="shrink-0 flex items-center">{children}</div>}
    </div>
  );
}

// ─── Settings Divider ─────────────────────────────────────────────
function Divider() {
  return <div className="border-t border-foreground/5 my-1" />;
}

// ─── Trust Indicator ──────────────────────────────────────────────
function TrustIndicator({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
      <Icon size={14} className="text-primary" />
      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ─── MAIN SETTINGS PAGE ───────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════
export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);
  const updatePassword = useAuthStore((s) => s.updatePassword);
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const accounts = useAccountsStore((s) => s.accounts);
  const transactions = useTransactionsStore((s) => s.transactions);
  const holdings = useStocksStore((s) => s.holdings);
  const funds = useMutualFundsStore((s) => s.funds);
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<SectionId>("account");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const [exportSuccess, setExportSuccess] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // ─── Scroll-spy for desktop sidebar ───
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: SectionId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  // ─── Handlers ─────────────────────────────────────────
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordError("");
    const { success, error } = await updatePassword(newPassword);
    setIsUpdatingPassword(false);

    if (success) {
      setPasswordSuccess("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setPasswordDialogOpen(false);
        setPasswordSuccess("");
      }, 2000);
    } else {
      setPasswordError(error || "Failed to update password");
    }
  };

  const handleForgotPassword = async () => {
    if (!user?.email) return;
    const { success, error } = await resetPassword(user.email);
    if (success) {
      alert(`Password reset link sent to ${user.email}`);
    } else {
      alert(error || "Failed to send reset email");
    }
  };

  const handleExportJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      accounts,
      transactions,
      stockHoldings: holdings,
      mutualFunds: funds,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finkar-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleExportCSV = () => {
    const headers = "Type,Name,Value,Date\n";
    const rows = [
      ...accounts.map((a: any) => `Account,${a.bankName || a.name},${a.balance},${a.createdAt || ""}`),
      ...transactions.map((t: any) => `Transaction,${t.description || t.category},${t.amount},${t.date}`),
      ...holdings.map((h: any) => `Stock,${h.name || h.symbol},${h.currentValue || h.quantity},${h.purchaseDate || ""}`),
      ...funds.map((f: any) => `MutualFund,${f.name || f.schemeName},${f.currentValue || f.investedAmount},${f.purchaseDate || ""}`),
    ].join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `finkar-export-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleClearAll = () => {
    localStorage.removeItem("finkar-accounts-v3");
    localStorage.removeItem("finkar-transactions-v3");
    localStorage.removeItem("finkar-stocks-v3");
    localStorage.removeItem("finkar-mutualfunds-v3");
    localStorage.removeItem("finkar-seeded-v3");
    setClearSuccess(true);
    setTimeout(() => {
      setClearSuccess(false);
      window.location.reload();
    }, 1500);
  };

  const handleResetToSamples = () => {
    localStorage.removeItem("finkar-accounts-v3");
    localStorage.removeItem("finkar-transactions-v3");
    localStorage.removeItem("finkar-stocks-v3");
    localStorage.removeItem("finkar-mutualfunds-v3");
    localStorage.removeItem("finkar-seeded-v3");
    window.location.assign("/");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") return;
    await deleteAccount();
    router.push("/");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const totalDataPoints = accounts.length + transactions.length + holdings.length + funds.length;

  return (
    <motion.div initial="hidden" animate="show" variants={STAGGER} className="pb-6">
      {/* ─── Page Header ─── */}
      <motion.div variants={FADE_UP} className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">You&apos;re in control. Manage your account, data, and preferences.</p>
      </motion.div>

      <div className="flex gap-8 relative">
        {/* ─── Desktop Sidebar Navigation ─── */}
        <motion.nav
          variants={FADE_UP}
          className="hidden lg:block w-56 shrink-0 sticky top-28 self-start"
        >
          <FinanceCard hoverEffect={false} className="p-2 space-y-0.5">
            {SECTIONS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                  activeSection === id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground border border-transparent"
                } ${id === "danger" ? (activeSection === id ? "!text-destructive !bg-destructive/10 !border-destructive/20" : "!text-destructive/60 hover:!text-destructive hover:!bg-destructive/5") : ""}`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="text-xs font-bold tracking-wide">{label}</span>
                <ChevronRight size={14} className={`ml-auto transition-transform duration-200 ${activeSection === id ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0"}`} />
              </button>
            ))}
          </FinanceCard>

          {/* Trust Indicators */}
          <div className="mt-4 space-y-2">
            <TrustIndicator icon={Lock} label="Encrypted Storage" />
            <TrustIndicator icon={Fingerprint} label="Secure Auth" />
          </div>
        </motion.nav>

        {/* ─── Main Content ─── */}
        <div className="flex-1 min-w-0 space-y-6 lg:max-w-3xl">

          {/* ═══ ACCOUNT SETTINGS ═══ */}
          <motion.div variants={FADE_UP} ref={(el) => { sectionRefs.current["account"] = el; }} id="account">
            <SectionHeader icon={User} label="Account Settings" description="Manage your profile and credentials" />
            <FinanceCard className="p-5 md:p-6 space-y-0" hoverEffect={false}>
              <SettingsRow label="Display Name" description={user?.name || "Not set"} icon={User}>
                <span className="text-xs text-muted-foreground font-medium px-2 py-1 rounded-lg bg-foreground/5">{user?.name || "—"}</span>
              </SettingsRow>
              <Divider />
              <SettingsRow label="Email Address" description={user?.email || "Not connected"} icon={Mail}>
                <div className="flex items-center gap-2">
                  {user?.isEmailVerified ? (
                    <StatusBadge status="success" label="Verified" />
                  ) : (
                    <StatusBadge status="warning" label="Unverified" />
                  )}
                </div>
              </SettingsRow>
              <Divider />
              <SettingsRow label="Security" description="Password and authentication" icon={KeyRound}>
                <div className="flex flex-col items-end gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground font-mono">••••••••</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 text-[10px] uppercase font-bold px-3 border-foreground/10 hover:border-primary/30"
                      onClick={() => setPasswordDialogOpen(true)}
                    >
                      Change
                    </Button>
                  </div>
                  <button 
                    onClick={handleForgotPassword}
                    className="text-[10px] text-primary hover:underline font-bold uppercase tracking-wider"
                  >
                    Forgot Password?
                  </button>
                </div>
              </SettingsRow>
              <Divider />
              <SettingsRow label="Account Created" description={user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "—"} icon={Clock} />
            </FinanceCard>
          </motion.div>

          {/* ═══ YOUR DATA ═══ */}
          <motion.div variants={FADE_UP} ref={(el) => { sectionRefs.current["data"] = el; }} id="data">
            <SectionHeader icon={Database} label="Your Data" description="Your financial data is securely stored and never shared." />
            <FinanceCard className="p-5 md:p-6" hoverEffect={false}>
              {/* Data Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Accounts", value: accounts.length, color: "text-primary" },
                  { label: "Transactions", value: transactions.length, color: "text-blue-400" },
                  { label: "Stocks", value: holdings.length, color: "text-yellow-400" },
                  { label: "Mutual Funds", value: funds.length, color: "text-purple-400" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-foreground/[0.03] border border-foreground/5 text-center">
                    <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-1">{item.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Lock size={10} /> Your data stays private — {totalDataPoints} data points stored
              </p>

              <Divider />

              {/* Export & Action Buttons */}
              <div className="pt-4 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <Button onClick={handleExportJSON} variant="outline" className="w-full gap-2 h-10 bg-foreground/5 border-border/50 text-foreground hover:bg-foreground/10">
                    <FileJson size={16} /> Export JSON
                  </Button>
                  <Button onClick={handleExportCSV} variant="outline" className="w-full gap-2 h-10 bg-foreground/5 border-border/50 text-foreground hover:bg-foreground/10">
                    <FileSpreadsheet size={16} /> Export CSV
                  </Button>
                </div>
                <Button onClick={handleResetToSamples} variant="outline" className="w-full gap-2 h-10 bg-primary/5 text-primary border-primary/20 hover:bg-primary/10">
                  <RotateCcw size={16} /> Reset to Sample Data
                </Button>
                <Button onClick={handleClearAll} variant="outline" className="w-full gap-2 h-10 text-destructive border-destructive/20 hover:bg-destructive/10">
                  <Trash2 size={16} /> Clear All Dashboard Data
                </Button>

                <AnimatePresence>
                  {exportSuccess && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/20">
                      <CheckCircle2 size={14} className="text-primary" />
                      <span className="text-xs font-bold text-primary">Export downloaded successfully!</span>
                    </motion.div>
                  )}
                  {clearSuccess && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
                      <CheckCircle2 size={14} className="text-destructive" />
                      <span className="text-xs font-bold text-destructive">Data cleared. Reloading...</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FinanceCard>
          </motion.div>

          {/* ═══ CLOUD SYNC ═══ */}
          <motion.div variants={FADE_UP} ref={(el) => { sectionRefs.current["sync"] = el; }} id="sync">
            <SectionHeader icon={Cloud} label="Cloud Sync & Backup" description="Keep your data safe across devices" />
            <FinanceCard className="p-5 md:p-6 space-y-0" hoverEffect={false}>
              <SettingsRow label="Sync Status" icon={Cloud}>
                <StatusBadge status={user ? "success" : "error"} label={user ? "Connected" : "Not Connected"} />
              </SettingsRow>
              <Divider />
              <SettingsRow label="Storage Backend" description="Supabase Cloud (PostgreSQL)" icon={Database}>
                <StatusBadge status="success" label="Active" />
              </SettingsRow>
              <Divider />
              <SettingsRow label="Last Sync" description="Synced in real-time" icon={Clock}>
                <span className="text-xs font-mono text-muted-foreground">{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
              </SettingsRow>
              <Divider />
              <SettingsRow label="Auto-Sync" description="Automatically sync changes" icon={RefreshCw}>
                <StatusBadge status="info" label="Always On" />
              </SettingsRow>
            </FinanceCard>
          </motion.div>

          {/* ═══ SECURITY & PRIVACY ═══ */}
          <motion.div variants={FADE_UP} ref={(el) => { sectionRefs.current["security"] = el; }} id="security">
            <SectionHeader icon={Shield} label="Security & Privacy" description="Your security is our top priority" />
            <FinanceCard className="p-5 md:p-6 space-y-0" hoverEffect={false}>
              <SettingsRow label="Current Session" description={`${user?.email || "Unknown"}`} icon={Fingerprint}>
                <StatusBadge status="success" label="Active" />
              </SettingsRow>
              <Divider />
              <SettingsRow label="Email Notifications" description="Receive updates and alerts" icon={Bell}>
                <Toggle checked={notifications} onChange={setNotifications} />
              </SettingsRow>
              <Divider />
              <SettingsRow label="Sign Out" description="End your current session" icon={LogOut}>
                <Button onClick={handleLogout} variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-bold">
                  <LogOut size={14} /> Sign Out
                </Button>
              </SettingsRow>
              <Divider />
              <SettingsRow label="Privacy Policy" description="Read how we handle your data" icon={Eye}>
                <Button onClick={() => router.push("/privacy")} variant="ghost" size="sm" className="h-8 gap-1 text-xs">
                  View <ExternalLink size={12} />
                </Button>
              </SettingsRow>
            </FinanceCard>

            <div className="grid grid-cols-2 gap-2.5 mt-3">
              <TrustIndicator icon={Lock} label="Encrypted Storage" />
              <TrustIndicator icon={Fingerprint} label="Secure Authentication" />
            </div>
          </motion.div>

          {/* ═══ LEGAL & BRAND ═══ */}
          <motion.div variants={FADE_UP} ref={(el) => { sectionRefs.current["legal"] = el; }} id="legal">
            <SectionHeader icon={Scale} label="Legal & Brand" description="Proprietary documentation" />
            <FinanceCard className="p-5 md:p-6 space-y-0" hoverEffect={false}>
              {[
                { label: "Terms of Service", route: "/terms" },
                { label: "Privacy Policy", route: "/privacy" },
                { label: "License & Copyright", route: "/licence" },
                { label: "About Finkar", route: "/about" },
              ].map((item, i) => (
                <React.Fragment key={item.route}>
                  {i > 0 && <Divider />}
                  <button
                    onClick={() => router.push(item.route)}
                    className="w-full flex items-center justify-between py-3.5 group transition-colors"
                  >
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</span>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </button>
                </React.Fragment>
              ))}
            </FinanceCard>
          </motion.div>

          {/* ═══ APP INFO ═══ */}
          <motion.div variants={FADE_UP} ref={(el) => { sectionRefs.current["app"] = el; }} id="app">
            <SectionHeader icon={Smartphone} label="Finkar App Info" description="Technical details" />
            <FinanceCard className="p-5 md:p-6 space-y-0" hoverEffect={false}>
              {[
                { label: "App Version", value: "v2.0.0" },
                { label: "Build", value: "production" },
                { label: "Platform", value: "Next.js + Supabase" },
                { label: "Developer", value: "Avik Majumdar" },
                { label: "Storage", value: "Supabase Cloud (PostgreSQL)" },
              ].map((item, i) => (
                <React.Fragment key={item.label}>
                  {i > 0 && <Divider />}
                  <div className="flex items-center justify-between py-3">
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{item.label}</span>
                    <span className="text-sm font-bold text-foreground">{item.value}</span>
                  </div>
                </React.Fragment>
              ))}
              <Divider />
              <div className="pt-3 text-center">
                <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.25em]">
                  © 2024-2026 FINKAR. All Rights Reserved.
                </p>
                <p className="text-xs text-muted-foreground/30 mt-2 flex items-center justify-center gap-1">
                  Made with <Heart size={10} className="text-destructive fill-destructive" /> by Finkar
                </p>
              </div>
            </FinanceCard>
          </motion.div>

          {/* ═══ DANGER ZONE ═══ */}
          <motion.div variants={FADE_UP} ref={(el) => { sectionRefs.current["danger"] = el; }} id="danger">
            <SectionHeader icon={AlertTriangle} label="Danger Zone" description="Irreversible actions" danger />
            <FinanceCard className="p-5 md:p-6 border-destructive/20 bg-destructive/[0.03]" hoverEffect={false}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    <Trash2 size={16} className="text-destructive" /> Delete Account
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                    This action is <strong className="text-destructive">irreversible</strong>. All your financial data, account settings, and portfolio history will be permanently deleted. Please export your data before proceeding.
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="w-full md:w-auto px-6 h-10 shadow-[0_0_20px_rgba(255,0,0,0.08)] hover:shadow-[0_0_30px_rgba(255,0,0,0.15)] font-bold"
                >
                  <Trash2 size={16} className="mr-2" /> Delete Permanently
                </Button>
              </div>
            </FinanceCard>
          </motion.div>
        </div>
      </div>

      {/* ─── Delete Confirmation Dialog ─── */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle size={20} /> Delete Account
            </DialogTitle>
            <DialogDescription>
              This will permanently delete your account, all financial data, and portfolio history. This action <strong>cannot be undone</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 my-2">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Type <span className="text-destructive font-mono bg-destructive/10 px-1.5 py-0.5 rounded">DELETE</span> to confirm
            </p>
            <Input
              value={deleteConfirmText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="font-mono text-center text-lg h-12 border-destructive/30 focus-visible:border-destructive focus-visible:ring-destructive/30"
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => { setDeleteDialogOpen(false); setDeleteConfirmText(""); }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleteConfirmText !== "DELETE"}
              className="gap-2"
            >
              <Trash2 size={14} /> Delete Forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Password Change Dialog ─── */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound size={20} className="text-primary" /> Change Password
            </DialogTitle>
            <DialogDescription>
              Enter your new password below. Make sure it&apos;s at least 6 characters long.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-2">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">New Password</p>
              <Input
                type="password"
                value={newPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10"
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">Confirm New Password</p>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="h-10"
              />
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2">
                <XCircle size={14} className="text-destructive" />
                <span className="text-xs font-bold text-destructive">{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-primary" />
                <span className="text-xs font-bold text-primary">{passwordSuccess}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdatePassword}
              disabled={isUpdatingPassword || !newPassword || !confirmPassword}
              className="gap-2 min-w-[100px]"
            >
              {isUpdatingPassword ? <RefreshCw size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

// ─── Section Header Component ─────────────────────────────────────
function SectionHeader({ icon: Icon, label, description, danger }: { icon: React.ElementType; label: string; description: string; danger?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-xl ${danger ? "bg-destructive/10" : "bg-primary/10"}`}>
        <Icon size={18} className={danger ? "text-destructive" : "text-primary"} />
      </div>
      <div>
        <h2 className={`text-base font-heading font-bold ${danger ? "text-destructive" : "text-foreground"}`}>{label}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

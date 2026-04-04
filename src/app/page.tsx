"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Landmark,
  TrendingUp,
  PieChart,
  CreditCard,
  BarChart3,
  Target,
  Sparkles,
  GraduationCap,
  Linkedin,
  BookOpen,
  Instagram,
  ArrowUpRight,
  Rocket,
  Heart,
  Users,
  Lightbulb,
  Globe,
  LayoutDashboard,
} from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90, damping: 16 } },
};

const STAGGER = { show: { transition: { staggerChildren: 0.1 } } };

const features = [
  {
    icon: Landmark,
    title: "Bank Account Tracking",
    desc: "Aggregate all your accounts and get a clear picture of your cash flow and spending patterns.",
  },
  {
    icon: TrendingUp,
    title: "Stock Portfolio",
    desc: "Track your NSE/BSE holdings, monitor real-time P&L, and analyse sector allocation.",
  },
  {
    icon: PieChart,
    title: "Mutual Fund Tracking",
    desc: "Monitor SIPs, compare NAVs, calculate XIRR, and understand your fund performance.",
  },
  {
    icon: CreditCard,
    title: "Expense Tracking",
    desc: "Categorise spending, spot patterns, set budgets, and stop financial leaks before they grow.",
  },
  {
    icon: BarChart3,
    title: "Robo Analyser",
    desc: "AI-assisted portfolio analysis that surfaces risk exposure, diversification gaps, and actionable insights.",
  },
  {
    icon: Target,
    title: "Goal Planning",
    desc: "Set savings goals — be it an emergency fund, a vacation, or an MBA reserve — and track progress visually.",
  },
];

const values = [
  {
    icon: Lightbulb,
    title: "Clarity first",
    desc: "Complex data, simplified into actionable insights.",
  },
  {
    icon: Users,
    title: "Built for real users",
    desc: "Designed from the perspective of a student and young professional.",
  },
  {
    icon: Heart,
    title: "Finance that empowers",
    desc: "Not just numbers — understanding and confidence in your money.",
  },
  {
    icon: Globe,
    title: "Holistic view",
    desc: "Every financial dimension in a single, unified dashboard.",
  },
];

export default function HomePage() {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={STAGGER}
      className="space-y-12 pb-12"
    >
      {/* ── Hero ── */}
      <motion.div variants={FADE_UP} className="text-center pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 tracking-wide">
          <Sparkles size={12} />
          About Finkar
        </div>
        <h1 className="text-4xl lg:text-5xl font-heading font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-foreground/60 mb-4 leading-tight">
          Your Personal Finance,<br />
          <span className="text-primary">Finally Under Control.</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          Finkar is a finance dashboard that brings every corner of your financial life — accounts, investments, expenses, and goals — into one clear, beautiful interface.
        </p>

        {/* ── Explore Dashboard CTA ── */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(0,255,156,0.35)] hover:shadow-[0_0_50px_rgba(0,255,156,0.55)] hover:-translate-y-0.5 active:scale-[0.98] group"
        >
          <LayoutDashboard size={20} />
          Explore the Dashboard
          <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
        <p className="text-xs text-muted-foreground/60 mt-3">No sign-up required · Free to use</p>
      </motion.div>

      {/* ── What We Offer ── */}
      <motion.section variants={FADE_UP}>
        <div className="mb-6">
          <h2 className="text-2xl font-heading font-bold text-foreground">What Finkar Offers</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Six powerful tools — one platform — zero confusion.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <FinanceCard key={f.title} className="p-5 group hover:-translate-y-0.5 transition-transform duration-300">
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
                  <f.icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </FinanceCard>
          ))}
        </div>
      </motion.section>

      {/* ── Who It's For ── */}
      <motion.section variants={FADE_UP}>
        <FinanceCard className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
              <Users size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground mb-3">Who Is Finkar For?</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Finkar is built for anyone who wants to stop guessing about their money and start understanding it.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { emoji: "🎓", label: "Students & freshers", sub: "building financial habits early" },
                  { emoji: "💼", label: "Young professionals", sub: "managing salary, savings & investments" },
                  { emoji: "📊", label: "Aspiring investors", sub: "tracking stocks, mutual funds & portfolios" },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-foreground/5 border border-border/40">
                    <span className="text-2xl">{item.emoji}</span>
                    <p className="text-sm font-semibold text-foreground mt-2">{item.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FinanceCard>
      </motion.section>

      {/* ── Founder Story ── */}
      <motion.section variants={FADE_UP}>
        <FinanceCard className="p-6 md:p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 shrink-0">
              <GraduationCap size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-foreground">The Story Behind Finkar</h2>
              <p className="text-xs text-muted-foreground mt-1">Founded by Avik</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Finkar started as an idea during my <span className="text-foreground font-medium">second year of undergrad</span> — a time when I was becoming genuinely curious about personal finance but couldn&apos;t find a single tool that tracked everything in one place, visually, clearly.
            </p>
            <p>
              Most apps were either too basic, too expensive, or designed for people who already had an accountant. I wanted something for people like me — students, young professionals, people just starting out — who wanted to be <span className="text-foreground font-medium">financially aware without the overwhelming complexity</span>.
            </p>
            <p>
              So I built Finkar. What started as a side project has grown into a serious pursuit. I&apos;m currently pursuing my <span className="text-foreground font-medium">MBA at Great Lakes Institute of Management, Chennai</span>, and with the knowledge, network, and resources that brings — Finkar is evolving into a proper startup.
            </p>
            <p>
              This is a long-term vision: a financial ecosystem built <span className="text-foreground font-medium">by someone who understands what you actually need</span> — not what enterprises think you need.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["Undergrad → MBA", "Personal Finance Enthusiast", "Problem Solver", "Great Lakes, Chennai"].map((tag) => (
              <span key={tag} className="text-[11px] px-3 py-1 rounded-full bg-foreground/5 border border-border/40 text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        </FinanceCard>
      </motion.section>

      {/* ── Vision & Mission ── */}
      <motion.section variants={FADE_UP}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FinanceCard className="p-6 border-primary/10 bg-gradient-to-br from-primary/5 to-transparent">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Rocket size={16} className="text-primary" />
              </div>
              <h3 className="font-heading font-bold text-foreground">Our Mission</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Make personal finance tracking <strong className="text-foreground">simple, accessible, and insightful</strong> for every individual — regardless of their financial background or expertise.
            </p>
          </FinanceCard>
          <FinanceCard className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-chart-2/10 border border-chart-2/20">
                <Globe size={16} className="text-chart-2" />
              </div>
              <h3 className="font-heading font-bold text-foreground">Our Vision</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Build Finkar into a <strong className="text-foreground">comprehensive financial ecosystem</strong> — from daily expense tracking to deep portfolio analytics — all in one trusted platform.
            </p>
          </FinanceCard>
        </div>
      </motion.section>

      {/* ── What Makes Us Different ── */}
      <motion.section variants={FADE_UP}>
        <div className="mb-5">
          <h2 className="text-2xl font-heading font-bold text-foreground">What Makes Finkar Different</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map((v) => (
            <FinanceCard key={v.title} className="p-5">
              <v.icon size={20} className="text-primary mb-3" />
              <h3 className="font-semibold text-sm text-foreground mb-1">{v.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
            </FinanceCard>
          ))}
        </div>
      </motion.section>

      {/* ── Future Goals ── */}
      <motion.section variants={FADE_UP}>
        <FinanceCard className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Rocket size={18} className="text-primary" />
            </div>
            <h2 className="text-xl font-heading font-bold text-foreground">Where We&apos;re Headed</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: "📈", title: "More Analytics", desc: "Advanced AI-driven portfolio insights, benchmark comparisons, and risk scoring" },
              { icon: "✨", title: "Better UX", desc: "Continuous design improvements, mobile-first enhancements, and faster performance" },
              { icon: "🚀", title: "Startup Growth", desc: "Expanding into a full-stack fintech product with real data integrations and user accounts" },
            ].map((item) => (
              <div key={item.title} className="p-4 rounded-xl bg-foreground/5 border border-border/40">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="font-semibold text-sm text-foreground mt-3 mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </FinanceCard>
      </motion.section>

      {/* ── Connect ── */}
      <motion.section variants={FADE_UP}>
        <FinanceCard className="p-6 md:p-8 text-center">
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Connect With Me</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            Have ideas, feedback, or just want to talk finance? I&apos;d love to hear from you.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="https://www.linkedin.com/in/avik0508"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 text-[#0A66C2] hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/50 transition-all font-medium text-sm group dark:text-[#5A9FE0]"
            >
              <Linkedin size={16} />
              LinkedIn
              <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href="https://finkar.substack.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 hover:bg-orange-500/20 hover:border-orange-500/50 transition-all font-medium text-sm group"
            >
              <BookOpen size={16} />
              Substack
              <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <Link
              href="https://www.instagram.com/aviiiiiiik"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-500 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all font-medium text-sm group"
            >
              <Instagram size={16} />
              Instagram
              <ArrowUpRight size={12} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </FinanceCard>
      </motion.section>

      {/* ── CTA ── */}
      <motion.section variants={FADE_UP}>
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 text-center">
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <Sparkles size={28} className="text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
              Ready to Take Control?
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Start exploring the dashboard, track your finances, and stay updated with the Finkar blog on Substack.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(0,255,156,0.3)] hover:shadow-[0_0_30px_rgba(0,255,156,0.5)]"
              >
                Explore Dashboard
                <ArrowUpRight size={14} />
              </Link>
              <Link
                href="https://finkar.substack.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-foreground/5 border border-border/50 text-foreground hover:bg-foreground/10 font-medium text-sm transition-all"
              >
                Read the Blog
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

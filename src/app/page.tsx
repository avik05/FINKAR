"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from "framer-motion";
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

// --- Components ---

const MagneticCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.1);
    y.set((e.clientY - centerY) * 0.1);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const ScrollReveal = ({ children, direction = "up", delay = 0 }: { children: React.ReactNode; direction?: "up" | "down" | "left" | "right"; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const variants = {
    hidden: { 
      opacity: 0, 
      x: direction === "left" ? -50 : direction === "right" ? 50 : 0,
      y: direction === "up" ? 50 : direction === "down" ? -50 : 0 
    },
    visible: { opacity: 1, x: 0, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      {children}
    </motion.div>
  );
};

// --- Data ---

const features = [
  {
    icon: Landmark,
    title: "Bank Account Tracking",
    desc: "Aggregate all your accounts and get a clear picture of your cash flow and spending patterns.",
  },
  {
    icon: TrendingUp,
    title: "Stock Portfolio Tracking",
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
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);
  
  const featuresY = useTransform(scrollYProgress, [0.1, 0.4], [100, 0]);
  const featuresOpacity = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);

  return (
    <div ref={containerRef} className="relative min-h-full scroll-smooth bg-background">
      {/* ── Fixed Hero Backdrop (Glassmorphic) ── */}
      <div className="relative min-h-[350vh] pt-12 pb-24 overflow-x-hidden">
        
        {/* --- HERO SECTION --- */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
          className="fixed inset-x-0 top-32 flex flex-col items-center text-center px-6 z-10 pointer-events-none"
        >
          <div className="pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-8"
            >
              <Sparkles size={12} className="animate-pulse" />
              Everything About Finkar
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 leading-[0.9]"
            >
              Your Personal Finance,<br />
              <span className="text-primary italic">Finally Under Control.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
            >
              Finkar is a finance dashboard that brings every corner of your financial life — accounts, investments, expenses, and goals — into one clear, beautiful interface.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-primary text-primary-foreground font-black text-lg hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,255,156,0.4)] hover:shadow-[0_20px_70px_rgba(0,255,156,0.6)] active:scale-95 group"
              >
                <LayoutDashboard size={24} />
                EXPLORE DASHBOARD
                <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-6 opacity-40 italic">No sign-up required · Free and secure</p>
            </motion.div>
          </div>
        </motion.section>

        {/* --- CONTENT SPACER --- */}
        <div className="h-[70vh]" />

        {/* --- FEATURES GRID --- */}
        <motion.section 
          style={{ y: featuresY, opacity: featuresOpacity }}
          className="relative z-20 px-6 container mx-auto"
        >
          <ScrollReveal>
          <div className="mb-12">
            <h2 className="text-3xl md:text-5xl font-heading font-black tracking-tight text-foreground">What Finkar Offers</h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Six powerful tools — one platform — zero confusion.
            </p>
          </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <MagneticCard key={f.title} className="h-full">
                <ScrollReveal delay={idx * 0.1}>
                  <FinanceCard className="p-8 h-full bg-card/40 backdrop-blur-xl border-border/40 hover:border-primary/40 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-primary/15 transition-colors duration-500" />
                    <div className="flex flex-col gap-6 relative">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                        <f.icon size={28} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 tracking-tight">{f.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">{f.desc}</p>
                      </div>
                    </div>
                  </FinanceCard>
                </ScrollReveal>
              </MagneticCard>
            ))}
          </div>
        </motion.section>

        {/* --- WHO IT'S FOR --- */}
        <section className="relative z-20 px-6 container mx-auto mt-40">
          <ScrollReveal direction="up">
            <FinanceCard className="p-8 md:p-16 bg-gradient-to-br from-primary/10 via-background to-transparent border-primary/20 rounded-[3rem] overflow-hidden relative group">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
              <div className="relative flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
                    <Users size={12} /> Target Audience
                  </div>
                  <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground leading-[1.1]">Who is Finkar Built For?</h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                    Finkar is built for anyone who wants to stop guessing about their money and start understanding it.
                  </p>
                </div>
                
                <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-1 gap-4">
                  {[
                    { emoji: "🎓", label: "Students & freshers", sub: "building financial habits early" },
                    { emoji: "💼", label: "Young professionals", sub: "managing salary, savings & investments" },
                    { emoji: "📊", label: "Aspiring investors", sub: "tracking stocks, mutual funds & portfolios" },
                  ].map((item, i) => (
                    <ScrollReveal key={item.label} direction="right" delay={i * 0.15}>
                      <div className="p-6 rounded-[2rem] bg-foreground/5 border border-border/40 hover:bg-foreground/10 transition-colors flex items-center gap-5 group/item">
                        <span className="text-4xl group-hover/item:scale-125 transition-transform duration-500">{item.emoji}</span>
                        <div>
                          <p className="text-lg font-bold text-foreground leading-tight">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-1 font-medium">{item.sub}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </FinanceCard>
          </ScrollReveal>
        </section>

        {/* --- FOUNDER STORY --- */}
        <section className="relative z-20 px-6 container mx-auto mt-40">
          <ScrollReveal direction="left">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-purple-500/20 rounded-3xl blur-[120px] opacity-40 animate-pulse" />
                <FinanceCard className="absolute inset-4 flex flex-col items-center justify-center text-center p-12 border-primary/30 bg-background/40 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl">
                  <div className="w-28 h-28 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,255,156,0.2)]">
                    <GraduationCap size={56} className="text-primary" />
                  </div>
                  <h3 className="text-3xl font-black mb-1 tracking-tight">Avik Majumdar</h3>
                  <p className="text-xs text-primary font-black uppercase tracking-widest mb-6">Founder & Architect</p>
                  <p className="text-sm text-muted-foreground italic font-medium leading-relaxed">
                    &quot;Finkar started as a dorm-room itch; now it&apos;s a mission to redefine wealth clarity.&quot;
                  </p>
                </FinanceCard>
              </div>
              
              <div className="space-y-10">
                <h2 className="text-4xl md:text-7xl font-heading font-black leading-none tracking-tight">The Story Behind <span className="text-primary">Finkar.</span></h2>
                <div className="space-y-8 text-lg text-muted-foreground font-medium leading-relaxed">
                  <p>
                    Finkar started as an idea during my <span className="text-foreground font-bold">second year of undergrad</span> — a time when I was becoming genuinely curious about personal finance but couldn&apos;t find a single tool that tracked everything in one place, visually, clearly.
                  </p>
                  <p>
                    Most apps were either too basic, too expensive, or designed for people who already had an accountant. I wanted something for people like me — students, young professionals, people just starting out — who wanted to be <span className="text-foreground font-bold italic">financially aware without the overwhelming complexity.</span>
                  </p>
                  <p>
                    So I built Finkar. What started as a side project has grown into a serious pursuit. I&apos;m currently pursuing my <span className="text-foreground font-bold underline decoration-primary/40 decoration-4 underline-offset-4">MBA at Great Lakes Institute of Management, Chennai</span>, and with the knowledge, network, and resources that brings — Finkar is evolving into a proper startup.
                  </p>
                  <p>
                    This is a long-term vision: a financial ecosystem built <span className="text-foreground font-bold">by someone who understands what you actually need</span> — not what enterprises think you need.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  {["Undergrad → MBA", "Personal Finance Enthusiast", "Problem Solver", "Great Lakes, Chennai"].map(tag => (
                    <span key={tag} className="text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2.5 rounded-full bg-foreground/5 border border-border/50 text-muted-foreground/80 hover:bg-primary/10 hover:text-primary transition-colors cursor-default">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* --- MISSION & VISION --- */}
        <section className="relative z-20 px-6 container mx-auto mt-40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal direction="up" delay={0.1}>
              <FinanceCard className="p-12 bg-gradient-to-bl from-primary/15 via-background to-transparent border-primary/20 rounded-[3rem] overflow-hidden relative group">
                <Rocket size={48} className="text-primary mb-10 group-hover:scale-125 group-hover:-translate-y-2 transition-transform duration-700" />
                <h3 className="text-4xl font-heading font-black mb-6 uppercase tracking-tighter italic text-primary">Our Mission</h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-bold">
                  Make personal finance tracking <strong className="text-foreground">simple, accessible, and insightful</strong> for every individual — regardless of their financial background or expertise.
                </p>
              </FinanceCard>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <FinanceCard className="p-12 bg-card/40 border-border/40 rounded-[3rem] hover:bg-card/60 transition-colors group">
                <Globe size={48} className="text-blue-400 mb-10 group-hover:rotate-12 transition-transform duration-700" />
                <h3 className="text-4xl font-heading font-black mb-6 uppercase tracking-tighter italic text-blue-400">Our Vision</h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-bold">
                  Build Finkar into a <strong className="text-foreground">comprehensive financial ecosystem</strong> — from daily expense tracking to deep portfolio analytics — all in one trusted platform.
                </p>
              </FinanceCard>
            </ScrollReveal>
          </div>
        </section>

        {/* --- VALUES --- */}
        <section className="relative z-20 px-6 container mx-auto mt-40">
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
              {values.map((v, i) => (
                <div key={v.title} className="group text-center">
                  <div className="w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-8 transition-all duration-700 group-hover:rounded-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-[360deg]">
                    <v.icon size={36} />
                  </div>
                  <h3 className="text-xl font-black mb-3 uppercase tracking-tight">{v.title}</h3>
                  <p className="text-sm text-muted-foreground font-semibold leading-relaxed px-4">{v.desc}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* --- FUTURE ROADMAP --- */}
        <section className="relative z-20 px-6 container mx-auto mt-40">
          <ScrollReveal direction="up">
            <FinanceCard className="p-12 md:p-20 bg-card/20 rounded-[4rem] border-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
              <div className="relative flex flex-col items-center text-center mb-16">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                   <Rocket size={28} className="text-primary" />
                </div>
                <h2 className="text-4xl md:text-6xl font-heading font-black text-foreground mb-4">Where We&apos;re Headed</h2>
                <p className="max-w-xl mx-auto text-muted-foreground font-medium">Continuous evolution driven by user feedback and cutting-edge financial tech.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { icon: "📈", title: "More Analytics", desc: "Advanced AI-driven portfolio insights, benchmark comparisons, and risk scoring." },
                  { icon: "✨", title: "Better UX", desc: "Continuous design improvements, mobile-first enhancements, and faster performance." },
                  { icon: "🚀", title: "Startup Growth", desc: "Expanding into a full-stack fintech product with real data integrations." },
                ].map((item, i) => (
                  <ScrollReveal key={item.title} delay={i * 0.2}>
                    <div className="p-8 rounded-[2.5rem] bg-foreground/5 border border-border/40 hover:bg-foreground/10 hover:-translate-y-4 transition-all duration-500 h-full group/card">
                      <span className="text-5xl block mb-6 group-hover/card:scale-125 transition-transform duration-500">{item.icon}</span>
                      <h3 className="text-xl font-black mb-3 italic tracking-tight">{item.title}</h3>
                      <p className="text-sm text-muted-foreground font-semibold leading-relaxed">{item.desc}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </FinanceCard>
          </ScrollReveal>
        </section>

        {/* --- CONNECT SECTION --- */}
        <section className="relative z-20 px-6 container mx-auto mt-40">
          <ScrollReveal>
            <FinanceCard className="p-12 md:p-24 text-center rounded-[4rem] border-primary/10 bg-black/40 backdrop-blur-3xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-[80px]" />
              <h2 className="text-5xl md:text-8xl font-heading font-black mb-10 leading-none tracking-tighter">Stay Connected</h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-16 max-w-3xl mx-auto font-bold leading-relaxed">
                Finkar is built on feedback. Join the blog, connect on social, and let&apos;s build the future of finance together.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {[
                  { href: "https://www.linkedin.com/in/avik0508", icon: Linkedin, label: "LinkedIn", color: "hover:bg-[#0A66C2] hover:text-white" },
                  { href: "https://finkar.substack.com/", icon: BookOpen, label: "Substack", color: "hover:bg-orange-600 hover:text-white" },
                  { href: "https://www.instagram.com/aviiiiiiik", icon: Instagram, label: "Instagram", color: "hover:bg-pink-600 hover:text-white" },
                ].map(social => (
                  <Link
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] bg-foreground/5 border border-border/40 font-black text-sm transition-all shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 ${social.color}`}
                  >
                    <social.icon size={24} />
                    {social.label.toUpperCase()}
                  </Link>
                ))}
              </div>
            </FinanceCard>
          </ScrollReveal>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="relative z-20 px-6 container mx-auto mt-60 text-center pb-40">
          <ScrollReveal>
            <div className="inline-block animate-bounce mb-12 overflow-hidden">
              <Sparkles size={100} className="text-primary opacity-30" />
            </div>
            <h2 className="text-6xl md:text-[10rem] font-heading font-black tracking-tighter mb-16 leading-[0.8] opacity-20 group-hover:opacity-100 transition-opacity duration-1000">
              TIME TO SCALE.
            </h2>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-6 px-16 py-8 rounded-[3rem] bg-primary text-primary-foreground font-black text-3xl hover:scale-110 active:scale-95 transition-all shadow-[0_40px_100px_rgba(0,255,156,0.45)] hover:shadow-primary/60 border-4 border-white/20"
            >
              LAUNCH NOW
              <Rocket size={40} />
            </Link>
            <p className="text-muted-foreground mt-16 font-black uppercase tracking-[0.4em] text-xs">Crafted with <Heart size={14} className="inline text-primary mx-2 animate-pulse" /> by Avik Majumdar</p>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}

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
  MousePointer2,
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
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
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

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.03], [0, -500]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.02], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.02], [1, 0.8]);
  
  const contentY = useTransform(scrollYProgress, [0.02, 0.12], [300, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.02, 0.06], [0, 1]);

  // Hard unmount threshold to prevent 'ghosting'
  const isHeroVisible = useTransform(scrollYProgress, [0, 0.035], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-full scroll-smooth bg-transparent">
      {/* ── Fixed Hero Backdrop (Glassmorphic) ── */}
      <div className="relative min-h-[450vh] pt-12 pb-24 overflow-x-hidden">
        {/* Soft blend for the top bar/sidebar area */}
        <div className="absolute top-0 left-0 right-0 h-96 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-0" />
        
        {/* --- HERO SECTION --- */}
        <motion.section 
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale, pointerEvents: isHeroVisible }}
          className="fixed left-0 right-0 md:left-[var(--sidebar-width)] top-20 sm:top-32 flex flex-col items-center text-center px-6 z-0 pointer-events-none transition-[left] duration-300 ease-in-out group-has-[[data-state=collapsed]]/sidebar-wrapper:md:left-[var(--sidebar-width-icon)]"
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
              className="text-4xl sm:text-7xl lg:text-8xl font-heading font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 leading-[0.9]"
            >
              Finkar.<br />
              <span className="text-primary italic">Finance Simplified.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center justify-center gap-3 mb-10"
            >
              <div className="h-[1px] w-8 bg-border" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Founded by Avik Majumdar</span>
              <div className="h-[1px] w-8 bg-border" />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
            >
              A finance dashboard meticulously designed to surface clarity across your bank accounts, stocks, mutual funds, and expenses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col items-center gap-8 sm:gap-12"
            >
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 sm:gap-4 px-4 py-2 sm:px-10 sm:py-5 rounded-full bg-primary text-primary-foreground font-black text-[9px] sm:text-lg hover:brightness-110 transition-all shadow-[0_20px_50px_rgba(0,255,156,0.4)] hover:shadow-[0_20px_70px_rgba(0,255,156,0.6)] active:scale-95 group"
              >
                <LayoutDashboard size={14} className="sm:w-6 sm:h-6" />
                EXPLORE DASHBOARD
                <ArrowUpRight size={12} className="sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-muted-foreground/40 flex flex-col items-center gap-3"
              >
                <div className="w-6 h-10 rounded-full border-2 border-current flex justify-center pt-2">
                  <motion.div 
                    animate={{ y: [0, 16, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1.5 h-1.5 rounded-full bg-primary" 
                  />
                </div>
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Scroll to Discover Our Story</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          style={{ y: contentY, opacity: contentOpacity }}
          className="relative z-20 px-6 container mx-auto mt-20 md:mt-40 rounded-[2rem] sm:rounded-[3rem] bg-background/80 backdrop-blur-3xl shadow-[0_-50px_100px_rgba(0,0,0,0.2)]"
        >
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative aspect-square w-full max-w-[280px] sm:max-w-sm mx-auto lg:mx-0 order-2 lg:order-1">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 via-primary/5 to-transparent rounded-[2rem] sm:rounded-[3rem] blur-3xl opacity-50" />
                <FinanceCard className="relative p-8 sm:p-12 border-primary/20 bg-card/30 backdrop-blur-3xl rounded-[2rem] sm:rounded-[3rem] shadow-2xl h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,255,156,0.15)]">
                    <GraduationCap size={48} className="text-primary" />
                  </div>
                  <h2 className="text-3xl font-black mb-1">Avik Majumdar</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Founder & Architect</p>
                  <p className="text-sm text-muted-foreground italic font-medium leading-relaxed max-w-xs">
                    &quot;Finkar started as an undergraduate itch to solve my own financial confusion. Today, it&apos;s a mission.&quot;
                  </p>
                  <div className="flex gap-4 mt-8">
                    {[
                      { icon: Linkedin, href: "https://www.linkedin.com/in/avik0508", color: "hover:bg-[#0A66C2]" },
                      { icon: Instagram, href: "https://www.instagram.com/aviiiiiiik", color: "hover:bg-pink-600" },
                    ].map((social, i) => (
                      <Link 
                        key={i} 
                        href={social.href} 
                        target="_blank" 
                        className={`w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:text-white ${social.color}`}
                      >
                        <social.icon size={18} />
                      </Link>
                    ))}
                  </div>
                </FinanceCard>
              </div>
              
              <div className="space-y-8 order-1 lg:order-2">
                <ScrollReveal direction="right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest mb-4">
                    The Origin Story
                  </div>
                  <h2 className="text-5xl md:text-7xl font-heading font-black leading-[0.9] mb-8">The Story of <span className="text-primary">Finkar.</span></h2>
                  <div className="space-y-6 text-lg text-muted-foreground font-medium leading-relaxed">
                    <p>
                      Finkar started during my <strong className="text-foreground">second year of undergrad</strong>. I was diving into personal finance but realized there wasn&apos;t a single tool that brought everything together visually. Everything was either a spreadsheet or a complex app built for accountants.
                    </p>
                    <p>
                      I wanted something for us — students, young professionals, and first-time investors — who need <em className="text-foreground font-bold italic underline decoration-primary/40 decoration-4 underline-offset-4">clarity without the noise.</em>
                    </p>
                    <p>
                      What started as a side project in my dorm now fuels my journey as an <strong className="text-foreground">MBA student at Great Lakes Institute of Management, Chennai</strong>. Finkar is evolving from a dashboard into a proper startup ecosystem.
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </motion.section>

        {/* --- MISSION & VISION (PROMINENT) --- */}
        <section className="relative z-20 px-6 container mx-auto mt-40">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal direction="up" delay={0.1}>
              <FinanceCard className="p-12 bg-gradient-to-bl from-primary/15 via-background to-transparent border-primary/20 rounded-[3rem] overflow-hidden relative group">
                <Rocket size={48} className="text-primary mb-10 group-hover:scale-125 group-hover:-translate-y-2 transition-transform duration-700" />
                <h3 className="text-4xl font-heading font-black mb-6 uppercase tracking-tighter italic text-primary">Our Mission</h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-bold">
                  Make personal finance tracking <strong className="text-foreground">simple, accessible, and insightful</strong> for every individual — regardless of their expertise.
                </p>
              </FinanceCard>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.3}>
              <FinanceCard className="p-12 bg-card/40 border-border/40 rounded-[3rem] hover:bg-card/60 transition-colors group">
                <Globe size={48} className="text-blue-400 mb-10 group-hover:rotate-12 transition-transform duration-700" />
                <h3 className="text-4xl font-heading font-black mb-6 uppercase tracking-tighter italic text-blue-400">Our Vision</h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-bold">
                  Build Finkar into a <strong className="text-foreground">comprehensive financial ecosystem</strong> — from daily expense tracking to deep portfolio analytics.
                </p>
              </FinanceCard>
            </ScrollReveal>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="relative z-20 px-6 container mx-auto mt-40">
          <ScrollReveal>
            <div className="mb-16">
              <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-4">What Finkar Does</h2>
              <p className="text-xl text-muted-foreground font-medium underline decoration-primary/40 decoration-2 underline-offset-8">Powerful insights, zero friction.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, idx) => (
                <MagneticCard key={f.title} className="h-full">
                  <ScrollReveal delay={idx * 0.1}>
                    <FinanceCard className="p-8 h-full bg-card/40 backdrop-blur-xl border-border/40 hover:border-primary/40 transition-all group overflow-hidden relative">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:bg-primary/15 transition-colors duration-500" />
                      <div className="flex flex-col gap-6 relative">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
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
          </ScrollReveal>
        </section>

        {/* --- WHO IT'S FOR --- */}
        <section className="relative z-20 px-6 container mx-auto mt-20 md:mt-40">
          <ScrollReveal direction="up">
            <FinanceCard className="p-8 sm:p-12 md:p-20 bg-foreground/5 border-border/40 rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden relative group">
              <div className="relative flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
                    <Users size={12} /> Target Audience
                  </div>
                  <h2 className="text-3xl sm:text-5xl md:text-7xl font-heading font-black leading-[1.1] text-foreground">Who is Finkar Built For?</h2>
                  <p className="text-lg sm:text-xl text-muted-foreground font-medium leading-relaxed">
                    Built for anyone who wants to stop guessing about their money and start understanding it.
                  </p>
                </div>
                
                <div className="lg:w-1/2 grid grid-cols-1 gap-6 w-full">
                  {[
                    { emoji: "🎓", label: "Students & freshers", sub: "Building financial habits early in life" },
                    { emoji: "💼", label: "Young professionals", sub: "Managing salary, savings & investments like a pro" },
                    { emoji: "📊", label: "Aspiring investors", sub: "Tracking stocks, mutual funds & complex portfolios" },
                  ].map((item, i) => (
                    <div key={item.label} className="p-8 rounded-[2.5rem] bg-background/40 border border-border/40 hover:bg-primary/5 hover:border-primary/20 transition-all flex items-center gap-6 group/item">
                      <span className="text-4xl sm:text-5xl group-hover/item:scale-120 transition-transform">{item.emoji}</span>
                      <div>
                        <p className="text-lg sm:text-xl font-bold text-foreground leading-tight">{item.label}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 font-medium">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FinanceCard>
          </ScrollReveal>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="relative z-20 px-6 container mx-auto mt-32 md:mt-60 text-center pb-32 md:pb-40">
          <ScrollReveal>
            <h2 className="text-2xl sm:text-6xl md:text-[8rem] font-heading font-black tracking-tighter mb-12 md:mb-16 opacity-10">THE FUTURE.</h2>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-3 sm:gap-6 px-6 py-3 sm:px-16 sm:py-8 rounded-[1rem] sm:rounded-[3.5rem] bg-primary text-primary-foreground font-black text-[11px] sm:text-3xl hover:scale-110 active:scale-95 transition-all shadow-[0_45px_100px_rgba(0,255,156,0.3)] hover:shadow-primary/50"
            >
              LAUNCH DASHBOARD
              <Rocket size={16} className="sm:w-10 sm:h-10" />
            </Link>
            <p className="text-muted-foreground mt-16 font-black uppercase tracking-[0.4em] text-[9px] sm:text-xs">Crafted with <Heart size={14} className="inline text-primary mx-2 animate-pulse" /> by Avik Majumdar at GLIM Chennai</p>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}

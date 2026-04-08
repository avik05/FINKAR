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
  Instagram,
  ArrowUpRight,
  Rocket,
  Heart,
  Users,
  LayoutDashboard,
  Globe,
} from "lucide-react";
import { FinanceCard } from "@/components/ui/finance-card";

// --- Components ---

const MagneticCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 250, damping: 25 });
  const springY = useSpring(y, { stiffness: 250, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.12);
    y.set((e.clientY - centerY) * 0.12);
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
      style={{ x: springX, y: springY, willChange: "transform" }}
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
      x: direction === "left" ? -20 : direction === "right" ? 20 : 0,
      y: direction === "up" ? 20 : direction === "down" ? -20 : 0 
    },
    visible: { opacity: 1, x: 0, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
      style={{ willChange: "transform, opacity" }}
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
    desc: "Aggregate your accounts and get a clear picture of your total liquidity and cash flow patterns.",
  },
  {
    icon: TrendingUp,
    title: "Stock Portfolio Tracking",
    desc: "Track your NSE/BSE holdings, monitor real-time P&L, and manage your equity positions in one view.",
  },
  {
    icon: PieChart,
    title: "Mutual Fund Tracking",
    desc: "Monitor SIPs, compare NAVs, and track fund performance with calculated XIRR values.",
  },
  {
    icon: CreditCard,
    title: "Expense Tracking",
    desc: "Categorise spending, spot patterns across all accounts, and identify leaks in your daily burn rate.",
  },
  {
    icon: BarChart3,
    title: "Financial Intelligence",
    desc: "Advanced analysis of your wealth health, including runway calculations and future milestone forecasting.",
  },
  {
    icon: Target,
    title: "Goal Planning",
    desc: "Set and visualize savings goals — for emergency funds, vacations, or major life milestones.",
  },
];

export default function AboutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.05], [0, -300]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.04], [1, 0.95]);
  
  const contentY = useTransform(scrollYProgress, [0.04, 0.12], [150, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.03, 0.08], [0, 1]);

  // Interaction logic
  const [isHeroInteractive, setIsHeroInteractive] = React.useState(true);
  React.useEffect(() => {
    return scrollYProgress.on("change", (latest) => {
      setIsHeroInteractive(latest < 0.05);
    });
  }, [scrollYProgress]);

  // No sidebar on about page
  const sidebarOffset = 0;

  return (
    <div ref={containerRef} className="relative bg-background">
      {/* ── Fixed Hero Backdrop (Glassmorphic) ── */}
      <div className="relative min-h-[200vh] pt-12 pb-24">
        
        {/* --- HERO SECTION --- */}
        <motion.section 
          style={{ 
            y: heroY, 
            opacity: heroOpacity,
            scale: heroScale,
            left: sidebarOffset,
            display: isHeroInteractive ? "flex" : "none",
            willChange: "transform, opacity"
          }}
          className="fixed inset-0 flex flex-col items-center justify-center text-center px-6 z-0 transition-[left] duration-300 ease-in-out"
        >
          <div className="will-change-transform">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-8"
            >
              <Sparkles size={12} className="animate-pulse" />
              Everything About Finkar
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 leading-[0.9]"
            >
              Finkar.<br />
              <span className="text-primary italic">Finance, Simplified.</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-3 mb-10"
            >
              <div className="h-[1px] w-8 bg-border" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">By Avik Majumdar</span>
              <div className="h-[1px] w-8 bg-border" />
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
            >
              A finance dashboard meticulously designed to surface clarity across your bank accounts, stocks, mutual funds, and expenses.
            </motion.p>

            <motion.div className="flex flex-col items-center gap-12">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 shadow-lg active:scale-95 group transition-all"
              >
                <LayoutDashboard size={18} />
                EXPLORE DASHBOARD
                <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>

              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-muted-foreground/40 flex flex-col items-center gap-3"
              >
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Scroll to Discover Our Story</span>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        <motion.section 
          style={{ 
            y: contentY, 
            opacity: contentOpacity,
            pointerEvents: isHeroInteractive ? "none" : "auto"
          }}
          className="relative z-20 px-6 container mx-auto mt-40 rounded-[3rem] bg-background/80 backdrop-blur-3xl shadow-2xl"
        >
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center py-20">
              <div className="relative aspect-square max-w-sm mx-auto lg:mx-0 order-2 lg:order-1">
                <FinanceCard className="relative p-12 border-primary/20 bg-card/30 backdrop-blur-3xl rounded-[3rem] shadow-2xl h-full flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/40 flex items-center justify-center mb-8">
                    <GraduationCap size={48} className="text-primary" />
                  </div>
                  <h2 className="text-3xl font-black mb-1">Avik Majumdar</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-6">Founder & Architect</p>
                  <p className="text-sm text-muted-foreground italic font-medium leading-relaxed max-w-xs">
                    &quot;Finkar started as an undergraduate itch to solve my own financial confusion. Today, it&apos;s a mission to bring that same clarity to everyone.&quot;
                  </p>
                  <div className="flex gap-4 mt-8">
                    <Link href="https://www.linkedin.com/in/avik0508" target="_blank" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:bg-[#0A66C2] hover:text-white transition-all">
                      <Linkedin size={18} />
                    </Link>
                    <Link href="https://www.instagram.com/aviiiiiiik" target="_blank" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground hover:bg-pink-600 hover:text-white transition-all">
                      <Instagram size={18} />
                    </Link>
                  </div>
                </FinanceCard>
              </div>
              
              <div className="space-y-8 order-1 lg:order-2">
                <ScrollReveal direction="right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest mb-4">
                    The Origin Story
                  </div>
                  <h2 className="text-5xl md:text-7xl font-heading font-black leading-[0.9] mb-8">The Story of <span className="text-primary">Finkar.</span></h2>
                  <div className="space-y-6 text-xl text-muted-foreground font-medium leading-relaxed">
                    <p>
                      Finkar was born during my <strong className="text-foreground">second year of undergrad in 2022</strong>. I was tired of complicated spreadsheets and finance apps that were just billboards for credit cards.
                    </p>
                    <p>
                      Now, as I pursue my MBA at <strong className="text-primary tracking-tight font-black italic">Great Lakes, Chennai</strong>, the vision remains the same: to build a clean, powerful source of truth for your money.
                    </p>
                    <p>
                      We don&apos;t sell your data, and we don&apos;t push loans. We just give you the <em className="text-foreground font-bold italic underline decoration-primary/40 decoration-4 underline-offset-4">clarity you deserve.</em>
                    </p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </motion.section>

        {/* --- MISSION & VISION --- */}
        <section className="relative z-20 px-6 container mx-auto mt-20">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal direction="up" delay={0.1}>
              <FinanceCard className="p-12 bg-card/40 border-primary/20 rounded-[3rem] group">
                <Rocket size={48} className="text-primary mb-10" />
                <h3 className="text-4xl font-heading font-black mb-6 uppercase tracking-tighter italic text-primary">Our Mission</h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-bold">
                  To provide <strong className="text-foreground">radical financial clarity</strong> for every individual through simple, insightful data.
                </p>
              </FinanceCard>
            </ScrollReveal>
            <ScrollReveal direction="up" delay={0.2}>
              <FinanceCard className="p-12 bg-card/40 border-border/40 rounded-[3rem] group">
                <Globe size={48} className="text-blue-400 mb-10" />
                <h3 className="text-4xl font-heading font-black mb-6 uppercase tracking-tighter italic text-blue-400">Our Vision</h3>
                <p className="text-xl text-muted-foreground leading-relaxed font-bold">
                  To become India&apos;s <strong className="text-foreground">most trusted</strong> personal finance dashboard for the next generation of investors.
                </p>
              </FinanceCard>
            </ScrollReveal>
          </div>
        </section>

        {/* --- FEATURES GRID --- */}
        <section className="relative z-20 px-6 container mx-auto mt-20">
            <div className="mb-16 text-center">
              <ScrollReveal>
                <h2 className="text-4xl md:text-6xl font-heading font-black tracking-tight mb-4">What Finkar Does</h2>
                <p className="text-xl text-muted-foreground font-medium">Powerful insights, zero friction.</p>
              </ScrollReveal>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((f, idx) => (
                <MagneticCard key={f.title} className="h-full">
                  <ScrollReveal delay={idx * 0.05}>
                    <FinanceCard className="p-8 h-full bg-card/40 backdrop-blur-xl border-border/40 hover:border-primary/40 transition-colors group relative overflow-hidden">
                      <div className="flex flex-col gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
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
        </section>

        {/* --- TARGET AUDIENCE --- */}
        <section className="relative z-20 px-6 container mx-auto mt-20">
          <ScrollReveal direction="up">
            <FinanceCard className="p-8 sm:p-20 bg-foreground/5 border-border/40 rounded-[3rem] sm:rounded-[4rem] overflow-hidden relative">
              <div className="relative flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
                    <Users size={12} /> Target Audience
                  </div>
                  <h2 className="text-4xl sm:text-6xl md:text-7xl font-heading font-black leading-[1] text-foreground">Who is Finkar Built For?</h2>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                    Built for anyone who wants to stop guessing about their money and start understanding it.
                  </p>
                </div>
                
                <div className="lg:w-1/2 grid grid-cols-1 gap-6 w-full">
                  {[
                    { emoji: "🎓", label: "Students & Freshers", sub: "Building smart financial habits early in life." },
                    { emoji: "💼", label: "Young Professionals", sub: "Managing salary, savings, and investments in one place." },
                    { emoji: "📊", label: "Individual Investors", sub: "Tracking stocks and mutual funds with total clarity." },
                  ].map((item) => (
                    <div key={item.label} className="p-6 rounded-[2rem] bg-background/40 border border-border/40 flex items-center gap-6 group hover:bg-primary/5 transition-colors">
                      <span className="text-4xl group-hover:scale-110 transition-transform">{item.emoji}</span>
                      <div>
                        <p className="text-xl font-bold text-foreground leading-tight">{item.label}</p>
                        <p className="text-xs text-muted-foreground mt-1 font-medium">{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FinanceCard>
          </ScrollReveal>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="relative z-20 px-6 container mx-auto mt-40 text-center pb-40">
          <ScrollReveal>
            <h2 className="text-6xl md:text-[8rem] font-heading font-black tracking-tighter mb-16 opacity-10 uppercase">The Future.</h2>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-primary text-primary-foreground font-bold text-xl hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-primary/20"
            >
              LAUNCH DASHBOARD
              <Rocket size={24} />
            </Link>
            <p className="text-muted-foreground mt-16 font-black uppercase tracking-[0.4em] text-xs">Crafted with <Heart size={14} className="inline text-primary mx-2 animate-pulse" /> by Avik Majumdar</p>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}

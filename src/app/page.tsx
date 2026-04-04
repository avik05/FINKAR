"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
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
  { icon: Landmark, title: "Bank Tracking", desc: "Aggregate all accounts for a clear picture of cash flow." },
  { icon: TrendingUp, title: "Stock Portfolio", desc: "Track NSE/BSE holdings and analyze sector allocation." },
  { icon: PieChart, title: "Mutual Funds", desc: "Monitor SIPs, compare NAVs, and calculate XIRR." },
  { icon: CreditCard, title: "Expense Analysis", desc: "Categorize spending and set intelligent budgets." },
  { icon: BarChart3, title: "Robo Analyser", desc: "AI-assisted portfolio risk and diversification analysis." },
  { icon: Target, title: "Goal Planning", desc: "Set and track visual progress for your life targets." },
];

const values = [
  { icon: Lightbulb, title: "Clarity first", desc: "Complex data, simplified into insights." },
  { icon: Users, title: "User Centric", desc: "Built for students and young professionals." },
  { icon: Heart, title: "Empowerment", desc: "Confidence in your financial decisions." },
  { icon: Globe, title: "Holistic View", desc: "Every dimension in a unified dashboard." },
];

import { useMotionValue } from "framer-motion";

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
    <div ref={containerRef} className="relative min-h-[300vh] pt-12 pb-24 overflow-x-hidden">
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
            Empowering Your Wealth
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/50 leading-[0.9]"
          >
            Your Finance,<br />
            <span className="text-primary italic">Finally Under Control.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12 font-medium"
          >
            Finkar is the high-performance dashboard that brings every corner of your financial life into one beautiful interface.
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
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-6 opacity-40">Zero setup · 100% Privacy · Free forever</p>
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
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Precision Tools</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Six automated modules designed to eliminate financial guesswork.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <MagneticCard key={f.title} className="h-full">
              <ScrollReveal delay={idx * 0.1}>
                <FinanceCard className="p-8 h-full bg-card/40 backdrop-blur-xl border-border/40 hover:border-primary/30 transition-colors group">
                  <div className="flex flex-col gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <f.icon size={28} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </FinanceCard>
              </ScrollReveal>
            </MagneticCard>
          ))}
        </div>
      </motion.section>

      {/* --- FOUNDER STORY --- */}
      <section className="relative z-20 px-6 container mx-auto mt-40">
        <ScrollReveal direction="left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-purple-500/20 rounded-3xl blur-3xl opacity-50" />
              <FinanceCard className="absolute inset-4 flex flex-col items-center justify-center text-center p-10 border-primary/20 bg-card/60 backdrop-blur-2xl rounded-2xl shadow-2xl">
                <div className="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-6">
                  <GraduationCap size={48} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-1">Avik Majumdar</h3>
                <p className="text-xs text-primary font-bold uppercase tracking-widest mb-4">Founder & Dev</p>
                <p className="text-sm text-muted-foreground italic">&quot;Built out of necessity, evolved through vision.&quot;</p>
              </FinanceCard>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-heading font-black leading-tight">The Vision of a <span className="text-primary">Solo Founder.</span></h2>
              <div className="space-y-6 text-lg text-muted-foreground font-medium">
                <p>
                  Finkar wasn&apos;t built in a boardroom. It was born in a dorm room by an undergraduate student tired of managing finances through messy spreadsheets.
                </p>
                <p>
                  Now an MBA candidate at <span className="text-foreground">Great Lakes, Chennai</span>, I&apos;m scaling Finkar into a sophisticated ecosystem that understands the friction of personal finance better than any enterprise app ever could.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {["Solo Founder", "GLIM, Chennai", "FinTech Disruptor", "No-Venture Bound"].map(tag => (
                  <span key={tag} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full bg-foreground/5 border border-border/50">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* --- VISION & MISSION GRID --- */}
      <section className="relative z-20 px-6 container mx-auto mt-40">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal direction="up" delay={0.1}>
            <FinanceCard className="p-12 bg-gradient-to-br from-primary/10 to-transparent border-primary/20 rounded-[2rem]">
              <Rocket size={40} className="text-primary mb-8" />
              <h3 className="text-3xl font-heading font-black mb-4 uppercase tracking-tighter">Our Mission</h3>
              <p className="text-xl text-muted-foreground leading-relaxed font-semibold">
                To simplify, automate, and democratize wealth intelligence for the next generation.
              </p>
            </FinanceCard>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <FinanceCard className="p-12 bg-card/40 border-border/40 rounded-[2rem]">
              <Globe size={40} className="text-blue-400 mb-8" />
              <h3 className="text-3xl font-heading font-black mb-4 uppercase tracking-tighter">Our Vision</h3>
              <p className="text-xl text-muted-foreground leading-relaxed font-semibold">
                Building the zero-friction financial core for millions of global young professionals.
              </p>
            </FinanceCard>
          </ScrollReveal>
        </div>
      </section>

      {/* --- VALUES --- */}
      <section className="relative z-20 px-6 container mx-auto mt-40">
        <ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div key={v.title} className="group">
              <v.icon size={32} className="text-primary mb-6 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />
              <h3 className="text-lg font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground font-medium">{v.desc}</p>
            </div>
          ))}
        </div>
        </ScrollReveal>
      </section>

      {/* --- CONNECT SECTION --- */}
      <section className="relative z-20 px-6 container mx-auto mt-40">
        <ScrollReveal>
          <FinanceCard className="p-12 md:p-20 text-center rounded-[3rem] border-primary/10 bg-black/20 backdrop-blur-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <h2 className="text-4xl md:text-6xl font-heading font-black mb-8">Let&apos;s Build the Future.</h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium">
              Join the conversation. Whether it&apos;s feedback, ideas, or partnership — I&apos;m one click away.
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
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl bg-foreground/5 border border-border/40 font-bold text-sm transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 ${social.color}`}
                >
                  <social.icon size={20} />
                  {social.label}
                </Link>
              ))}
            </div>
          </FinanceCard>
        </ScrollReveal>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="relative z-20 px-6 container mx-auto mt-40 text-center">
        <ScrollReveal>
          <div className="inline-block animate-pulse mb-8 overflow-hidden">
            <Sparkles size={60} className="text-primary opacity-20" />
          </div>
          <h2 className="text-5xl md:text-8xl font-heading font-black tracking-tighter mb-8 leading-none">
            READY TO LEVEL UP?
          </h2>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-4 px-12 py-6 rounded-full bg-primary text-primary-foreground font-black text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_30px_70px_rgba(0,255,156,0.3)]"
          >
            LAUNCH DASHBOARD
            <Rocket size={28} />
          </Link>
          <p className="text-muted-foreground mt-8 font-black uppercase tracking-[0.2em] text-[10px]">Made with <Heart size={10} className="inline text-primary mx-1" /> by Avik</p>
        </ScrollReveal>
      </section>
    </div>
  );
}

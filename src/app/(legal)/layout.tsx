"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Landmark } from "lucide-react";
import { motion } from "framer-motion";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Simple Header */}
      <header className="border-b border-border/10 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group transition-all">
            <div className="p-1.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Landmark size={18} className="text-primary" />
            </div>
            <span className="font-heading font-black tracking-tighter text-xl uppercase italic">Finkar</span>
          </Link>
          
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors px-4 py-2 rounded-xl bg-secondary/50 border border-border/50"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-invert prose-emerald max-w-none 
            prose-headings:font-heading prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
            prose-h1:text-4xl prose-h1:mb-8 prose-h1:italic
            prose-h2:text-xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border/20 prose-h2:pb-2
            prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-foreground prose-strong:font-bold
            prose-li:text-muted-foreground prose-li:mb-2"
        >
          {children}
        </motion.div>
      </main>

      <footer className="border-t border-border/10 py-12 bg-secondary/20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground/40">
            © 2024-2026 Finkar. Actionable Finance. Futuristic Control.
          </p>
        </div>
      </footer>
    </div>
  );
}

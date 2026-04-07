"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  HelpCircle, 
  Settings, 
  ShieldCheck, 
  TrendingUp, 
  Terminal, 
  ArrowRight,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { Accordion } from "@/components/ui/accordion";
import { FinanceCard } from "@/components/ui/finance-card";

const FAQ_DATA = [
  {
    category: "Getting Started",
    icon: HelpCircle,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    items: [
      {
        title: "What is Finkar?",
        content: "Finkar is your personal financial command center that helps you track your money, investments, and goals in one place."
      },
      {
        title: "Do I need to pay to use Finkar?",
        content: "Finkar currently offers core features for free. Future premium features may be introduced."
      },
      {
        title: "How do I get started?",
        content: "Simply sign up, verify your email, and start adding your accounts and transactions."
      }
    ]
  },
  {
    category: "Accounts & Data",
    icon: Settings,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    items: [
      {
        title: "Is my financial data saved permanently?",
        content: "Yes. Your data is securely stored in our Supabase database and is linked only to your account."
      },
      {
        title: "Can I use Finkar without logging in?",
        content: "Yes, but only in guest mode with sample data. To save your real data, you must log in."
      },
      {
        title: "How are my balances updated automatically?",
        content: "Finkar uses an automated backend system (Postgres triggers) to update balances whenever transactions are added or edited."
      }
    ]
  },
  {
    category: "Security & Privacy",
    icon: ShieldCheck,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    items: [
      {
        title: "Is my data safe?",
        content: "Yes. Finkar uses secure authentication, database-level access control (RLS), and email verification to protect your data."
      },
      {
        title: "Can anyone else see my data?",
        content: "No. Each user can only access their own data."
      },
      {
        title: "Why do I need to verify my email?",
        content: "To ensure security and prevent unauthorized access."
      }
    ]
  },
  {
    category: "Investments",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
    items: [
      {
        title: "Can I track stocks and mutual funds?",
        content: "Yes. You can manually add your holdings and track them inside your dashboard and even fetch your holding automatically."
      },
      {
        title: "Does Finkar connect directly to brokers like Groww?",
        content: "Finkar does not directly auto-sync with brokers yet. However, you can easily import your holdings by uploading the XLSX file provided by your broker, allowing you to fetch your investments automatically without manual entry."
      }
    ]
  },
  {
    category: "Technical & Troubleshooting",
    icon: Terminal,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    items: [
      {
        title: "Why is my data not loading?",
        content: "This could be due to connectivity issues or session expiry. Try refreshing or logging in again."
      },
      {
        title: "I didn’t receive a verification email. What should I do?",
        content: "Check spam or request a new email. We use a reliable email system (Resend SMTP), but delays may occasionally happen."
      }
    ]
  },
  {
    category: "Roadmap & Feedback",
    icon: MessageSquare,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    items: [
      {
        title: "How can I request a new feature or bank integration?",
        content: "We love hearing from you! Use the Contact Us form and select 'Feature Request' to help us prioritize our roadmap. We are actively working on expanding our automated bank connectivity."
      },
      {
        title: "Can I delete my account and all associated data?",
        content: "Yes, we believe in full data sovereignty. You can request a complete account deletion and data wipe at any time through your Profile settings or by contacting our support team."
      },
      {
        title: "Is there a mobile app available?",
        content: "Finkar is built as a highly-optimized Progressive Web App (PWA). You can 'Add to Home Screen' on your iPhone or Android device for a smooth, native-like experience without needing an app store."
      },
      {
        title: "How does the future roadmap look for Finkar?",
        content: "Our goal is to become the ultimate financial OS. Upcoming features include AI-driven tax optimization, family shared accounts, and deep investment analysis for overseas markets."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 relative">
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10 animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] -z-10 animate-float delay-1000" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tighter text-foreground mb-4">
          Everything you need to <span className="text-primary italic">know</span>.
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Commonly asked questions about Finkar's features, security, and the future of automated finance.
        </p>
      </motion.div>

      <div className="space-y-16">
        {FAQ_DATA.map((section, sidx) => (
          <motion.section 
            key={section.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sidx * 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 px-2">
              <div className={`p-2.5 rounded-xl ${section.bg} ${section.color} border border-current/10 shadow-sm shadow-black/20`}>
                <section.icon size={20} />
              </div>
              <h2 className="text-xl font-heading font-bold text-foreground tracking-tight">
                {section.category}
              </h2>
            </div>
            
            <Accordion items={section.items} />
          </motion.section>
        ))}
      </div>

      {/* Still Have Questions CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-24"
      >
        <FinanceCard className="p-8 md:p-12 text-center bg-gradient-to-br from-primary/10 via-card/60 to-background border-primary/20 shadow-[0_0_40px_rgba(0,255,156,0.1)]">
          <h2 className="text-2xl md:text-3xl font-heading font-black text-foreground mb-4 italic">
            Still have questions?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            We’re here to help you take control of your financial destiny. Reach out to us and we’ll get back to you sooner than a market open.
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-black text-lg hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_8px_32px_rgba(0,255,156,0.3)] group"
          >
            Contact Support
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </FinanceCard>
      </motion.div>
    </div>
  );
}

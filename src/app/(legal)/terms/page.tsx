import React from "react";
import Link from "next/link";

export default function TermsOfServicePage() {
  const lastUpdated = "April 10, 2026";

  return (
    <>
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-heading font-black italic tracking-tighter uppercase mb-2 text-foreground">
          Terms of Service
        </h1>
        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/40">
          Last Updated: {lastUpdated}
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          1. Introduction
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Welcome to **Finkar** (getfinkar.com). In these Terms, &quot;Finkar,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot; refers to the platform and ITS owners. &quot;User,&quot; &quot;you,&quot; or &quot;your&quot; refers to any individual who accesses or uses the Service.
        </p>
        <div className="p-4 rounded-xl bg-foreground/[0.03] border border-border/20 text-sm italic font-medium text-foreground">
          By accessing or using Finkar, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          2. Eligibility
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to create an account or use the Service. By using Finkar, you represent and warrant that you meet these eligibility requirements.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          3. Description of Service
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Finkar is a high-performance personal finance tracking and analytics dashboard. We provide tools to aggregate, visualize, and analyze your financial data, including stocks, mutual funds, bank balances, and expenses.
        </p>
        <div className="p-6 rounded-2xl bg-secondary/10 border border-border/20">
          <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">Service Scope</p>
          <p className="text-foreground text-sm font-bold leading-relaxed">
            Finkar is an informational tool only. We are NOT a brokerage, NOT a financial advisor, and NOT a trading platform.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          4. No Financial Advice
        </h2>
        <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
          <p className="text-destructive font-black uppercase tracking-widest text-[10px] mb-2">Critical Disclaimer</p>
          <div className="space-y-4 text-foreground text-sm font-bold leading-relaxed">
            <p>
              Finkar does NOT provide investment, tax, legal, or financial advice. All insights, calculations (such as XIRR), and data analysis provided by the platform are for informational and educational purposes only.
            </p>
            <p>
              You are solely responsible for your financial decisions. We strongly recommend consulting with a certified financial professional before making any investment or asset allocation choices.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          5. User Responsibilities
        </h2>
        <ul className="list-disc list-inside space-y-3 text-muted-foreground leading-relaxed">
          <li><strong>Data Accuracy:</strong> You are responsible for the accuracy and completeness of any data you enter or upload.</li>
          <li><strong>Security:</strong> You must maintain the confidentiality of your account credentials.</li>
          <li><strong>Prohibited Use:</strong> You agree not to misuse the platform, including scraping, reverse engineering, or attempting to compromise the security of our cloud infrastructure.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          6. Account & Authentication
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We utilize third-party authentication providers (e.g., Supabase, Google, GitHub) to secure your access. You are responsible for all activity that occurs under your account. If you suspect unauthorized access, you must notify us immediately.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          7. Data & Privacy
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Your privacy is paramount. All data collection and usage are governed by our <Link href="/privacy" className="text-primary hover:underline font-bold">Privacy Policy</Link>. By using Finkar, you acknowledge that your data is handled as described therein.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          8. Intellectual Property
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Finkar owns all rights, title, and interest in the platform&apos;s design, branding, custom algorithms, and source code. Users are granted a limited right to use the platform but may not copy, reproduce, or distribute any proprietary elements without express written permission.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          9. Service Availability
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          While we strive for maximum reliability, we provide the Service on an &quot;as available&quot; basis. Finkar may be updated, modified, or temporarily discontinued at any time without prior notice. We do not guarantee 100% uptime.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          10. Limitation of Liability
        </h2>
        <div className="p-6 rounded-2xl bg-foreground/[0.03] border border-border/20 text-muted-foreground text-sm space-y-4">
          <p>
            To the maximum extent permitted by law, Finkar and its owners shall not be liable for any direct, indirect, or consequential financial losses arising from your use of the platform.
          </p>
          <p>
            We make no warranties regarding the absolute accuracy of insights, market data, or calculations provided. Use of Finkar is strictly at your own risk.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          11. Termination
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Finkar reserves the right to suspend or terminate your access to the platform for any violation of these Terms or misuse of the Service. You may choose to delete your account and all associated data at any time via the Settings panel.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          12. Governing Law
        </h2>
        <p className="text-muted-foreground leading-relaxed font-bold italic underline decoration-primary/20 decoration-2 underline-offset-4">
          This Privacy Policy and all Terms of Service shall be governed by and interpreted in accordance with the laws of India.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          13. Contact Information
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          For inquiries or support regarding these Terms, please visit our:
          <br />
          <Link href="/contact" className="text-primary hover:underline transition-all font-black">Official Contact Page &rarr;</Link>
        </p>
      </section>

      <section className="mt-16 pt-8 border-t border-border/20 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground/30">
          © 2024-2026 Finkar Dashboard. All Rights Reserved.
        </p>
      </section>
    </>
  );
}

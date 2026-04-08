import React from "react";

export default function TermsOfServicePage() {
  return (
    <>
      <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase mb-12">
        Terms of Service
      </h1>
      
      <section className="mb-12">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          Welcome to Finkar (&quot;the Service&quot;). By using our website and dashboard, you agree to the following terms.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          1. Acceptance of Terms
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          By accessing or using the Service, you confirm your agreement to be bound by these Terms of Service. If you do not agree, please do not use the Service.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          2. Description of Service
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Finkar provides a high-performance financial dashboard for tracking bank accounts, stocks, mutual funds, and expenses through secure cloud synchronization. The Service is for personal tracking and educational purposes only.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          3. Financial Disclaimer
        </h2>
        <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6">
          <p className="text-destructive font-black uppercase tracking-widest text-xs mb-2">Warning</p>
          <p className="text-foreground font-bold">
            Finkar is NOT a financial advisor. All data, insights, and analysis provided by the Service are for tracking and simulation. You should consult with a certified financial professional before making any investment or financial decisions.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          4. User Responsibilities
        </h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>You are responsible for the accuracy of the data you input.</li>
          <li>You agree not to use the Service for any illegal or unauthorized purpose.</li>
          <li>You must keep your credentials secure.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          5. Intellectual Property
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          All content, design, and code (the &quot;Finkar Brand&quot;) are the exclusive property of Finkar. No authorization is granted to copy, redistribute, or reverse engineer any part of the Service.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          6. Limitation of Liability
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Finkar shall not be liable for any financial losses, data inaccuracies, or damages arising from the use of the Service. Use of the Service is at your own risk.
        </p>
      </section>

      <section className="mt-16 pt-8 border-t border-border/20">
        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/40">
          Last Updated: April 2025
        </p>
      </section>
    </>
  );
}

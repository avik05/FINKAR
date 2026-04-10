import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  const lastUpdated = "April 10, 2026";

  return (
    <>
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-heading font-black italic tracking-tighter uppercase mb-2">
          Privacy Policy
        </h1>
        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest font-black text-primary animate-pulse">
            Compliant with Google Play Developer Policy
          </p>
          <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/40">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>
      
      <section className="mb-12">
        <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-6">
          At Finkar, we understand that your financial data is deeply personal. This Privacy Policy describes how Finkar (“we,” “us,” or “our”) collects, uses, and protects your information when you use our web platform and mobile application.
        </p>
        <div className="p-4 rounded-xl bg-foreground/[0.03] border border-border/20 text-sm italic text-muted-foreground">
          By using Finkar, you consent to the collection and use of your information in accordance with this Privacy Policy.
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          1. Information We Collect
        </h2>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <div>
            <h3 className="text-foreground font-bold uppercase text-xs tracking-widest mb-2">A. Personal Identification</h3>
            <p>Registration information including your name, email address, and profile picture (when provided via third-party authentication providers like Google or GitHub).</p>
          </div>
          <div>
            <h3 className="text-foreground font-bold uppercase text-xs tracking-widest mb-2">B. Financial Information</h3>
            <p>To provide our core dashboard services, we collect and store asset portfolios (names of stocks, mutual funds), transaction history (prices, dates, quantities), and bank account labels/balances.</p>
          </div>
          <div>
            <h3 className="text-foreground font-bold uppercase text-xs tracking-widest mb-2">C. Technical & Device Data</h3>
            <p>Automatic collection of IP addresses, browser types, operating systems, and basic usage logs to help us optimize platform performance and security.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          2. How We Use Information
        </h2>
        <p className="text-muted-foreground mb-4">We process your data strictly to power the Finkar experience and fulfill the following purposes:</p>
        <ul className="list-disc list-inside space-y-3 text-muted-foreground leading-relaxed">
          <li><strong>Operations:</strong> To provide, operate, and maintain our financial dashboard services.</li>
          <li><strong>Analytics & Insights:</strong> Calculating XIRR, diversification, and wealth metrics.</li>
          <li><strong>Communications:</strong> To communicate with users, including providing platform updates and technical support.</li>
          <li><strong>Synchronization:</strong> Ensuring your data is securely accessible across all your devices.</li>
          <li><strong>Legal Compliance:</strong> To comply with legal obligations and regulatory requirements.</li>
          <li><strong>Platform Integrity:</strong> Preventing unauthorized access and ensuring a stable user experience.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          3. Third-Party Services & integrations
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          We utilize industry-standard service providers to maintain Finkar. These providers may process limited data such as user identifiers, technical data, or stored financial data strictly to support platform functionality.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-border/20">
            <h4 className="text-foreground font-bold text-sm mb-1">Supabase</h4>
            <p className="text-xs text-muted-foreground">Primary data storage and authentication provider (PostgreSQL/AWS).</p>
          </div>
          <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-border/20">
            <h4 className="text-foreground font-bold text-sm mb-1">Vercel</h4>
            <p className="text-xs text-muted-foreground">Hosting infrastructure and basic performance monitoring.</p>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20">
          <p className="text-primary font-black uppercase tracking-widest text-[10px] mb-2">Critical Security Disclosure</p>
          <div className="space-y-4">
            <p className="text-foreground text-sm font-bold leading-relaxed">
              Finkar does NOT currently integrate with brokerage accounts to execute trades. We do NOT have access to your bank passwords or brokerage login credentials.
            </p>
            <p className="text-foreground text-xs font-medium border-t border-primary/20 pt-4 opacity-80 leading-relaxed">
              <strong>Finkar does not collect or store sensitive financial credentials such as bank passwords, OTPs, or brokerage login details.</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          4. Cookies & Tracking Technologies
        </h2>
        <p className="text-muted-foreground leading-relaxed italic">
          Finkar uses essential cookies and local storage mechanisms to maintain user sessions, authentication, and platform functionality. We do not use intrusive tracking or advertising cookies.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          5. Data Storage & Security
        </h2>
        <ul className="list-disc list-inside space-y-3 text-muted-foreground leading-relaxed mb-6">
          <li><strong>Encryption:</strong> All data is encrypted in transit (SSL/TLS) and at rest (AES-256) within Supabase.</li>
          <li><strong>Confidentiality:</strong> Your data is used only to provide dashboard features and is never sold to advertisers or third-party brokers.</li>
          <li><strong>Protection:</strong> We implement reasonable physical, technical, and administrative safeguards to protect your information.</li>
        </ul>
        <p className="text-[10px] uppercase tracking-widest font-black text-destructive/60">
          Disclaimer: However, no system is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          6. Data Sharing & Disclosure
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          We prioritize the confidentiality of your financial data. We only share information with third-party service providers (as listed in Section 3) to the extent necessary to operate the platform.
        </p>
        <div className="p-4 rounded-xl bg-foreground/[0.03] border border-border/20 text-sm text-muted-foreground leading-relaxed">
          We may disclose information if required by law or to protect the rights, safety, and integrity of our platform.
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          7. User Rights & Data Deletion
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          You have full control over your data, including the right to access, edit, or delete it at any time.
        </p>
        <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6 font-medium">
          <p className="text-destructive font-black uppercase tracking-widest text-[10px] mb-2">How to Delete Your Data</p>
          <p className="text-foreground text-sm font-bold mb-4">
            You may request the permanent deletion of your account and all associated data via the following methods:
          </p>
          <ul className="list-decimal list-inside space-y-2 text-xs text-foreground/80">
            <li>Go to <strong>Settings &gt; Profile</strong> within the dashboard and select <strong>"Delete My Account"</strong>.</li>
            <li>Submit a formal deletion request via our <Link href="/contact" className="underline hover:text-primary transition-colors">Official Contact Page</Link>.</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          8. Additional Disclosures
        </h2>
        <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
          <div>
            <h3 className="text-foreground font-bold uppercase text-xs tracking-widest mb-1">Data Retention</h3>
            <p>Data is stored as long as your account is active. Upon deletion request, active data is purged within 30 days.</p>
          </div>
          <div>
            <h3 className="text-foreground font-bold uppercase text-xs tracking-widest mb-1">Children's Privacy</h3>
            <p>Finkar is not intended for individuals under 13. We do not knowingly collect data from children.</p>
          </div>
          <div>
            <h3 className="text-foreground font-bold uppercase text-xs tracking-widest mb-1">Jurisdiction</h3>
            <p className="italic underline decoration-primary/20 underline-offset-4">This Privacy Policy shall be governed by and interpreted in accordance with the laws of India.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          9. Contact Information
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          For any privacy-related inquiries, please contact our support team via our:
          <br />
          <Link href="/contact" className="text-primary hover:underline transition-all">Official Contact Page &rarr;</Link>
        </p>
      </section>

      <section className="mt-16 pt-8 border-t border-border/20 flex flex-col gap-2">
        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/40">
          Last Updated: {lastUpdated}
        </p>
        <p className="text-[9px] font-bold text-muted-foreground/30 tracking-[0.3em] uppercase">
          © 2024-2026 Finkar Dashboard. All Rights Reserved.
        </p>
      </section>
    </>
  );
}

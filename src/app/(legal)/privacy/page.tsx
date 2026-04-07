import React from "react";

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase mb-12">
        Privacy Policy
      </h1>
      
      <section className="mb-12">
        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
          At Finkar ("the Service"), we take the privacy of your financial data seriously. This Privacy Policy describes our practices regarding the collection, use, and disclosure of information.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          1. Information Collection
        </h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>User Provided Data:</strong> We collect information you manually enter, such as account names, transaction details, and investment holdings.</li>
          <li><strong>Auto-Generated Insights:</strong> We process the provided data to generate financial insights and analytics.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          2. Storage & Security
        </h2>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li><strong>Cloud Synchronization:</strong> All your financial data is securely synced to your Finkar account in the cloud using **Supabase** (powered by AWS/PostgreSQL).</li>
          <li><strong>Encryption:</strong> Data is encrypted both in transit (TLS/SSL) and at rest to ensure maximum protection.</li>
          <li><strong>Confidentiality:</strong> Your data is used only to provide the dashboard's features and is never accessible to anyone but you.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          3. Financial Data Protection
        </h2>
        <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
          <p className="text-primary font-black uppercase tracking-widest text-xs mb-2">Safety Notice</p>
          <p className="text-foreground font-bold">
            We do NOT sell or share your financial data with any third-party advertisers. Your data is for your personal tracking only.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          4. Third-Party Links
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The Service may contain links to third-party websites (e.g., Substack, social media). We are not responsible for the privacy practices of those sites.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          5. Your Rights
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          You have the right to access, edit, or delete any of your data and information at any time from within the dashboard settings.
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

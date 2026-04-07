import React from "react";

export default function LicensePage() {
  return (
    <>
      <h1 className="text-4xl font-heading font-black italic tracking-tighter uppercase mb-12">
        License
      </h1>
      
      <section className="mb-12 text-center py-8 rounded-3xl bg-secondary/10 border border-border/20">
        <p className="text-[10px] uppercase tracking-[0.5em] font-black text-muted-foreground/40 mb-4">Official Documentation</p>
        <p className="text-lg font-bold text-foreground">Copyright © 2024-2025 Finkar. All rights reserved.</p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          Proprietary License
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The software, design, cloud-synchronization architecture, and content of "Finkar" (the "Software") are the exclusive property of Finkar and its owners.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          1. Ownership
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          All software, designs, algorithms, code segments, and intellectual property contained within this repository and the associated website are licensed, not sold.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          2. Restrictions
        </h2>
        <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
          <p className="text-destructive font-black uppercase tracking-widest text-[10px] mb-4">Prohibited Actions</p>
          <ul className="list-disc list-inside space-y-3 text-muted-foreground font-medium">
            <li>Copy, reproduce, or redistribute the Software's code or design in any form.</li>
            <li>Modify the Software and distribute it as your own.</li>
            <li>Use the "Finkar" or "Finकर" name or logo without express written permission.</li>
            <li>Decompile, reverse engineer, or attempt to derive the source code of the Software.</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6">
          3. Usage
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          This code is provided for demonstration/personal use as authorized by the owner. Unauthorized use of this Software is strictly prohibited and may result in legal action.
        </p>
      </section>

      <section className="mt-16 pt-8 border-t border-border/20 text-center">
        <p className="text-sm font-bold text-primary italic">
          For inquiries, please contact the owner directly.
        </p>
      </section>
    </>
  );
}

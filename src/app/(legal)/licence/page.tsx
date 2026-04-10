import React from "react";
import Link from "next/link";

export default function LicensePage() {
  const lastUpdated = "April 10, 2026";

  return (
    <>
      <div className="mb-12">
        <h1 className="text-5xl md:text-6xl font-heading font-black italic tracking-tighter uppercase mb-2 text-foreground">
          License Agreement
        </h1>
        <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/40">
          Last Updated: {lastUpdated}
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          1. Overview
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          This License Agreement governs your use of the Finkar Dashboard software and platform. By using Finkar, you are granted a limited, non-exclusive, non-transferable, and revocable license to access and use the platform strictly for personal, non-commercial financial tracking.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          2. Permitted Use
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Users are permitted to use Finkar to:
        </p>
        <ul className="list-disc list-inside space-y-3 text-muted-foreground leading-relaxed mt-4">
          <li>Track personal financial assets including stocks, mutual funds, and bank accounts.</li>
          <li>Access dashboards, analytics, and performance insights for personal informational use.</li>
          <li>Enter and manage financial data through our secure cloud-synchronized interface.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          3. Restrictions
        </h2>
        <div className="p-6 rounded-2xl bg-destructive/10 border border-destructive/20 mb-6 font-medium">
          <p className="text-destructive font-black uppercase tracking-widest text-[10px] mb-4">Prohibited Actions</p>
          <ul className="list-disc list-inside space-y-3 text-foreground text-sm leading-relaxed">
            <li><strong>No Reproduction:</strong> You may not copy, modify, or reproduce the platform&apos;s source code, design, or branding.</li>
            <li><strong>No Reverse Engineering:</strong> You may not attempt to derive the source code or underlying algorithms of the Software.</li>
            <li><strong>No Reselling:</strong> You may not sell, lease, or commercially exploit the platform without express written permission.</li>
            <li><strong>No Illegal Access:</strong> You may not attempt to access our backend systems, database (Supabase), or private APIs through unauthorized means.</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          4. Ownership
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Finkar and its owners retain full ownership and all intellectual property rights in and to the Software, including all updates, custom designs, and performance logic. This license does not convey any ownership rights to the user.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          5. Third-Party Services
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          The operation of Finkar depends on third-party dependencies such as <strong>Supabase</strong> (Database & Auth) and <strong>Vercel</strong> (Edge Hosting). Your use of the platform is also subject to the terms and policies of these external providers.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          6. No Warranty
        </h2>
        <p className="text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-4 py-2">
          &quot;The platform is provided on an &apos;as is&apos; and &apos;as available&apos; basis. Finkar makes no warranties, express or implied, regarding the accuracy, reliability, or continuous availability of the Software.&quot;
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          7. Limitation of Liability
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          In no event shall Finkar or its developers be liable for any financial losses, loss of data, or damages resulting from the use or inability to use the platform. Use at your own risk.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          8. Termination of License
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          This license will terminate automatically if you fail to comply with any of these terms and conditions. Upon termination, you must cease all use of the Application.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          9. Updates to License
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Finkar reserves the right to update this License Agreement at any time. Material changes will be noted on this page.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-heading font-bold uppercase tracking-tight border-b border-border/20 pb-2 mb-6 text-foreground">
          10. Governing Law
        </h2>
        <p className="text-muted-foreground leading-relaxed font-bold italic underline decoration-primary/20 decoration-2 underline-offset-4">
          This License Agreement is governed by and interpreted in accordance with the laws of India.
        </p>
      </section>

      <section className="mt-16 pt-8 border-t border-border/20 text-center space-y-4">
        <p className="text-sm font-bold text-primary italic">
          For formal inquiries or licensing requests, please use our <Link href="/contact" className="underline">Official Contact Page</Link>.
        </p>
        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-muted-foreground/30">
          © 2024-2026 Finkar Dashboard. All Rights Reserved.
        </p>
      </section>
    </>
  );
}

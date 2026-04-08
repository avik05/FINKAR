import type { Metadata } from "next";
import React from "react";
import { Inter, Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://getfinkar.com'),
  title: {
    default: "Finkar Dashboard — Actionable Finance",
    template: "%s | Finkar"
  },
  description: "Don’t just manage money. Do finance. The futuristic dashboard for controlling your financial destiny. Track stocks, mutual funds, and bank accounts in one view.",
  applicationName: "Finkar",
  authors: [{ name: "Avik Majumdar", url: "https://www.linkedin.com/in/avik0508" }],
  creator: "Avik Majumdar",
  publisher: "Finkar",
  keywords: ["finance tracker", "stock portfolio", "mutual fund tracking", "expense manager", "indian finance", "investment dashboard"],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://getfinkar.com",
    title: "Finkar — Actionable Personal Finance",
    description: "The all-in-one financial cockpit for tracking bank accounts, stocks, and mutual funds.",
    siteName: "Finkar",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finkar — Actionable Personal Finance",
    description: "Control your financial destiny with the futuristic Finkar dashboard.",
    creator: "@aviiiiiiik",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://getfinkar.com',
  },
  other: {
    copyright: "© 2024-2025 Finkar. All Rights Reserved.",
  }
};

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomWrapper } from "@/components/layout/mobile-bottom-wrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StoreHydrator } from "@/components/shared/store-hydrator";
import { AiChatbotPanel } from "@/components/shared/ai-chatbot-panel";
import { AuthGuard } from "@/components/shared/auth-guard";
import { CursorGlow } from "@/components/shared/cursor-glow";
import { BackgroundGlows } from "@/components/shared/background-glows";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} antialiased`}
    >
      <body className="bg-background text-foreground overscroll-none min-h-screen relative">
        {/* Theme Script - Optimized with next/script */}
        <Script
          id="theme-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('finkar-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
        
        <CursorGlow />
        <AuthGuard>
          <StoreHydrator />
          <div className="relative min-h-screen flex flex-col">
            {children}
          </div>
          <MobileBottomWrapper />
          <AiChatbotPanel />
          <Analytics />
          <SpeedInsights />
        </AuthGuard>
      </body>
    </html>
  );
}

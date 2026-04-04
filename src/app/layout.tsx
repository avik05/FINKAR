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
  title: "Finkar Dashboard - Actionable Finance",
  description: "Don’t just manage money. Do finance.",
};

import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StoreHydrator } from "@/components/shared/store-hydrator";
import { AiChatbotPanel } from "@/components/shared/ai-chatbot-panel";
import { AuthGuard } from "@/components/shared/auth-guard";
import { CursorGlow } from "@/components/shared/cursor-glow";
import { BackgroundGlows } from "@/components/shared/background-glows";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('finkar-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <CursorGlow />
        <AuthGuard>
          <StoreHydrator />
          <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background bg-[url('/bg-noise.png')] bg-repeat bg-fixed relative overflow-x-hidden">
              {/* Dot Grid Pattern — more visible in light mode */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0" 
                style={{ 
                  backgroundImage: `radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0)`,
                  backgroundSize: "24px 24px"
                }} 
              />
              <BackgroundGlows />
              
              <AppSidebar />
              {/* Main content area - let the Sidebar's internal gap handle the flex spacing */}
              <div className="flex flex-col flex-1 z-10 w-full relative transition-all duration-300">
                <Header />
                <main className="flex-1 p-4 md:p-6 lg:p-8 scroll-smooth transition-all duration-300 overflow-visible">
                  {/* Physical Header Spacer — Guaranteed Clearance */}
                  <div className="h-16 md:h-20 w-full shrink-0" />
                  
                  <div className="mx-auto max-w-7xl px-4 md:px-8 min-h-full flex flex-col pb-6">
                    <div className="flex-1">
                      {children}
                    </div>
                    <Footer />
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
          <AiChatbotPanel />
        </AuthGuard>
      </body>
    </html>
  );
}



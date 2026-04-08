"use client";

import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BackgroundGlows } from "@/components/shared/background-glows";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background bg-repeat bg-fixed relative">
        {/* Dot Grid Pattern — more visible in light mode */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0)`,
            backgroundSize: "24px 24px"
          }} 
        />
        <BackgroundGlows />
        
        <AppSidebar />
        
        {/* Main content area - Shifted by sidebar width on desktop */}
        <div className="flex flex-col flex-1 z-10 w-full relative md:pl-64 transition-[padding] duration-300 group-has-data-[sidebar=sidebar-wrapper][data-state=collapsed]:md:pl-20">
          <Header />
          <main className="flex-1 p-4 md:p-6 lg:p-8 transition-[padding] duration-300 overflow-visible pb-24 md:pb-8">
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
  );
}

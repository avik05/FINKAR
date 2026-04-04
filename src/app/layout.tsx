import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
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
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('finkar-theme');if(t==='light'){document.documentElement.classList.remove('dark')}else{document.documentElement.classList.add('dark')}}catch(e){document.documentElement.classList.add('dark')}})()`,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground overflow-hidden">
        <CursorGlow />
        <AuthGuard>
          <StoreHydrator />
          <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-background bg-[url('/bg-noise.png')] bg-repeat bg-fixed relative">
              {/* Dot Grid Pattern — more visible in light mode */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0" 
                style={{ 
                  backgroundImage: `radial-gradient(circle at 1.5px 1.5px, currentColor 1px, transparent 0)`,
                  backgroundSize: "24px 24px"
                }} 
              />
              {/* Ambient Background Glows — visible in both light and dark */}
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none ambient-blob opacity-40 dark:opacity-70 z-0" style={{ background: "radial-gradient(circle, rgba(0,199,123,0.3) 0%, transparent 70%)" }} />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full pointer-events-none ambient-blob opacity-30 dark:opacity-50 z-0" style={{ background: "radial-gradient(circle, rgba(100,120,200,0.25) 0%, transparent 70%)", animationDelay: "5s" }} />
              
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden z-10 w-full relative">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth transition-all duration-300">
                  <div className="mx-auto max-w-7xl min-h-full flex flex-col pb-6">
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
        <SpeedInsights />
      </body>
    </html>
  );
}



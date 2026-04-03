import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
            <div className="flex h-screen w-full overflow-hidden bg-[url('/bg-noise.png')] bg-repeat bg-fixed relative">
              {/* Ambient Background Glows */}
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 ambient-blob pointer-events-none mix-blend-screen" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary ambient-blob pointer-events-none mix-blend-screen" style={{ animationDelay: "5s" }} />
              
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
        <Analytics />
      </body>
    </html>
  );
}



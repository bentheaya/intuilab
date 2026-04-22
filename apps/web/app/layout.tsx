import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import 'katex/dist/katex.min.css';

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/features/AppSidebar";
import { DiscoveryProvider } from "@/hooks/use-discovery";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntuiLab | Science & Mathematics Rediscovery",
  description: "A world-class Socratic platform for rediscovering scientific intuition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${inter.variable} ${outfit.variable} font-sans min-h-screen bg-zinc-950 text-zinc-100`}>
        <div className="root h-full">
          <DiscoveryProvider>
            <TooltipProvider>
              <SidebarProvider>
                <div className="flex min-h-screen w-full">
                  <AppSidebar />
                  <SidebarInset className="flex flex-col bg-zinc-950">
                    {children}
                  </SidebarInset>
                </div>
              </SidebarProvider>
            </TooltipProvider>
          </DiscoveryProvider>

        </div>
      </body>
    </html>
  );
}

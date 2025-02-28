import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";
import { ThemeColorManager } from "@/components/theme-colors";
import { Toaster } from "sonner";
import { BusinessProfileProvider } from "@/lib/context/business-profile-context";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileBottomBar } from "@/components/mobile-bottom-bar";
import { MobileHeader } from "@/components/mobile-header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Apate - Simple Appointment Manager",
  description: "A simple appointment scheduling application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BusinessProfileProvider>
          <SettingsProvider>
            <ThemeColorManager />
            <div className="min-h-screen bg-background flex flex-col md:flex-row">
              <AppSidebar />
              <div className="flex-1 flex flex-col">
                <MobileHeader />
                <div className="flex-1 p-4 md:p-6 overflow-auto pb-20 md:pb-6">
                  {children}
                </div>
                <MobileBottomBar />
              </div>
            </div>
            <Toaster position="top-right" />
          </SettingsProvider>
        </BusinessProfileProvider>
      </body>
    </html>
  );
}

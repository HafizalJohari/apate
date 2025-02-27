import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";
import { ThemeColorManager } from "@/components/theme-colors";
import { Navbar } from "@/components/navbar";

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
        <SettingsProvider>
          <ThemeColorManager />
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
          </div>
        </SettingsProvider>
      </body>
    </html>
  );
}

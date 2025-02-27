"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarClock, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SettingsPanel } from "@/components/settings-panel";
import { useSettings } from "@/lib/settings-context";

export function Navbar() {
  const pathname = usePathname();
  const { settings, updateSettings } = useSettings();
  
  const toggleTheme = () => {
    const newTheme = settings.themeMode === "dark" ? "light" : "dark";
    updateSettings({ themeMode: newTheme });
  };
  
  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <CalendarClock className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">Apate</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Appointments
            </Link>
            <Link 
              href="/configure" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/configure") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Configure
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full"
            onClick={toggleTheme}
            title={settings.themeMode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {settings.themeMode === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <SettingsPanel />
        </div>
      </div>
    </header>
  );
}
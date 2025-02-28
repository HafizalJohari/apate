"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { CalendarClock, Settings, Building2, Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSettings } from "@/lib/settings-context";
import { Button } from "@/components/ui/button";

export function MobileBottomBar() {
  const pathname = usePathname();
  const { settings, updateSettings } = useSettings();
  
  const toggleTheme = () => {
    const newTheme = settings.themeMode === "dark" ? "light" : "dark";
    updateSettings({ themeMode: newTheme });
  };
  
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const navItems = [
    {
      label: "Appointments",
      href: "/",
      icon: <CalendarClock className="h-5 w-5" />,
    },
    {
      label: "Configure",
      href: "/configure",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      label: "Business",
      href: "/configure/business-profile",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      label: "Theme",
      onClick: toggleTheme,
      icon: settings.themeMode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item, index) => (
          item.onClick ? (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={item.onClick}
              className="flex flex-col items-center justify-center h-full w-full rounded-none"
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Button>
          ) : (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center h-full w-full",
                isActive(item.href) 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        ))}
      </div>
    </div>
  );
} 
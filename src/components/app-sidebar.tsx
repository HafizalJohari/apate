"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { CalendarClock, Settings, Sun, Moon, LayoutDashboard, Building2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSettings } from "@/lib/settings-context";
import { Button } from "@/components/ui/button";
import { SettingsPanel } from "@/components/settings-panel";

export function AppSidebar() {
  const pathname = usePathname();
  const { settings, updateSettings } = useSettings();
  const [open, setOpen] = useState(false);
  
  const toggleTheme = () => {
    const newTheme = settings.themeMode === "dark" ? "light" : "dark";
    updateSettings({ themeMode: newTheme });
  };
  
  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + "/");

  const links = [
    {
      label: "Appointments",
      href: "/",
      icon: (
        <LayoutDashboard className={`h-5 w-5 flex-shrink-0 ${
          isActive("/") ? "text-primary" : "text-neutral-700 dark:text-neutral-200"
        }`} />
      ),
    },
    {
      label: "Configure",
      href: "/configure",
      icon: (
        <Settings className={`h-5 w-5 flex-shrink-0 ${
          isActive("/configure") && !isActive("/configure/business-profile") ? "text-primary" : "text-neutral-700 dark:text-neutral-200"
        }`} />
      ),
    },
    {
      label: "Business Profile",
      href: "/configure/business-profile",
      icon: (
        <Building2 className={`h-5 w-5 flex-shrink-0 ${
          isActive("/configure/business-profile") ? "text-primary" : "text-neutral-700 dark:text-neutral-200"
        }`} />
      ),
    },
  ];

  return (
    <div className="hidden md:flex h-screen">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <CalendarClock className="h-6 w-6 text-primary" />
              <motion.span
                animate={{
                  display: open ? "inline-block" : "none",
                  opacity: open ? 1 : 0,
                }}
                className="text-xl font-bold tracking-tight"
              >
                Apate
              </motion.span>
            </Link>
            
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link} 
                  className={isActive(link.href) ? "text-primary" : ""}
                />
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full w-10 h-10 flex items-center justify-center"
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
        </SidebarBody>
      </Sidebar>
    </div>
  );
} 
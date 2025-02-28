"use client";

import React from "react";
import { CalendarClock } from "lucide-react";
import { SettingsPanel } from "@/components/settings-panel";

export function MobileHeader() {
  return (
    <div className="md:hidden flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold tracking-tight">Apate</span>
      </div>
      <SettingsPanel />
    </div>
  );
} 
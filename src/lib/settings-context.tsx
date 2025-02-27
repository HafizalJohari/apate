"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type ThemeColor = 
  | "lime" 
  | "green" 
  | "blue" 
  | "violet" 
  | "orange" 
  | "red" 
  | "neutral";

export type ThemeMode = "light" | "dark" | "system";

export type ViewMode = "card" | "list" | "compact";

export type TimeFormat = "12h" | "24h";

export type DateFormat = "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD";

export interface SettingsState {
  themeColor: ThemeColor;
  themeMode: ThemeMode;
  viewMode: ViewMode;
  timeFormat: TimeFormat;
  dateFormat: DateFormat;
  showWeekends: boolean;
  enableNotifications: boolean;
  fontScale: number; // 0.8 to 1.2
  borderRadius: number; // 0.5 to 2
  animations: boolean;
  compactView: boolean;
}

interface SettingsContextType {
  settings: SettingsState;
  updateSettings: (settings: Partial<SettingsState>) => void;
  resetSettings: () => void;
}

const defaultSettings: SettingsState = {
  themeColor: "lime",
  themeMode: "system",
  viewMode: "card",
  timeFormat: "12h",
  dateFormat: "MM/DD/YYYY",
  showWeekends: false,
  enableNotifications: true,
  fontScale: 1,
  borderRadius: 1,
  animations: true,
  compactView: false,
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export function SettingsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("apate-settings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Failed to parse settings:", error);
        // If there's an error, reset to defaults
        localStorage.setItem("apate-settings", JSON.stringify(defaultSettings));
      }
    }
  }, []);

  // Update settings
  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("apate-settings", JSON.stringify(updated));
      return updated;
    });
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem("apate-settings", JSON.stringify(defaultSettings));
  };

  // Apply theme mode
  useEffect(() => {
    const applyThemeMode = () => {
      const { themeMode } = settings;
      
      if (themeMode === "system") {
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", systemPrefersDark);
      } else {
        document.documentElement.classList.toggle("dark", themeMode === "dark");
      }
    };

    applyThemeMode();

    // Listen for system preference changes if using system theme
    if (settings.themeMode === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyThemeMode();
      mediaQuery.addEventListener("change", handleChange);
      
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [settings, settings.themeMode]);

  // Apply CSS variables based on settings
  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", settings.fontScale.toString());
    document.documentElement.style.setProperty("--border-radius-scale", settings.borderRadius.toString());
    
    // Set animations
    if (!settings.animations) {
      document.documentElement.classList.add("no-animations");
    } else {
      document.documentElement.classList.remove("no-animations");
    }
    
    // Set compact view
    if (settings.compactView) {
      document.documentElement.classList.add("compact-view");
    } else {
      document.documentElement.classList.remove("compact-view");
    }
  }, [settings.fontScale, settings.borderRadius, settings.animations, settings.compactView]);

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}
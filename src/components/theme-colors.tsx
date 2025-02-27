"use client";

import { useEffect } from "react";
import { ThemeColor, useSettings } from "@/lib/settings-context";

// Theme color CSS variables for each supported color
const themeColorVariables: Record<ThemeColor, { light: string; dark: string }> = {
  lime: {
    light: `
      --primary: oklch(0.75 0.16 135);
      --primary-foreground: oklch(0.985 0 0);
      --accent: oklch(0.85 0.13 140);
      --ring: oklch(0.70 0.15 140);
    `,
    dark: `
      --primary: oklch(0.80 0.18 135);
      --primary-foreground: oklch(0.205 0 0);
      --accent: oklch(0.30 0.15 135);
      --ring: oklch(0.55 0.18 135);
    `,
  },
  green: {
    light: `
      --primary: oklch(0.72 0.14 155);
      --primary-foreground: oklch(0.985 0 0);
      --accent: oklch(0.82 0.12 155);
      --ring: oklch(0.67 0.13 155);
    `,
    dark: `
      --primary: oklch(0.77 0.17 155);
      --primary-foreground: oklch(0.205 0 0);
      --accent: oklch(0.32 0.14 155);
      --ring: oklch(0.52 0.17 155);
    `,
  },
  blue: {
    light: `
      --primary: oklch(0.65 0.17 245);
      --primary-foreground: oklch(0.985 0 0);
      --accent: oklch(0.80 0.12 245);
      --ring: oklch(0.62 0.16 245);
    `,
    dark: `
      --primary: oklch(0.70 0.18 245);
      --primary-foreground: oklch(0.205 0 0);
      --accent: oklch(0.30 0.15 245);
      --ring: oklch(0.50 0.18 245);
    `,
  },
  violet: {
    light: `
      --primary: oklch(0.65 0.18 290);
      --primary-foreground: oklch(0.985 0 0);
      --accent: oklch(0.80 0.10 290);
      --ring: oklch(0.60 0.16 290);
    `,
    dark: `
      --primary: oklch(0.70 0.19 290);
      --primary-foreground: oklch(0.205 0 0);
      --accent: oklch(0.32 0.15 290);
      --ring: oklch(0.50 0.19 290);
    `,
  },
  orange: {
    light: `
      --primary: oklch(0.70 0.15 60);
      --primary-foreground: oklch(0.985 0 0);
      --accent: oklch(0.82 0.12 60);
      --ring: oklch(0.67 0.14 60);
    `,
    dark: `
      --primary: oklch(0.75 0.17 60);
      --primary-foreground: oklch(0.205 0 0);
      --accent: oklch(0.35 0.15 60);
      --ring: oklch(0.55 0.17 60);
    `,
  },
  red: {
    light: `
      --primary: oklch(0.65 0.18 25);
      --primary-foreground: oklch(0.985 0 0);
      --accent: oklch(0.80 0.12 25);
      --ring: oklch(0.60 0.16 25);
    `,
    dark: `
      --primary: oklch(0.70 0.19 25);
      --primary-foreground: oklch(0.205 0 0);
      --accent: oklch(0.35 0.15 25);
      --ring: oklch(0.55 0.19 25);
    `,
  },
  neutral: {
    light: `
      --primary: oklch(0.25 0.01 0);
      --primary-foreground: oklch(0.985 0 0);
      --accent: oklch(0.80 0.01 0);
      --ring: oklch(0.40 0.01 0);
    `,
    dark: `
      --primary: oklch(0.85 0.01 0);
      --primary-foreground: oklch(0.205 0 0);
      --accent: oklch(0.35 0.01 0);
      --ring: oklch(0.65 0.01 0);
    `,
  },
};

export function ThemeColorManager() {
  const { settings } = useSettings();

  useEffect(() => {
    // Create or get the style element for theme variables
    let styleEl = document.getElementById("theme-color-variables");
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = "theme-color-variables";
      document.head.appendChild(styleEl);
    }

    // Set the CSS variables for the current theme color
    const themeVars = themeColorVariables[settings.themeColor];
    
    styleEl.textContent = `
      :root {
        ${themeVars.light}
      }
      
      .dark {
        ${themeVars.dark}
      }
    `;
  }, [settings.themeColor]);

  return null;
}
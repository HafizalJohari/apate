"use client";

import { Moon, Settings, Sun } from "lucide-react";
import { useState } from "react";
import React from "react";

import { ThemeColor, ThemeMode, DateFormat, TimeFormat, useSettings } from "@/lib/settings-context";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const themeColorOptions: Array<{ value: ThemeColor; label: string; color: string }> = [
  { value: "lime", label: "Lime", color: "bg-lime-500" },
  { value: "green", label: "Green", color: "bg-green-500" },
  { value: "blue", label: "Blue", color: "bg-blue-500" },
  { value: "violet", label: "Violet", color: "bg-violet-500" },
  { value: "orange", label: "Orange", color: "bg-orange-500" },
  { value: "red", label: "Red", color: "bg-red-500" },
  { value: "neutral", label: "Neutral", color: "bg-gray-500" },
];

const themeModeOptions: Array<{ value: ThemeMode; label: string; icon: React.ReactNode }> = [
  { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "System", icon: <Settings className="h-4 w-4" /> },
];

export function SettingsPanel() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Customize your appointment app experience
          </SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="appearance" className="mt-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Theme Color</h3>
              <div className="grid grid-cols-7 gap-2">
                {themeColorOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`h-8 rounded-md ${option.color} flex items-center justify-center ${
                      settings.themeColor === option.value
                        ? "ring-2 ring-primary ring-offset-2"
                        : ""
                    }`}
                    onClick={() => updateSettings({ themeColor: option.value })}
                    title={option.label}
                  >
                    <span className="sr-only">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Theme Mode</h3>
              <div className="grid grid-cols-3 gap-2">
                {themeModeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`p-2 rounded-md flex items-center justify-center gap-2 ${
                      settings.themeMode === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    onClick={() => updateSettings({ themeMode: option.value })}
                  >
                    {option.icon}
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Border Radius</h3>
              <Slider
                defaultValue={[settings.borderRadius]}
                min={0.5}
                max={2}
                step={0.1}
                onValueChange={(value) => updateSettings({ borderRadius: value[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtle</span>
                <span>Default</span>
                <span>Rounded</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Animations</Label>
                <div className="text-xs text-muted-foreground">
                  Enable animations and transitions
                </div>
              </div>
              <Switch
                id="animations"
                checked={settings.animations}
                onCheckedChange={(checked) => updateSettings({ animations: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="compact-view">Compact View</Label>
                <div className="text-xs text-muted-foreground">
                  Use a more compact layout
                </div>
              </div>
              <Switch
                id="compact-view"
                checked={settings.compactView}
                onCheckedChange={(checked) => updateSettings({ compactView: checked })}
              />
            </div>
          </TabsContent>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Date Format</h3>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
                    { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
                    { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
                  ] as Array<{ value: DateFormat; label: string }>
                ).map((option) => (
                  <button
                    key={option.value}
                    className={`p-2 rounded-md text-sm ${
                      settings.dateFormat === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    onClick={() => updateSettings({ dateFormat: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Time Format</h3>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { value: "12h", label: "12-hour (AM/PM)" },
                    { value: "24h", label: "24-hour" },
                  ] as Array<{ value: TimeFormat; label: string }>
                ).map((option) => (
                  <button
                    key={option.value}
                    className={`p-2 rounded-md text-sm ${
                      settings.timeFormat === option.value
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                    onClick={() => updateSettings({ timeFormat: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="show-weekends">Show Weekends</Label>
                <div className="text-xs text-muted-foreground">
                  Allow scheduling on weekends
                </div>
              </div>
              <Switch
                id="show-weekends"
                checked={settings.showWeekends}
                onCheckedChange={(checked) => updateSettings({ showWeekends: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Notifications</Label>
                <div className="text-xs text-muted-foreground">
                  Enable appointment notifications
                </div>
              </div>
              <Switch
                id="notifications"
                checked={settings.enableNotifications}
                onCheckedChange={(checked) => updateSettings({ enableNotifications: checked })}
              />
            </div>
          </TabsContent>
          
          {/* Accessibility Tab */}
          <TabsContent value="accessibility" className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Font Size</h3>
                <span className="text-sm text-muted-foreground">
                  {Math.round(settings.fontScale * 100)}%
                </span>
              </div>
              <Slider
                defaultValue={[settings.fontScale]}
                min={0.8}
                max={1.2}
                step={0.05}
                onValueChange={(value) => updateSettings({ fontScale: value[0] })}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smaller</span>
                <span>Default</span>
                <span>Larger</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="pt-4">
              <Card>
                <CardContent className="pt-6">
                  <Button 
                    variant="destructive" 
                    onClick={resetSettings}
                    className="w-full"
                  >
                    Reset to Defaults
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
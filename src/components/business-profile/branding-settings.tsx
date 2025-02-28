"use client";

import React, { useState, useEffect } from "react";
import { useBusinessProfile } from "@/lib/context/business-profile-context";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const BrandingSettings = () => {
  const { businessProfile, updateBusinessProfile } = useBusinessProfile();
  const [primaryColor, setPrimaryColor] = useState(businessProfile.branding?.primaryColor || "#10b981");
  const [secondaryColor, setSecondaryColor] = useState(businessProfile.branding?.secondaryColor || "#f59e0b");
  const [fontFamily, setFontFamily] = useState(businessProfile.branding?.fontFamily || "Inter");
  const [activeTab, setActiveTab] = useState("colors");
  
  // Update the branding in the business profile when colors or font change
  useEffect(() => {
    // Only update if the values are different from the current business profile
    if (
      primaryColor !== businessProfile.branding?.primaryColor ||
      secondaryColor !== businessProfile.branding?.secondaryColor ||
      fontFamily !== businessProfile.branding?.fontFamily
    ) {
      updateBusinessProfile({
        branding: {
          primaryColor,
          secondaryColor,
          fontFamily,
        },
      });
    }
  }, [primaryColor, secondaryColor, fontFamily, updateBusinessProfile, businessProfile.branding]);
  
  const fontOptions = [
    { value: "Inter", label: "Inter (Default)" },
    { value: "Roboto", label: "Roboto" },
    { value: "Poppins", label: "Poppins" },
    { value: "Montserrat", label: "Montserrat" },
    { value: "Open Sans", label: "Open Sans" },
    { value: "Lato", label: "Lato" },
    { value: "Playfair Display", label: "Playfair Display" },
    { value: "Merriweather", label: "Merriweather" },
  ];
  
  const handlePrimaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryColor(e.target.value);
  };
  
  const handleSecondaryColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSecondaryColor(e.target.value);
  };
  
  const handleFontFamilyChange = (value: string) => {
    setFontFamily(value);
  };
  
  // Predefined color palettes
  const colorPalettes = [
    { name: "Modern Green", primary: "#10b981", secondary: "#f59e0b" },
    { name: "Ocean Blue", primary: "#3b82f6", secondary: "#ec4899" },
    { name: "Elegant Purple", primary: "#8b5cf6", secondary: "#f43f5e" },
    { name: "Earthy Tones", primary: "#d97706", secondary: "#059669" },
    { name: "Monochrome", primary: "#111827", secondary: "#6b7280" },
    { name: "Vibrant Red", primary: "#ef4444", secondary: "#3b82f6" },
  ];
  
  const applyColorPalette = (primary: string, secondary: string) => {
    setPrimaryColor(primary);
    setSecondaryColor(secondary);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Branding Settings</h3>
              <p className="text-sm text-gray-500 mb-6">
                Customize the look and feel of your booking page to match your brand identity.
              </p>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="colors">Colors</TabsTrigger>
                <TabsTrigger value="typography">Typography</TabsTrigger>
              </TabsList>
              
              <TabsContent value="colors" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor" className="font-medium">
                      Primary Color
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: primaryColor }}
                      />
                      <Input
                        id="primaryColor"
                        type="color"
                        value={primaryColor}
                        onChange={handlePrimaryColorChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={primaryColor}
                        onChange={handlePrimaryColorChange}
                        className="w-32"
                        maxLength={7}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Used for primary buttons, links, and accents.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor" className="font-medium">
                      Secondary Color
                    </Label>
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-10 h-10 rounded-md border"
                        style={{ backgroundColor: secondaryColor }}
                      />
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={secondaryColor}
                        onChange={handleSecondaryColorChange}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={secondaryColor}
                        onChange={handleSecondaryColorChange}
                        className="w-32"
                        maxLength={7}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Used for secondary buttons, highlights, and accents.
                    </p>
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <h4 className="text-sm font-medium mb-4">Color Palettes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {colorPalettes.map((palette) => (
                      <div
                        key={palette.name}
                        className="border rounded-md p-3 cursor-pointer hover:border-gray-400 transition-colors"
                        onClick={() => applyColorPalette(palette.primary, palette.secondary)}
                      >
                        <h5 className="text-sm font-medium mb-2">{palette.name}</h5>
                        <div className="flex space-x-2">
                          <div
                            className="w-8 h-8 rounded-md"
                            style={{ backgroundColor: palette.primary }}
                          />
                          <div
                            className="w-8 h-8 rounded-md"
                            style={{ backgroundColor: palette.secondary }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <h4 className="text-sm font-medium mb-4">Preview</h4>
                  <div className="border rounded-md p-6 space-y-4">
                    <div className="flex space-x-4">
                      <button
                        className="px-4 py-2 rounded-md text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Primary Button
                      </button>
                      <button
                        className="px-4 py-2 rounded-md text-white"
                        style={{ backgroundColor: secondaryColor }}
                      >
                        Secondary Button
                      </button>
                    </div>
                    <div className="space-y-2">
                      <h5 className="font-medium">Sample Heading</h5>
                      <p className="text-sm">
                        This is a sample text with a{" "}
                        <a href="#" style={{ color: primaryColor }}>
                          primary color link
                        </a>{" "}
                        and a{" "}
                        <a href="#" style={{ color: secondaryColor }}>
                          secondary color link
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="typography" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fontFamily" className="font-medium">
                      Font Family
                    </Label>
                    <Select
                      value={fontFamily}
                      onValueChange={handleFontFamilyChange}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map((font) => (
                          <SelectItem
                            key={font.value}
                            value={font.value}
                            className={cn("font-normal", {
                              "font-inter": font.value === "Inter",
                              "font-roboto": font.value === "Roboto",
                              "font-poppins": font.value === "Poppins",
                              "font-montserrat": font.value === "Montserrat",
                              "font-opensans": font.value === "Open Sans",
                              "font-lato": font.value === "Lato",
                              "font-playfair": font.value === "Playfair Display",
                              "font-merriweather": font.value === "Merriweather",
                            })}
                          >
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="border-t pt-6 mt-6">
                  <h4 className="text-sm font-medium mb-4">Typography Preview</h4>
                  <div 
                    className="border rounded-md p-6 space-y-4"
                    style={{ fontFamily }}
                  >
                    <h1 className="text-2xl font-bold">Heading 1</h1>
                    <h2 className="text-xl font-bold">Heading 2</h2>
                    <h3 className="text-lg font-medium">Heading 3</h3>
                    <p className="text-base">
                      This is a paragraph with the selected font family. The quick brown fox jumps over the lazy dog.
                    </p>
                    <p className="text-sm">
                      This is smaller text with the selected font family. The quick brown fox jumps over the lazy dog.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
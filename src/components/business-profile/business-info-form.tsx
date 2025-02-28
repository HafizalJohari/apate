"use client";

import React, { useState } from "react";
import { useBusinessProfile } from "@/lib/context/business-profile-context";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const BusinessInfoForm = () => {
  const { businessProfile, updateBusinessProfile } = useBusinessProfile();
  const [logoPreview, setLogoPreview] = useState<string | null>(businessProfile.logo);
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setLogoPreview(result);
      updateBusinessProfile({ logo: result });
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemoveLogo = () => {
    setLogoPreview(null);
    updateBusinessProfile({ logo: null });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Logo Upload */}
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="logo" className="block mb-2">Business Logo</Label>
              <div className="flex items-center gap-4">
                <div 
                  className={cn(
                    "relative w-32 h-32 border-2 border-dashed rounded-md flex items-center justify-center overflow-hidden",
                    logoPreview ? "border-transparent" : "border-gray-300"
                  )}
                >
                  {logoPreview ? (
                    <>
                      <Image 
                        src={logoPreview} 
                        alt="Business Logo" 
                        fill 
                        className="object-cover"
                      />
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={handleRemoveLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <span className="mt-1 block text-xs text-gray-500">Upload Logo</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById("logo")?.click()}
                  >
                    Choose Image
                  </Button>
                  <p className="mt-2 text-xs text-gray-500">
                    Recommended: Square image, 512x512px or larger. Max 2MB.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Business Name */}
            <div>
              <Label htmlFor="name" className="block mb-2">Business Name *</Label>
              <Input
                id="name"
                value={businessProfile.name}
                onChange={(e) => updateBusinessProfile({ name: e.target.value })}
                placeholder="Enter your business name"
                required
              />
            </div>
            
            {/* Business Description */}
            <div className="col-span-1 md:col-span-2">
              <Label htmlFor="description" className="block mb-2">Business Description</Label>
              <Textarea
                id="description"
                value={businessProfile.description || ""}
                onChange={(e) => updateBusinessProfile({ description: e.target.value })}
                placeholder="Describe your business and services"
                rows={4}
              />
            </div>
            
            {/* Contact Information */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="block mb-2">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={businessProfile.contactInfo.email}
                    onChange={(e) => updateBusinessProfile({ 
                      contactInfo: { 
                        ...businessProfile.contactInfo, 
                        email: e.target.value 
                      } 
                    })}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="block mb-2">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={businessProfile.contactInfo.phone}
                    onChange={(e) => updateBusinessProfile({ 
                      contactInfo: { 
                        ...businessProfile.contactInfo, 
                        phone: e.target.value 
                      } 
                    })}
                    placeholder="(123) 456-7890"
                    required
                  />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="website" className="block mb-2">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={businessProfile.contactInfo.website || ""}
                    onChange={(e) => updateBusinessProfile({ 
                      contactInfo: { 
                        ...businessProfile.contactInfo, 
                        website: e.target.value 
                      } 
                    })}
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-medium mb-4">Business Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <Label htmlFor="street" className="block mb-2">Street Address *</Label>
                  <Input
                    id="street"
                    value={businessProfile.address.street}
                    onChange={(e) => updateBusinessProfile({ 
                      address: { 
                        ...businessProfile.address, 
                        street: e.target.value 
                      } 
                    })}
                    placeholder="123 Main St"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="city" className="block mb-2">City *</Label>
                  <Input
                    id="city"
                    value={businessProfile.address.city}
                    onChange={(e) => updateBusinessProfile({ 
                      address: { 
                        ...businessProfile.address, 
                        city: e.target.value 
                      } 
                    })}
                    placeholder="City"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="block mb-2">State/Province *</Label>
                  <Input
                    id="state"
                    value={businessProfile.address.state}
                    onChange={(e) => updateBusinessProfile({ 
                      address: { 
                        ...businessProfile.address, 
                        state: e.target.value 
                      } 
                    })}
                    placeholder="State"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode" className="block mb-2">Zip/Postal Code *</Label>
                  <Input
                    id="zipCode"
                    value={businessProfile.address.zipCode}
                    onChange={(e) => updateBusinessProfile({ 
                      address: { 
                        ...businessProfile.address, 
                        zipCode: e.target.value 
                      } 
                    })}
                    placeholder="12345"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country" className="block mb-2">Country *</Label>
                  <Input
                    id="country"
                    value={businessProfile.address.country}
                    onChange={(e) => updateBusinessProfile({ 
                      address: { 
                        ...businessProfile.address, 
                        country: e.target.value 
                      } 
                    })}
                    placeholder="Country"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
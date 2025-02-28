"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Undo2, Eye } from "lucide-react";
import { useBusinessProfile } from "@/lib/context/business-profile-context";
import { BusinessInfoForm } from "@/components/business-profile/business-info-form";
import { BusinessHoursEditor } from "@/components/business-profile/business-hours-editor";
import { LocationsManager } from "@/components/business-profile/locations-manager";
import { PoliciesEditor } from "@/components/business-profile/policies-editor";
import { BrandingSettings } from "@/components/business-profile/branding-settings";
import { ProfilePreview } from "@/components/business-profile/profile-preview";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function BusinessProfilePage() {
  const { 
    businessProfile, 
    isLoading, 
    isSaving, 
    saveBusinessProfile, 
    resetBusinessProfile,
    hasUnsavedChanges
  } = useBusinessProfile();
  const [activeTab, setActiveTab] = useState("basic-info");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSave = async () => {
    try {
      await saveBusinessProfile();
    } catch (error) {
      // Error is already handled in the context
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64" />
          <div className="space-x-2">
            <Skeleton className="h-10 w-24 inline-block" />
            <Skeleton className="h-10 w-24 inline-block" />
          </div>
        </div>
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Business Profile</h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setIsPreviewOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button 
            variant="outline" 
            onClick={resetBusinessProfile}
            disabled={!hasUnsavedChanges || isSaving}
          >
            <Undo2 className="mr-2 h-4 w-4" />
            Discard
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasUnsavedChanges || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Your Business Profile</CardTitle>
          <CardDescription>
            Set up your business information, hours, locations, and more to customize your booking experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              <TabsTrigger value="hours">Business Hours</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="policies">Policies</TabsTrigger>
              <TabsTrigger value="branding">Branding</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic-info" className="space-y-4">
              <BusinessInfoForm />
            </TabsContent>
            
            <TabsContent value="hours" className="space-y-4">
              <BusinessHoursEditor />
            </TabsContent>
            
            <TabsContent value="locations" className="space-y-4">
              <LocationsManager />
            </TabsContent>
            
            <TabsContent value="policies" className="space-y-4">
              <PoliciesEditor />
            </TabsContent>
            
            <TabsContent value="branding" className="space-y-4">
              <BrandingSettings />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Business Profile Preview</DialogTitle>
          </DialogHeader>
          <ProfilePreview />
        </DialogContent>
      </Dialog>
    </div>
  );
} 
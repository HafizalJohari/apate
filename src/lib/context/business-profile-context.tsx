"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { BusinessProfile, defaultBusinessProfile, businessProfileSchema } from "@/lib/types/business-profile";
import { toast } from "sonner";

interface BusinessProfileContextType {
  businessProfile: BusinessProfile;
  isLoading: boolean;
  isSaving: boolean;
  updateBusinessProfile: (updatedProfile: Partial<BusinessProfile>) => void;
  saveBusinessProfile: () => Promise<void>;
  resetBusinessProfile: () => void;
  hasUnsavedChanges: boolean;
}

const BusinessProfileContext = createContext<BusinessProfileContextType | undefined>(undefined);

export const useBusinessProfile = () => {
  const context = useContext(BusinessProfileContext);
  if (!context) {
    throw new Error("useBusinessProfile must be used within a BusinessProfileProvider");
  }
  return context;
};

interface BusinessProfileProviderProps {
  children: ReactNode;
}

export const BusinessProfileProvider = ({ children }: BusinessProfileProviderProps) => {
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(defaultBusinessProfile);
  const [originalProfile, setOriginalProfile] = useState<BusinessProfile>(defaultBusinessProfile);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load business profile from localStorage on mount
  useEffect(() => {
    const loadBusinessProfile = () => {
      try {
        const savedProfile = localStorage.getItem("businessProfile");
        if (savedProfile) {
          const parsedProfile = JSON.parse(savedProfile);
          // Validate the profile with zod schema
          const validatedProfile = businessProfileSchema.parse(parsedProfile);
          setBusinessProfile(validatedProfile);
          setOriginalProfile(validatedProfile);
        }
      } catch (error) {
        console.error("Error loading business profile:", error);
        toast.error("Failed to load business profile data");
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinessProfile();
  }, []);

  // Check for unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(JSON.stringify(businessProfile) !== JSON.stringify(originalProfile));
  }, [businessProfile, originalProfile]);

  const updateBusinessProfile = (updatedProfile: Partial<BusinessProfile>) => {
    setBusinessProfile((prev) => ({
      ...prev,
      ...updatedProfile,
    }));
  };

  const saveBusinessProfile = async () => {
    setIsSaving(true);
    try {
      // Validate the profile before saving
      const validatedProfile = businessProfileSchema.parse(businessProfile);
      
      // In a real app, you would send this to an API
      // For now, we'll just save to localStorage
      localStorage.setItem("businessProfile", JSON.stringify(validatedProfile));
      
      // Update the original profile to match the current one
      setOriginalProfile(validatedProfile);
      
      toast.success("Business profile saved successfully");
    } catch (error) {
      console.error("Error saving business profile:", error);
      toast.error("Failed to save business profile");
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const resetBusinessProfile = () => {
    setBusinessProfile(originalProfile);
    toast.info("Changes discarded");
  };

  return (
    <BusinessProfileContext.Provider
      value={{
        businessProfile,
        isLoading,
        isSaving,
        updateBusinessProfile,
        saveBusinessProfile,
        resetBusinessProfile,
        hasUnsavedChanges,
      }}
    >
      {children}
    </BusinessProfileContext.Provider>
  );
}; 
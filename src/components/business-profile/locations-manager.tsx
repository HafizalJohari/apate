"use client";

import React, { useState } from "react";
import { useBusinessProfile } from "@/lib/context/business-profile-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { Location, locationSchema } from "@/lib/types/business-profile";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { z } from "zod";

export const LocationsManager = () => {
  const { businessProfile, updateBusinessProfile } = useBusinessProfile();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<Omit<Location, "id">>({
    name: "",
    address: "",
    isDefault: false,
  });
  
  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      isDefault: false,
    });
    setFormErrors({});
  };
  
  const openAddDialog = () => {
    resetForm();
    setEditingLocation(null);
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (location: Location) => {
    setFormData({
      name: location.name,
      address: location.address,
      isDefault: location.isDefault,
    });
    setEditingLocation(location);
    setIsDialogOpen(true);
  };
  
  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };
  
  const validateForm = (): boolean => {
    try {
      // We're validating just the form fields, not the full location with ID
      const formSchema = locationSchema.omit({ id: true });
      formSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path[0] as string;
          newErrors[field] = err.message;
        });
        setFormErrors(newErrors);
      }
      return false;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };
  
  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    
    let updatedLocations: Location[];
    
    if (editingLocation) {
      // Update existing location
      updatedLocations = businessProfile.locations.map((loc) =>
        loc.id === editingLocation.id
          ? { ...loc, ...formData }
          : formData.isDefault && loc.id !== editingLocation.id
          ? { ...loc, isDefault: false }
          : loc
      );
      toast.success("Location updated successfully");
    } else {
      // Add new location
      const newLocation: Location = {
        id: uuidv4(),
        ...formData,
      };
      
      // If this is the first location or it's set as default, make sure it's the only default
      if (formData.isDefault || businessProfile.locations.length === 0) {
        updatedLocations = businessProfile.locations.map((loc) => ({
          ...loc,
          isDefault: false,
        }));
        newLocation.isDefault = true;
      } else {
        updatedLocations = [...businessProfile.locations];
      }
      
      updatedLocations.push(newLocation);
      toast.success("Location added successfully");
    }
    
    updateBusinessProfile({ locations: updatedLocations });
    closeDialog();
  };
  
  const handleDelete = (locationId: string) => {
    const locationToDelete = businessProfile.locations.find((loc) => loc.id === locationId);
    const isDefault = locationToDelete?.isDefault;
    
    const updatedLocations = businessProfile.locations.filter(
      (loc) => loc.id !== locationId
    );
    
    // If we deleted the default location and there are other locations, make the first one default
    if (isDefault && updatedLocations.length > 0) {
      updatedLocations[0].isDefault = true;
    }
    
    updateBusinessProfile({ locations: updatedLocations });
    toast.success("Location deleted successfully");
  };
  
  const handleSetDefault = (locationId: string) => {
    const updatedLocations = businessProfile.locations.map((loc) => ({
      ...loc,
      isDefault: loc.id === locationId,
    }));
    
    updateBusinessProfile({ locations: updatedLocations });
    toast.success("Default location updated");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">Business Locations</h3>
            <Button onClick={openAddDialog} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
          
          {businessProfile.locations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No locations added yet.</p>
              <p className="text-sm mt-2">
                Add your first business location to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {businessProfile.locations.map((location) => (
                <div
                  key={location.id}
                  className="border rounded-md p-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{location.name}</h4>
                      {location.isDefault && (
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{location.address}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 md:mt-0">
                    {!location.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(location.id)}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(location)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(location.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? "Edit Location" : "Add New Location"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Main Office, Downtown Branch, etc."
              />
              {formErrors.name && (
                <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Full address"
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isDefault"
                name="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isDefault: checked === true })
                }
              />
              <Label htmlFor="isDefault" className="text-sm font-normal">
                Set as default location
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeDialog}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editingLocation ? "Update" : "Add"} Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 
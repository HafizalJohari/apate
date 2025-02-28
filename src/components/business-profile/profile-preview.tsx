"use client";

import React from "react";
import { useBusinessProfile } from "@/lib/context/business-profile-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Globe, Clock } from "lucide-react";
import Image from "next/image";

export const ProfilePreview = () => {
  const { businessProfile } = useBusinessProfile();
  
  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  
  const formatTime = (time: string) => {
    const [hourStr, minuteStr] = time.split(":");
    const hour = parseInt(hourStr, 10);
    const minute = minuteStr;
    
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    
    return `${displayHour}:${minute} ${period}`;
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Customer View Preview</h3>
              <p className="text-sm text-gray-500 mb-6">
                This is how your business profile will appear to customers on your booking page.
              </p>
            </div>
            
            <div 
              className="border rounded-lg overflow-hidden"
              style={{ 
                fontFamily: businessProfile.branding?.fontFamily || "Inter",
              }}
            >
              {/* Header with logo and business name */}
              <div 
                className="p-6 text-white"
                style={{ backgroundColor: businessProfile.branding?.primaryColor || "#10b981" }}
              >
                <div className="flex items-center gap-4">
                  {businessProfile.logo ? (
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-white">
                      <Image 
                        src={businessProfile.logo} 
                        alt={businessProfile.name || "Business Logo"} 
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-2xl font-bold text-gray-500">
                      {businessProfile.name ? businessProfile.name.charAt(0) : "B"}
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl font-bold">{businessProfile.name || "Your Business Name"}</h2>
                    {businessProfile.description && (
                      <p className="mt-1 text-white/80">{businessProfile.description}</p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Contact and address information */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Contact Information</h3>
                  
                  {businessProfile.contactInfo?.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-gray-600">{businessProfile.contactInfo.phone}</p>
                      </div>
                    </div>
                  )}
                  
                  {businessProfile.contactInfo?.email && (
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600">{businessProfile.contactInfo.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {businessProfile.contactInfo?.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Website</p>
                        <p className="text-gray-600">{businessProfile.contactInfo.website}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Location</h3>
                  
                  {(businessProfile.address?.street || businessProfile.locations.length > 0) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                      <div>
                        {businessProfile.locations.length > 0 ? (
                          <div>
                            {businessProfile.locations.map((location) => (
                              <div key={location.id} className="mb-3">
                                <p className="font-medium">{location.name}</p>
                                <p className="text-gray-600">{location.address}</p>
                                {location.isDefault && (
                                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                    Main Location
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div>
                            <p className="font-medium">Address</p>
                            <p className="text-gray-600">
                              {businessProfile.address.street}, {businessProfile.address.city}, {businessProfile.address.state} {businessProfile.address.zipCode}, {businessProfile.address.country}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Business hours */}
              <div className="p-6 border-t">
                <h3 className="font-medium text-lg mb-4">Business Hours</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessProfile.businessHours
                    .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                    .map((hours) => (
                      <div key={hours.dayOfWeek} className="flex justify-between">
                        <div className="font-medium">{dayNames[hours.dayOfWeek]}</div>
                        <div>
                          {hours.isOpen ? (
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span>
                                {formatTime(hours.openTime)} - {formatTime(hours.closeTime)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-500">Closed</span>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              
              {/* Policies */}
              {(businessProfile.policies?.cancellation || businessProfile.policies?.refund || businessProfile.policies?.other) && (
                <div className="p-6 border-t">
                  <h3 className="font-medium text-lg mb-4">Policies</h3>
                  <div className="space-y-4">
                    {businessProfile.policies?.cancellation && (
                      <div>
                        <h4 className="font-medium">Cancellation Policy</h4>
                        <p className="text-gray-600 mt-1">{businessProfile.policies.cancellation}</p>
                      </div>
                    )}
                    
                    {businessProfile.policies?.refund && (
                      <div>
                        <h4 className="font-medium">Refund Policy</h4>
                        <p className="text-gray-600 mt-1">{businessProfile.policies.refund}</p>
                      </div>
                    )}
                    
                    {businessProfile.policies?.other && (
                      <div>
                        <h4 className="font-medium">Additional Policies</h4>
                        <p className="text-gray-600 mt-1">{businessProfile.policies.other}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Book now button */}
              <div className="p-6 border-t flex justify-center">
                <Button 
                  size="lg"
                  style={{ 
                    backgroundColor: businessProfile.branding?.primaryColor || "#10b981",
                    color: "white"
                  }}
                >
                  Book an Appointment
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
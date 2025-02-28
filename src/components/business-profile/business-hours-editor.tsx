"use client";

import React from "react";
import { useBusinessProfile } from "@/lib/context/business-profile-context";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessHours } from "@/lib/types/business-profile";

export const BusinessHoursEditor = () => {
  const { businessProfile, updateBusinessProfile } = useBusinessProfile();
  
  const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];
  
  const timeOptions = generateTimeOptions();
  
  const handleToggleDay = (dayOfWeek: number, isOpen: boolean) => {
    const updatedHours = businessProfile.businessHours.map(hour => 
      hour.dayOfWeek === dayOfWeek ? { ...hour, isOpen } : hour
    );
    
    updateBusinessProfile({ businessHours: updatedHours });
  };
  
  const handleTimeChange = (dayOfWeek: number, field: "openTime" | "closeTime", value: string) => {
    const updatedHours = businessProfile.businessHours.map(hour => 
      hour.dayOfWeek === dayOfWeek ? { ...hour, [field]: value } : hour
    );
    
    updateBusinessProfile({ businessHours: updatedHours });
  };
  
  const copyHoursToAllDays = (sourceDay: BusinessHours) => {
    const updatedHours = businessProfile.businessHours.map(hour => ({
      ...hour,
      isOpen: sourceDay.isOpen,
      openTime: sourceDay.openTime,
      closeTime: sourceDay.closeTime
    }));
    
    updateBusinessProfile({ businessHours: updatedHours });
  };
  
  const copyHoursToWeekdays = (sourceDay: BusinessHours) => {
    const updatedHours = businessProfile.businessHours.map(hour => 
      hour.dayOfWeek >= 1 && hour.dayOfWeek <= 5 
        ? { ...hour, isOpen: sourceDay.isOpen, openTime: sourceDay.openTime, closeTime: sourceDay.closeTime } 
        : hour
    );
    
    updateBusinessProfile({ businessHours: updatedHours });
  };
  
  const copyHoursToWeekends = (sourceDay: BusinessHours) => {
    const updatedHours = businessProfile.businessHours.map(hour => 
      hour.dayOfWeek === 0 || hour.dayOfWeek === 6 
        ? { ...hour, isOpen: sourceDay.isOpen, openTime: sourceDay.openTime, closeTime: sourceDay.closeTime } 
        : hour
    );
    
    updateBusinessProfile({ businessHours: updatedHours });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex flex-col space-y-4">
              {businessProfile.businessHours
                .sort((a, b) => a.dayOfWeek - b.dayOfWeek)
                .map((hours) => (
                  <div key={hours.dayOfWeek} className="grid grid-cols-12 items-center gap-4">
                    <div className="col-span-3">
                      <Label className="font-medium">{dayNames[hours.dayOfWeek]}</Label>
                    </div>
                    <div className="col-span-2 flex items-center space-x-2">
                      <Switch 
                        id={`day-${hours.dayOfWeek}`}
                        checked={hours.isOpen}
                        onCheckedChange={(checked) => handleToggleDay(hours.dayOfWeek, checked)}
                      />
                      <Label htmlFor={`day-${hours.dayOfWeek}`}>
                        {hours.isOpen ? "Open" : "Closed"}
                      </Label>
                    </div>
                    
                    {hours.isOpen ? (
                      <>
                        <div className="col-span-3">
                          <Select
                            value={hours.openTime}
                            onValueChange={(value) => handleTimeChange(hours.dayOfWeek, "openTime", value)}
                            disabled={!hours.isOpen}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Open Time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {formatTime(time)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-1 text-center">to</div>
                        <div className="col-span-3">
                          <Select
                            value={hours.closeTime}
                            onValueChange={(value) => handleTimeChange(hours.dayOfWeek, "closeTime", value)}
                            disabled={!hours.isOpen}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Close Time" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {formatTime(time)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-7 text-gray-500 italic">
                        Closed
                      </div>
                    )}
                  </div>
                ))}
            </div>
            
            <div className="border-t pt-4 mt-6">
              <h3 className="text-sm font-medium mb-2">Copy Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {businessProfile.businessHours.map((hours) => (
                  <div key={`copy-${hours.dayOfWeek}`} className="flex flex-col space-y-2">
                    <p className="text-sm font-medium">{dayNames[hours.dayOfWeek]}</p>
                    <div className="flex flex-col space-y-2">
                      <button
                        type="button"
                        onClick={() => copyHoursToAllDays(hours)}
                        className="text-xs text-blue-600 hover:text-blue-800 text-left"
                      >
                        Copy to all days
                      </button>
                      <button
                        type="button"
                        onClick={() => copyHoursToWeekdays(hours)}
                        className="text-xs text-blue-600 hover:text-blue-800 text-left"
                      >
                        Copy to weekdays
                      </button>
                      <button
                        type="button"
                        onClick={() => copyHoursToWeekends(hours)}
                        className="text-xs text-blue-600 hover:text-blue-800 text-left"
                      >
                        Copy to weekends
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper functions
function generateTimeOptions() {
  const options: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, "0");
      const formattedMinute = minute.toString().padStart(2, "0");
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return options;
}

function formatTime(time: string) {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  
  return `${displayHour}:${minute} ${period}`;
} 
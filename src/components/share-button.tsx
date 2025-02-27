"use client";

import { useState } from "react";
import { Share2, Check, Copy, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { type Appointment, generateShareUrl } from "@/lib/utils";

interface ShareButtonProps {
  appointment: Appointment;
  variant?: "icon" | "button";
  size?: "sm" | "default";
}

export function ShareButton({ 
  appointment, 
  variant = "button",
  size = "default" 
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = generateShareUrl(appointment);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Generate calendar links
  const encodeForCalendar = (text: string) => encodeURIComponent(text).replace(/%20/g, '+');
  
  const generateGoogleCalendarLink = () => {
    const startDate = new Date(appointment.date);
    // Parse time and set hours/minutes
    if (appointment.time) {
      const timeParts = appointment.time.replace(" AM", "").replace(" PM", "").split(":");
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1] || "0");
      const isPM = appointment.time.includes("PM");
      
      startDate.setHours(isPM && hours < 12 ? hours + 12 : hours);
      startDate.setMinutes(minutes);
    }
    
    // End date is 1 hour after start
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Appointment with ${appointment.name}`,
      dates: `${formatDateForCalendar(startDate)}/${formatDateForCalendar(endDate)}`,
      details: appointment.notes || `Appointment type: ${appointment.type}`,
      location: 'Online meeting',
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };
  
  const formatDateForCalendar = (date: Date) => {
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };
  
  const generateOutlookCalendarLink = () => {
    const startDate = new Date(appointment.date);
    // Parse time and set hours/minutes
    if (appointment.time) {
      const timeParts = appointment.time.replace(" AM", "").replace(" PM", "").split(":");
      const hours = parseInt(timeParts[0]);
      const minutes = parseInt(timeParts[1] || "0");
      const isPM = appointment.time.includes("PM");
      
      startDate.setHours(isPM && hours < 12 ? hours + 12 : hours);
      startDate.setMinutes(minutes);
    }
    
    // End date is 1 hour after start
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const params = new URLSearchParams({
      path: '/calendar/action/compose',
      rru: 'addevent',
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      subject: encodeForCalendar(`Appointment with ${appointment.name}`),
      body: encodeForCalendar(appointment.notes || `Appointment type: ${appointment.type}`),
      location: encodeForCalendar('Online meeting'),
    });
    
    return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {variant === "icon" ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
            <Share2 className="h-4 w-4" />
            <span className="sr-only">Share</span>
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size={size} 
            className="flex items-center gap-1"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Appointment</DialogTitle>
          <DialogDescription>
            Share this appointment link with your client or customer
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <Label htmlFor="share-link" className="mb-2 block text-sm font-medium">
              Appointment Link
            </Label>
            <div className="flex items-center mt-1">
              <Input
                id="share-link"
                value={shareUrl}
                readOnly
                className="pr-10 flex-1"
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCopy}
                className="ml-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">Copy</span>
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              When your client opens this link, they can confirm the appointment.
            </p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <Link className="h-4 w-4" />
              Add to Calendar
            </h4>
            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto flex-1"
                asChild
              >
                <a href={generateGoogleCalendarLink()} target="_blank" rel="noopener noreferrer">
                  Google Calendar
                </a>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full sm:w-auto flex-1"
                asChild
              >
                <a href={generateOutlookCalendarLink()} target="_blank" rel="noopener noreferrer">
                  Outlook Calendar
                </a>
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
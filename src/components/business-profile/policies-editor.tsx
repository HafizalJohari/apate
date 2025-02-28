"use client";

import React from "react";
import { useBusinessProfile } from "@/lib/context/business-profile-context";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const PoliciesEditor = () => {
  const { businessProfile, updateBusinessProfile } = useBusinessProfile();
  
  const handlePolicyChange = (field: keyof typeof businessProfile.policies, value: string) => {
    updateBusinessProfile({
      policies: {
        ...businessProfile.policies,
        [field]: value,
      },
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Business Policies</h3>
              <p className="text-sm text-gray-500 mb-6">
                Define your business policies to set clear expectations for your clients. These policies will be displayed during the booking process.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cancellation" className="font-medium">
                  Cancellation Policy
                </Label>
                <Textarea
                  id="cancellation"
                  value={businessProfile.policies?.cancellation || ""}
                  onChange={(e) => handlePolicyChange("cancellation", e.target.value)}
                  placeholder="Describe your cancellation policy (e.g., 24-hour notice required for cancellations)"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="refund" className="font-medium">
                  Refund Policy
                </Label>
                <Textarea
                  id="refund"
                  value={businessProfile.policies?.refund || ""}
                  onChange={(e) => handlePolicyChange("refund", e.target.value)}
                  placeholder="Describe your refund policy (e.g., Full refunds for cancellations with 24-hour notice)"
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="other" className="font-medium">
                  Other Policies
                </Label>
                <Textarea
                  id="other"
                  value={businessProfile.policies?.other || ""}
                  onChange={(e) => handlePolicyChange("other", e.target.value)}
                  placeholder="Any other policies or terms of service"
                  rows={4}
                />
              </div>
            </div>
            
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium mb-4">Policy Templates</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="cancellation">
                  <AccordionTrigger>Cancellation Policy Templates</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium text-sm mb-1">Standard Cancellation Policy</h4>
                        <p className="text-sm text-gray-600">
                          Cancellations must be made at least 24 hours before the scheduled appointment time. Late cancellations or no-shows may be subject to a cancellation fee equal to 50% of the service price.
                        </p>
                        <button
                          type="button"
                          onClick={() => handlePolicyChange("cancellation", "Cancellations must be made at least 24 hours before the scheduled appointment time. Late cancellations or no-shows may be subject to a cancellation fee equal to 50% of the service price.")}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Use this template
                        </button>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium text-sm mb-1">Strict Cancellation Policy</h4>
                        <p className="text-sm text-gray-600">
                          Cancellations must be made at least 48 hours before the scheduled appointment time. Late cancellations or no-shows will be charged the full service price.
                        </p>
                        <button
                          type="button"
                          onClick={() => handlePolicyChange("cancellation", "Cancellations must be made at least 48 hours before the scheduled appointment time. Late cancellations or no-shows will be charged the full service price.")}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Use this template
                        </button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="refund">
                  <AccordionTrigger>Refund Policy Templates</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium text-sm mb-1">Standard Refund Policy</h4>
                        <p className="text-sm text-gray-600">
                          Full refunds are provided for cancellations made at least 24 hours before the scheduled appointment. No refunds for late cancellations or no-shows.
                        </p>
                        <button
                          type="button"
                          onClick={() => handlePolicyChange("refund", "Full refunds are provided for cancellations made at least 24 hours before the scheduled appointment. No refunds for late cancellations or no-shows.")}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Use this template
                        </button>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium text-sm mb-1">Flexible Refund Policy</h4>
                        <p className="text-sm text-gray-600">
                          Full refunds are provided for cancellations made at least 24 hours before the scheduled appointment. 50% refund for cancellations made less than 24 hours in advance. No refunds for no-shows.
                        </p>
                        <button
                          type="button"
                          onClick={() => handlePolicyChange("refund", "Full refunds are provided for cancellations made at least 24 hours before the scheduled appointment. 50% refund for cancellations made less than 24 hours in advance. No refunds for no-shows.")}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Use this template
                        </button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="other">
                  <AccordionTrigger>Other Policy Templates</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium text-sm mb-1">Late Arrival Policy</h4>
                        <p className="text-sm text-gray-600">
                          Please arrive 5-10 minutes before your scheduled appointment time. If you arrive late, your session may be shortened to accommodate other scheduled appointments. The full service fee will still apply.
                        </p>
                        <button
                          type="button"
                          onClick={() => handlePolicyChange("other", "Please arrive 5-10 minutes before your scheduled appointment time. If you arrive late, your session may be shortened to accommodate other scheduled appointments. The full service fee will still apply.")}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Use this template
                        </button>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <h4 className="font-medium text-sm mb-1">Health & Safety Policy</h4>
                        <p className="text-sm text-gray-600">
                          If you are feeling unwell or experiencing any symptoms of illness, please reschedule your appointment. We reserve the right to reschedule appointments if clients appear to be unwell upon arrival.
                        </p>
                        <button
                          type="button"
                          onClick={() => handlePolicyChange("other", "If you are feeling unwell or experiencing any symptoms of illness, please reschedule your appointment. We reserve the right to reschedule appointments if clients appear to be unwell upon arrival.")}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2"
                        >
                          Use this template
                        </button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 
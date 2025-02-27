"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { CalendarCheck, Clock, Mail, Phone, User, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Appointment, appointmentStorage, extractAppointmentFromUrl } from "@/lib/utils";
import { useSettings } from "@/lib/settings-context";

export default function BookingPage() {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const router = useRouter();
  const { settings } = useSettings();

  useEffect(() => {
    const urlData = extractAppointmentFromUrl();
    
    if (!urlData || !urlData.isShared) {
      router.push("/");
      return;
    }
    
    const appointmentData = appointmentStorage.getAppointmentById(urlData.id);
    if (appointmentData) {
      setAppointment(appointmentData);
    }
    
    setLoading(false);
  }, [router]);

  // Function removed to fix lint error
  // If needed in the future, uncomment and use the following:
  /*
  const formatDate = (date: Date) => {
    switch (settings.dateFormat) {
      case "MM/DD/YYYY":
        return format(date, "MM/dd/yyyy");
      case "DD/MM/YYYY":
        return format(date, "dd/MM/yyyy");
      case "YYYY-MM-DD":
        return format(date, "yyyy-MM-dd");
      default:
        return format(date, "PP");
    }
  };
  */

  // Format time based on user settings
  const formatTime = (time: string) => {
    if (settings.timeFormat === "24h" && time.includes("AM")) {
      return time.replace(" AM", "");
    } else if (settings.timeFormat === "24h" && time.includes("PM")) {
      const [hour, minute] = time.replace(" PM", "").split(":");
      return `${parseInt(hour) + 12}:${minute}`;
    }
    return time;
  };

  const handleConfirm = () => {
    if (!clientName || !clientEmail) return;
    
    // In a real app, you would send this information to a server
    // For now, we'll just set the confirmed state
    setConfirmed(true);
    
    // You could also update the appointment with client information
    // and then save it back to localStorage
    // const updatedAppointments = appointmentStorage.getAppointments().map(app => 
    //   app.id === appointment?.id ? { ...app, clientName, clientEmail, clientPhone, confirmed: true } : app
    // );
    // appointmentStorage.saveAppointments(updatedAppointments);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <div className="text-center animate-pulse">
          <p className="text-muted-foreground">Loading appointment...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">Appointment Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">
              The appointment link you followed is invalid or has expired.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (confirmed) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md border-green-100 dark:border-green-900">
          <CardHeader className="text-center">
            <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-2" />
            <CardTitle className="text-xl">Appointment Confirmed!</CardTitle>
            <CardDescription>
              Your appointment has been successfully booked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(appointment.date, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{formatTime(appointment.time)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{clientName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{clientEmail}</span>
              </div>
              {clientPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{clientPhone}</span>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground text-center">
              A confirmation has been sent to your email address.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/")}>Return to Home</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-center">Confirm Appointment</CardTitle>
            <CardDescription className="text-center">
              You have been invited to confirm this appointment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="mb-2">
                <h3 className="font-medium">Appointment Details</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(appointment.date, "EEEE, MMMM d, yyyy")}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime(appointment.time)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-sm text-muted-foreground">Type</div>
                <div className="font-medium">
                  {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                </div>
              </div>
              {appointment.notes && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <div className="text-sm text-muted-foreground">Notes</div>
                    <p className="text-sm mt-1">{appointment.notes}</p>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Your Information</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/")}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!clientName || !clientEmail}
              className="bg-lime-600 hover:bg-lime-700 dark:bg-lime-700 dark:hover:bg-lime-600"
            >
              Confirm Appointment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
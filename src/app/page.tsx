"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppointmentForm } from "@/components/appointment-form";
import { AppointmentList } from "@/components/appointment-list";
import { type AppointmentFormValues } from "@/lib/schema";
import { type Appointment, appointmentStorage } from "@/lib/utils";

type ViewState = "list" | "create" | "edit";

export default function Home() {
  // Router removed to fix lint error - add back if navigation between pages is needed
  // const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeView, setActiveView] = useState<ViewState>("list");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Load appointments from storage on component mount
  useEffect(() => {
    const storedAppointments = appointmentStorage.getAppointments();
    setAppointments(storedAppointments);
  }, []);

  // Save appointments to storage whenever they change
  useEffect(() => {
    if (appointments.length > 0) {
      appointmentStorage.saveAppointments(appointments);
    }
  }, [appointments]);

  const handleCreateAppointment = (data: AppointmentFormValues) => {
    const newAppointment: Appointment = {
      id: uuidv4(),
      ...data,
    };
    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    setActiveView("list");
  };

  const handleUpdateAppointment = (data: AppointmentFormValues, id?: string) => {
    if (!id) return;
    
    const updatedAppointments = appointments.map((app) => 
      app.id === id ? { ...app, ...data } : app
    );
    
    setAppointments(updatedAppointments);
    setActiveView("list");
    setSelectedAppointment(null);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setActiveView("edit");
  };

  const handleDeleteAppointment = (id: string) => {
    const updatedAppointments = appointments.filter((app) => app.id !== id);
    setAppointments(updatedAppointments);
  };

  const handleCancelEdit = () => {
    setActiveView("list");
    setSelectedAppointment(null);
  };

  const getViewTitle = () => {
    switch (activeView) {
      case "create":
        return "Book an Appointment";
      case "edit":
        return "Edit Appointment";
      case "list":
      default:
        return "Your Appointments";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Appointments</h1>
        
        <div className="flex gap-2">
          <Button
            variant={activeView === "list" ? "default" : "outline"}
            onClick={() => {
              setActiveView("list");
              setSelectedAppointment(null);
            }}
            size="sm"
          >
            View ({appointments.length})
          </Button>
          <Button
            variant={activeView === "create" ? "default" : "outline"}
            onClick={() => {
              setActiveView("create");
              setSelectedAppointment(null);
            }}
            size="sm"
          >
            Book New
          </Button>
        </div>
      </div>

      <main className="flex-1">
        <Card className="border-lime-100 dark:border-lime-950 shadow-md">
          <CardHeader className="pb-3 border-b border-lime-100 dark:border-lime-950">
            <CardTitle className="text-xl font-semibold text-lime-800 dark:text-lime-300">
              {getViewTitle()}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {activeView === "create" ? (
              <AppointmentForm 
                onSubmit={handleCreateAppointment} 
                onCancel={handleCancelEdit}
              />
            ) : activeView === "edit" ? (
              <AppointmentForm 
                appointment={selectedAppointment} 
                onSubmit={handleUpdateAppointment}
                onCancel={handleCancelEdit}
              />
            ) : (
              <AppointmentList 
                appointments={appointments} 
                onEdit={handleEditAppointment}
                onDelete={handleDeleteAppointment}
              />
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="mt-12 text-center">
        <Separator className="mb-4" />
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Apate - Simple Appointment Manager
        </p>
      </footer>
    </div>
  );
}

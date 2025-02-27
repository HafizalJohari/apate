"use client";

import { format } from "date-fns";
import { CalendarCheck, Clock, Edit, Mail, MoreHorizontal, Share2, Trash, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Appointment, getAppointmentTypes } from "@/lib/utils";
import { useState } from "react";
import { useSettings } from "@/lib/settings-context";
import { ShareButton } from "@/components/share-button";

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export function AppointmentList({ appointments, onEdit, onDelete }: AppointmentListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const { settings } = useSettings();

  // Date formatting function based on user settings
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

  // Time formatting based on user settings
  const formatTime = (time: string) => {
    if (settings.timeFormat === "24h" && time.includes("AM")) {
      return time.replace(" AM", "");
    } else if (settings.timeFormat === "24h" && time.includes("PM")) {
      const [hour, minute] = time.replace(" PM", "").split(":");
      return `${parseInt(hour) + 12}:${minute}`;
    }
    return time;
  };

  const handleDeleteClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedAppointment) {
      onDelete(selectedAppointment.id);
      setDeleteDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  if (appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted/50 rounded-lg">
        <p className="text-muted-foreground">No appointments scheduled yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="hover:border-lime-300 dark:hover:border-lime-800 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {format(appointment.date, "EEEE, MMMM d, yyyy")} at{" "}
                  {formatTime(appointment.time)}
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(appointment)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      const shareButton = document.querySelector(`#share-btn-${appointment.id}`);
                      if (shareButton) {
                        (shareButton as HTMLButtonElement).click();
                      }
                    }}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDeleteClick(appointment)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <CardDescription>
                  Appointment #{appointment.id.substring(0, 4)}
                </CardDescription>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    getAppointmentTypes().find((t: { id: string; label: string; duration: number; color: string }) => t.id === appointment.type)?.color || 
                    'bg-lime-100 text-lime-800 dark:bg-lime-950 dark:text-lime-300'
                  }`}>
                    {getAppointmentTypes().find((t: { id: string; label: string; duration: number; color: string }) => t.id === appointment.type)?.label || 
                     appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                  </span>
                  <div id={`share-btn-${appointment.id}`}>
                    <ShareButton appointment={appointment} variant="icon" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{appointment.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  <span>{formatDate(appointment.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{formatTime(appointment.time)}</span>
                </div>
                {appointment.notes && (
                  <>
                    <Separator className="my-2" />
                    <div>
                      <p className="text-sm font-medium">Notes:</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {appointment.notes}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
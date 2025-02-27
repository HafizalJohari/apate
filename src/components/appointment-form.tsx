"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { appointmentSchema, type AppointmentFormValues } from "@/lib/schema";
import { 
  type Appointment, 
  getTimeSlots, 
  getAppointmentTypes 
} from "@/lib/utils";
import { useSettings } from "@/lib/settings-context";

interface AppointmentFormProps {
  appointment?: Appointment | null;
  onSubmit: (data: AppointmentFormValues, id?: string) => void;
  onCancel?: () => void;
}

export function AppointmentForm({ 
  appointment, 
  onSubmit, 
  onCancel 
}: AppointmentFormProps) {
  const [date, setDate] = useState<Date | undefined>(appointment?.date);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const isEditing = Boolean(appointment);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: appointment?.name || "",
      email: appointment?.email || "",
      time: appointment?.time || "",
      date: appointment?.date,
      type: appointment?.type || "consultation",
      notes: appointment?.notes || "",
    },
  });

  // Ensure date is properly set in the form when editing
  useEffect(() => {
    if (appointment?.date) {
      setDate(appointment.date);
    }
  }, [appointment]);

  const handleSubmit = (data: AppointmentFormValues) => {
    onSubmit(data, appointment?.id);
  };
  
  // Access settings context to apply formatting and weekend preferences
  const { settings } = useSettings();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <DialogTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Select a date"}
                    </Button>
                  </FormControl>
                </DialogTrigger>
                <DialogContent className="p-0">
                  <DialogHeader>
                    <DialogTitle className="p-4">Choose a date</DialogTitle>
                  </DialogHeader>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      field.onChange(date);
                      setIsCalendarOpen(false);
                    }}
                    disabled={(date) => {
                      // Disable past dates and weekends (unless weekends are enabled in settings), 
                      // but allow the existing date when editing
                      if (isEditing && appointment?.date && 
                          date.toDateString() === appointment.date.toDateString()) {
                        return false;
                      }
                      const now = new Date();
                      now.setHours(0, 0, 0, 0);
                      const day = date.getDay();
                      const isWeekend = day === 0 || day === 6;
                      
                      return date < now || (isWeekend && !settings.showWeekends);
                    }}
                    initialFocus
                  />
                </DialogContent>
              </Dialog>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getTimeSlots().map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Appointment Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select appointment type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {getAppointmentTypes().map((type: { id: string; label: string }) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Any additional information..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button 
            type="submit" 
            className="flex-1 bg-lime-600 hover:bg-lime-700 dark:bg-lime-700 dark:hover:bg-lime-600"
          >
            {isEditing ? "Update Appointment" : "Book Appointment"}
          </Button>
          
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel} 
              className="flex-1 border-lime-200 hover:border-lime-300 hover:bg-lime-50 dark:border-lime-800 dark:hover:border-lime-700 dark:hover:bg-lime-950"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
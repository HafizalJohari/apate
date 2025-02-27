import { z } from 'zod';
import { appointmentTypeIds } from '@/lib/utils';

// Create a dynamic enum based on the appointment type IDs
export const createAppointmentSchema = () => {
  return z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    date: z.date({ required_error: 'Please select a date' }),
    time: z.string().min(1, { message: 'Please select a time' }),
    type: z.enum(appointmentTypeIds as [string, ...string[]], {
      required_error: 'Please select an appointment type',
    }),
    notes: z.string().optional(),
  });
};

// Create the schema with the current appointment types
export const appointmentSchema = createAppointmentSchema();

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

// Availability settings schema
export const availabilitySettingsSchema = z.object({
  workDays: z.array(z.number().min(0).max(6)),
  workHours: z.object({
    start: z.string(),
    end: z.string(),
  }),
  appointmentDuration: z.number().min(5).max(240),
  bufferTime: z.number().min(0).max(60),
  maxDaysInAdvance: z.number().min(1).max(365),
  timeSlotInterval: z.number().min(5).max(60),
});

export type AvailabilitySettings = z.infer<typeof availabilitySettingsSchema>;

// Appointment type schema
export const appointmentTypeSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  duration: z.number().min(5).max(240),
  color: z.string(),
});

export const appointmentTypesSchema = z.array(appointmentTypeSchema);

export type AppointmentTypeSettings = z.infer<typeof appointmentTypeSchema>;
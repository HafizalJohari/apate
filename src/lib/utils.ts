import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Default time slots (will be customizable)
export const defaultTimeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

// Get time slots from storage or use defaults
export const getTimeSlots = (): string[] => {
  if (typeof window === 'undefined') return defaultTimeSlots;
  
  const stored = localStorage.getItem('apate-timeslots');
  if (!stored) return defaultTimeSlots;
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse time slots from storage:', error);
    return defaultTimeSlots;
  }
};

// Save time slots to storage
export const saveTimeSlots = (slots: string[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('apate-timeslots', JSON.stringify(slots));
};

// Get time slots for the current usage
export const timeSlots = typeof window !== 'undefined' ? getTimeSlots() : defaultTimeSlots;

// Default appointment types (will be customizable)
export const defaultAppointmentTypes = [
  { id: 'consultation', label: 'Consultation', duration: 60, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { id: 'follow-up', label: 'Follow-up', duration: 30, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { id: 'routine', label: 'Routine Checkup', duration: 45, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' }
];

// Get appointment types from storage or use defaults
export const getAppointmentTypes = () => {
  if (typeof window === 'undefined') return defaultAppointmentTypes;
  
  const stored = localStorage.getItem('apate-appointment-types');
  if (!stored) return defaultAppointmentTypes;
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse appointment types from storage:', error);
    return defaultAppointmentTypes;
  }
};

// Save appointment types to storage
export const saveAppointmentTypes = (types: typeof defaultAppointmentTypes): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('apate-appointment-types', JSON.stringify(types));
};

// Get appointment types for current usage
export const appointmentTypes = typeof window !== 'undefined' ? getAppointmentTypes() : defaultAppointmentTypes;

// Get appointment type ids for validation
export const appointmentTypeIds = appointmentTypes.map((type: { id: string; label: string; duration: number; color: string }) => type.id);

// Default availability settings
export const defaultAvailabilitySettings = {
  workDays: [1, 2, 3, 4, 5], // Monday to Friday
  workHours: {
    start: '09:00',
    end: '17:00',
  },
  appointmentDuration: 60, // minutes
  bufferTime: 15, // minutes
  maxDaysInAdvance: 60, // days
  timeSlotInterval: 30, // minutes
};

// Get availability settings from storage or use defaults
export const getAvailabilitySettings = () => {
  if (typeof window === 'undefined') return defaultAvailabilitySettings;
  
  const stored = localStorage.getItem('apate-availability-settings');
  if (!stored) return defaultAvailabilitySettings;
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to parse availability settings from storage:', error);
    return defaultAvailabilitySettings;
  }
};

// Save availability settings to storage
export const saveAvailabilitySettings = (settings: typeof defaultAvailabilitySettings): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('apate-availability-settings', JSON.stringify(settings));
};

export type AppointmentType = typeof appointmentTypes[number]['id'];

export type Appointment = {
  id: string;
  name: string;
  email: string;
  date: Date;
  time: string;
  type: AppointmentType;
  notes?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  confirmed?: boolean;
};

// Mock data - in a real app this would come from a database
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    date: new Date('2025-03-15'),
    time: '9:00 AM',
    type: 'consultation',
    notes: 'First visit'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    date: new Date('2025-03-16'),
    time: '2:00 PM',
    type: 'follow-up'
  }
];

// Storage utility to persist appointments (using localStorage)
export const appointmentStorage = {
  getAppointments: (): Appointment[] => {
    if (typeof window === 'undefined') return mockAppointments;
    
    const stored = localStorage.getItem('appointments');
    if (!stored) {
      localStorage.setItem('appointments', JSON.stringify(mockAppointments));
      return mockAppointments;
    }
    
    try {
      return JSON.parse(stored).map((app: Omit<Appointment, 'date'> & { date: string }) => ({
        ...app,
        date: new Date(app.date)
      }));
    } catch (error) {
      console.error('Failed to parse appointments from storage:', error);
      return mockAppointments;
    }
  },
  
  saveAppointments: (appointments: Appointment[]): void => {
    if (typeof window === 'undefined') return;
    
    localStorage.setItem('appointments', JSON.stringify(appointments));
  },

  // Get a single appointment by ID
  getAppointmentById: (id: string): Appointment | null => {
    if (typeof window === 'undefined') {
      const mockAppointment = mockAppointments.find(app => app.id === id);
      return mockAppointment || null;
    }
    
    const appointments = appointmentStorage.getAppointments();
    return appointments.find(app => app.id === id) || null;
  }
};

// Generate a share URL for an appointment
export const generateShareUrl = (appointment: Appointment): string => {
  if (typeof window === 'undefined') return '';
  
  const baseUrl = window.location.origin;
  const params = new URLSearchParams();
  
  params.append('id', appointment.id);
  params.append('share', 'true');
  
  return `${baseUrl}/book?${params.toString()}`;
};

// Extract appointment details from a URL
export const extractAppointmentFromUrl = (): { id: string; isShared: boolean } | null => {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const isShared = params.get('share') === 'true';
  
  if (!id) return null;
  
  return { id, isShared };
};
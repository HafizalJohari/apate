import { z } from "zod";

// Day of week type (0 = Sunday, 6 = Saturday)
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Business hours schema
export const businessHoursSchema = z.object({
  dayOfWeek: z.number().min(0).max(6),
  isOpen: z.boolean(),
  openTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  closeTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
});

export type BusinessHours = z.infer<typeof businessHoursSchema>;

// Location schema
export const locationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Location name is required"),
  address: z.string().min(1, "Address is required"),
  isDefault: z.boolean().default(false),
});

export type Location = z.infer<typeof locationSchema>;

// Contact info schema
export const contactInfoSchema = z.object({
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string()
    .transform(val => {
      // If empty string, return empty string
      if (!val) return "";
      
      // If it doesn't start with http:// or https://, add https://
      if (!/^https?:\/\//i.test(val)) {
        return `https://${val}`;
      }
      return val;
    })
    .refine(val => {
      // Allow empty string
      if (!val) return true;
      
      // Check if it's a valid URL
      try {
        new URL(val);
        return true;
      } catch {
        return false;
      }
    }, "Invalid website URL")
    .optional(),
});

export type ContactInfo = z.infer<typeof contactInfoSchema>;

// Address schema
export const addressSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  country: z.string().min(1, "Country is required"),
});

export type Address = z.infer<typeof addressSchema>;

// Policies schema
export const policiesSchema = z.object({
  cancellation: z.string().optional(),
  refund: z.string().optional(),
  other: z.string().optional(),
});

export type Policies = z.infer<typeof policiesSchema>;

// Branding schema
export const brandingSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid color format"),
  fontFamily: z.string().default("Inter"),
});

export type Branding = z.infer<typeof brandingSchema>;

// Complete business profile schema
export const businessProfileSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  description: z.string().optional(),
  logo: z.string().nullable(),
  contactInfo: contactInfoSchema,
  address: addressSchema,
  businessHours: z.array(businessHoursSchema),
  locations: z.array(locationSchema).optional().default([]),
  policies: policiesSchema.optional().default({}),
  branding: brandingSchema.optional().default({
    primaryColor: "#10b981",
    secondaryColor: "#f59e0b",
    fontFamily: "Inter",
  }),
});

export type BusinessProfile = z.infer<typeof businessProfileSchema>;

// Default business hours (Mon-Fri, 9AM-5PM)
export const defaultBusinessHours: BusinessHours[] = [
  { dayOfWeek: 0, isOpen: false, openTime: "09:00", closeTime: "17:00" }, // Sunday
  { dayOfWeek: 1, isOpen: true, openTime: "09:00", closeTime: "17:00" },  // Monday
  { dayOfWeek: 2, isOpen: true, openTime: "09:00", closeTime: "17:00" },  // Tuesday
  { dayOfWeek: 3, isOpen: true, openTime: "09:00", closeTime: "17:00" },  // Wednesday
  { dayOfWeek: 4, isOpen: true, openTime: "09:00", closeTime: "17:00" },  // Thursday
  { dayOfWeek: 5, isOpen: true, openTime: "09:00", closeTime: "17:00" },  // Friday
  { dayOfWeek: 6, isOpen: false, openTime: "09:00", closeTime: "17:00" }, // Saturday
];

// Default business profile
export const defaultBusinessProfile: BusinessProfile = {
  name: "",
  description: "",
  logo: null,
  contactInfo: {
    email: "",
    phone: "",
    website: "",
  },
  address: {
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  },
  businessHours: defaultBusinessHours,
  locations: [],
  policies: {
    cancellation: "",
    refund: "",
    other: "",
  },
  branding: {
    primaryColor: "#10b981",
    secondaryColor: "#f59e0b",
    fontFamily: "Inter",
  },
}; 
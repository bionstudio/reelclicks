import { z } from "zod";

export const BUDGET_RANGES = [
  "Under ₹25,000",
  "₹25,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000 – ₹2,50,000",
  "Above ₹2,50,000",
  "Not sure yet",
] as const;

export const SERVICE_OPTIONS = [
  "Professional Wedding Shoots",
  "Wedding Cinematic Reels",
  "Brand & Promotional Shoots",
  "Corporate & Business Shoots",
  "Business Meeting Shoots",
  "Event Shoots & Coverage",
  "Travel & Lifestyle Reels",
  "Creative Social Media Content",
  "Something else",
] as const;

/** Shared by the form (client) and the API route (server). */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(80, "That name looks too long"),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s()-]/g, ""))
    .pipe(z.string().regex(/^(\+?91)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number")),
  email: z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address")),
  service: z.enum(SERVICE_OPTIONS, { error: "Choose the service you need" }),
  date: z
    .string()
    .trim()
    .max(20)
    .optional()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Enter a valid date"),
  location: z.string().trim().min(2, "Where will the shoot take place?").max(120),
  budget: z.union([z.enum(BUDGET_RANGES), z.literal("")]).optional(),
  message: z.string().trim().min(20, "Tell us a little more (at least 20 characters)").max(3000, "Please keep it under 3000 characters"),
  // ── spam protection ──
  company: z.string().max(0).optional(), // honeypot: must stay empty
  startedAt: z.number().int().optional(), // time-trap: form must be open for a few seconds
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;

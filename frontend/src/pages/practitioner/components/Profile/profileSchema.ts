import { z } from "zod";

const timeSlotSchema = z.object({
  start: z.string(),
  end: z.string(),
});

const dayScheduleSchema = z.object({
  day: z.string(),
  enabled: z.boolean(),
  slots: z.array(timeSlotSchema),
});

const consultationTypeSchema = z.object({
  enabled: z.boolean(),
  price: z.coerce.number({ message: "Price must be a valid number" }).nonnegative("Price cannot be negative"),
});

export const practitionerProfileSchema = z.object({
  fullName: z.string().optional(), // Kept from original
  specialization: z.string().min(1, "Specialization is required"),
  location: z.string().min(1, "Location is required"),
  practicingSinceEC: z.coerce
  .number({ message: "Practicing Since (EC) must be a valid number" })
  .int("Must be a whole year")
  .min(1900, "Year must be realistic and have correct format")
  .max(new Date().getFullYear(), "Year cannot be in the future"),
  consultationTypes: z.object({
    chat: consultationTypeSchema,
    audio: consultationTypeSchema,
    video: consultationTypeSchema,
  }),
  conditionsTreated: z.array(z.string()).default([]),
  availability: z.array(dayScheduleSchema).optional(),
  bio: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof practitionerProfileSchema>;

export const defaultAvailability: ProfileFormValues['availability'] = [
  { day: "Monday", enabled: false, slots: [] },
  { day: "Tuesday", enabled: false, slots: [] },
  { day: "Wednesday", enabled: false, slots: [] },
  { day: "Thursday", enabled: false, slots: [] },
  { day: "Friday", enabled: false, slots: [] },
  { day: "Saturday", enabled: false, slots: [] },
  { day: "Sunday", enabled: false, slots: [] },
];

export const defaultValuesObj: Partial<ProfileFormValues> = {
  specialization: "clinical_herbalist",
  // customSpecialization: "",
  // practicingSinceEC: 2008,
  // location: "Addis Ababa, Bole District",
  bio: "As a 12-year practitioner in clinical herbalism, my work focuses on integrating the rich botanical heritage of the Ethiopian Highlands with modern clinical practices.",
  consultationTypes: {
    chat: { enabled: true, price: 450 },
    audio: { enabled: true, price: 850 },
    video: { enabled: true, price: 1200 },
  },
  availability: defaultAvailability,
};

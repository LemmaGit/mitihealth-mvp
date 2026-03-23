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
  price: z.coerce.number({ message: "Price must be a valid number" }).nonnegative(),
});

export const PractitionerProfileSchemaZod = z.object({
  specialization: z.string().min(1, "Specialization is required"),
  location: z.string().min(1, "Location is required"),
  practicingSinceEC: z.coerce.number({ message: "Practicing Since (EC) must be a valid number" }).int().positive().max(new Date().getFullYear(), "Year cannot be in the future"),
  consultationTypes: z.object({
    chat: consultationTypeSchema,
    audio: consultationTypeSchema,
    video: consultationTypeSchema,
  }),
  conditionsTreated: z.array(z.string().min(1)).optional(),
  availability: z.array(dayScheduleSchema).optional(),
  bio: z.string().optional(),
});

export const AdminVerificationStatusSchemaZod = z.enum([
  "pending",
  "approved",
  "rejected",
]);

export const AdminVerifyPractitionerSchemaZod = z.object({
  status: AdminVerificationStatusSchemaZod,
});

export const PractitionerUpdateAvailabilitySchemaZod = z
  .object({
    consultationTypes: z.object({
      chat: consultationTypeSchema,
      audio: consultationTypeSchema,
      video: consultationTypeSchema,
    }).optional(),
    availability: z.array(dayScheduleSchema).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });


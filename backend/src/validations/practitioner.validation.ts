import { z } from "zod";

const availabilitySchema = z.record(
  z.string().min(1),
  z.array(z.string().min(1)),
);

export const PractitionerProfileSchemaZod = z.object({
  specialization: z.string().min(1),
  location: z.string().min(1),
  consultationFee: z.coerce.number().nonnegative(),
  experienceYears: z.coerce.number().int().nonnegative().optional(),
  conditionsTreated: z.array(z.string().min(1)).optional(),
  availability: availabilitySchema.optional(),
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
    consultationFee: z.coerce.number().nonnegative().optional(),
    availability: availabilitySchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });


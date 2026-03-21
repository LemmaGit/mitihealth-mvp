import { z } from "zod";

export const ConsultationCreateSchemaZod = z.object({
  practitionerId: z.string().min(1),

  // Expect ISO string from frontend; coerce to Date for mongoose.
  consultationDate: z.coerce.date(),
  consultationTime: z.string().min(1).optional(),

  consultationType: z.enum(["chat", "audio", "video"]),
  // Controllers/services generate jitsiRoom and set status="booked".
});

export type ConsultationCreateZ = z.infer<typeof ConsultationCreateSchemaZod>;


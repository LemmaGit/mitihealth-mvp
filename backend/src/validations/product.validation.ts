import { z } from "zod";

// const VerificationStatus = z.enum(["pending", "approved", "rejected"]);

export const ProductSchemaZod = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  ingredients: z.array(z.string().min(1)).optional().default([]),
  usageInstructions: z.array(z.string().min(1)).optional().default([]),
  price: z.number().nonnegative(),
  inventory: z.number().int().nonnegative().optional().default(0),
  imageUrls: z.array(z.url().min(1)),
  // verificationStatus: VerificationStatus.optional().default("pending"),
});

export type ProductZ = z.infer<typeof ProductSchemaZod>;

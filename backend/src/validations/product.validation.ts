import { z } from "zod";
import { AdminVerificationStatusSchemaZod } from "./practitioner.validation";

// Multipart/form-data sends all fields as strings; parse JSON strings into arrays.
const parseArray = (val: unknown): unknown => {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      return Array.isArray(parsed) ? parsed : val;
    } catch {
      return val;
    }
  }
  return val;
};

const imageUrlsSchema = z.preprocess(
  parseArray,
  z.array(z.string().url().min(1)).min(1, "At least one image is required"),
);

const imageUrlsOptionalSchema = z.preprocess(
  parseArray,
  z.array(z.string()).optional(),
);

export const ProductCreateSchemaZod = z.object({
  name: z.string().min(1),
  description: z.string(),
  ingredients: z.preprocess(parseArray, z.array(z.string().min(1)).default([])),
  usageInstructions: z.preprocess(parseArray, z.array(z.string().min(1)).default([])),
  // Multipart/form-data fields arrive as strings, so coerce to numbers.
  price: z.coerce.number().nonnegative(),
  inventory: z.coerce.number().int().nonnegative().default(0),
  imageUrls: imageUrlsSchema,
  // Suppliers cannot set verificationStatus (admin-only). Intentionally omitted.
});

export const ProductUpdateSchemaZod = z
  .object({
    name: z.string().min(1),
    description: z.string(),
    ingredients: z.preprocess(parseArray, z.array(z.string().min(1))),
    usageInstructions: z.preprocess(parseArray, z.array(z.string().min(1))),
    price: z.coerce.number().nonnegative(),
    inventory: z.coerce.number().int().nonnegative(),
    imageUrls: imageUrlsOptionalSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const ProductVerificationSchemaZod = z.object({
  status: AdminVerificationStatusSchemaZod,
});

export type ProductCreateZ = z.infer<typeof ProductCreateSchemaZod>;
export type ProductUpdateZ = z.infer<typeof ProductUpdateSchemaZod>;  
export type ProductVerificationZ = z.infer<typeof ProductVerificationSchemaZod>;

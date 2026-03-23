import { z } from "zod";

export const SentMessageSchemaZod = z
  .object({
    text: z.string().optional(),
    image: z
      .any()
      .refine((file) => !file || file instanceof File, {
        message: "Image must be a file",
      })
      .optional(),
  })
  .refine(
    (data) => (data.text?.trim() && data.text !== "") || data.image,
    {
      message: "Either text or image is required",
      path: ["text"], 
    }
  );
import * as z from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  ingredients: z.string().min(1, "At least one ingredient is required"),
  usageInstructions: z.string().min(1, "Usage instructions are required"),
  price: z.number().min(0, "Price must be a positive number"),
  inventory: z.number().min(0, "Inventory must be a positive number"),
  unitType: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const defaultValuesObj: ProductFormValues = {
  name: "",
  description: "",
  ingredients: "",
  usageInstructions: "",
  price: 0,
  inventory: 0,
  unitType: "grams",
};

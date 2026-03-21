import { z } from "zod";

const OrderStatusSchemaZod = z.enum([
  "placed",
  "confirmed",
  "shipped",
  "completed",
]);

export const CreateOrderSchemaZod = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().nonnegative().optional().default(1),
  // orderStatus is intentionally omitted so patient cannot override it.
});

export const UpdateOrderStatusSchemaZod = z.object({
  status: OrderStatusSchemaZod,
});


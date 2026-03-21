import { Router } from "express";
import { protectRole } from "../middlewares/protectRole.ts";
import {
  createOrder,
  getMyOrder,
  getMySupplierOrders,
  updateOrderStatusForSupplierHandler,
} from "../controllers/order.controller.ts";
import { validate } from "../middlewares/validate.ts";
import {
  CreateOrderSchemaZod,
  UpdateOrderStatusSchemaZod,
} from "../validations/order.validation.ts";

const router = Router();

router.post(
  "/",
  
  protectRole(["patient"]),
  validate(CreateOrderSchemaZod),
  createOrder,
);

router.get("/me",  protectRole(["patient"]), getMyOrder);

// Supplier: Get all orders for his products
router.get(
  "/supplier/me",
  
  protectRole(["supplier"]),
  getMySupplierOrders,
);

// Supplier: Update order status
router.patch(
  "/:orderId/status",
  protectRole(["supplier"]),
  validate(UpdateOrderStatusSchemaZod),
  updateOrderStatusForSupplierHandler,
);


export default router;

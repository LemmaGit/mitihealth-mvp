import { Router } from "express";
import { protectRole } from "../middlewares/protectRole";
import {
  createOrder,
  getMyOrder,
  getMySupplierOrders,
  getOrderDetails,
  updateOrderStatusForSupplierHandler,
} from "../controllers/order.controller";
import { validate } from "../middlewares/validate";
import {
  CreateOrderSchemaZod,
  UpdateOrderStatusSchemaZod,
} from "../validations/order.validation";

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

// Get order details
router.get(
  "/:orderId",
  
  getOrderDetails,
);

// Supplier: Update order status
router.patch(
  "/:orderId/status",
  protectRole(["supplier"]),
  validate(UpdateOrderStatusSchemaZod),
  updateOrderStatusForSupplierHandler,
);


export default router;

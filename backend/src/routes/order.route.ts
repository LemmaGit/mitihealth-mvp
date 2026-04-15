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
import { protect } from "../middlewares/protect";

const router = Router();

router.post(
  "/",
  protect,
  protectRole(["patient"]),
  validate(CreateOrderSchemaZod),
  createOrder,
);

router.get("/me", protect,  protectRole(["patient"]), getMyOrder);

// Supplier: Get all orders for his products
router.get(
  "/supplier/me",protect,
  protectRole(["supplier"]),
  getMySupplierOrders,
);

// Get order details
router.get(
  "/:orderId",
  protect,
  getOrderDetails,
);

// Supplier: Update order status
router.patch(
  "/:orderId/status",
  protect,
  protectRole(["supplier"]),
  validate(UpdateOrderStatusSchemaZod),
  updateOrderStatusForSupplierHandler,
);


export default router;

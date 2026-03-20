import { Router } from "express";

import {
  addOrUpdateProduct,
  getAllProducts,
  verifyProduct,
} from "../controllers/product.controller.ts";

const router = Router();

// Supplier adds/ updates product
router.post("/", addOrUpdateProduct);

// Get all approved products (marketplace)
router.get("/", getAllProducts);

// Admin verify product
router.patch("/:id/verify", verifyProduct);

export default router;

import { Router } from "express";

import {
  addOrUpdateProduct,
  getAllProducts,
  verifyProduct,
} from "../controllers/product.controller.ts";
import { protect } from "../middlewares/protect.ts";
import { validate } from "../middlewares/validate.ts";
import { ProductSchemaZod } from "../validations/product.validation.ts";
import { upload } from "../lib/multer.ts";
import { uploadMultipleImages } from "../middlewares/uploadMultipleImages.ts";
import { protectRole } from "../middlewares/protectRole.ts";

const router = Router();

// Supplier adds/ updates product
router.post(
  "/",
  protect,
  upload.array("images", 5),
  uploadMultipleImages,
  validate(ProductSchemaZod),
  addOrUpdateProduct,
);

// Get all approved products (marketplace)
router.get("/", getAllProducts);

// Admin verify product
router.patch("/:id/verify", protectRole(["admin"]), verifyProduct);

export default router;

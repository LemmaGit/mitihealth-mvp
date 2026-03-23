import { Router } from "express";

import {
  createProductController,
  updateProductController,
  getAllProducts,
  verifyProduct,
  getSupplierProductsAndStats,
} from "../controllers/product.controller.ts";
import { validate } from "../middlewares/validate.ts";
import {
  ProductCreateSchemaZod,
  ProductUpdateSchemaZod,
  ProductVerificationSchemaZod,
} from "../validations/product.validation.ts";
import { upload } from "../lib/multer.ts";
import { uploadMultipleImages } from "../middlewares/uploadMultipleImages.ts";
import { protectRole } from "../middlewares/protectRole.ts";

const router = Router();

// Supplier creates product
router.post(
  "/",
  protectRole(["supplier"]),
  upload.array("images", 5),
  uploadMultipleImages,
  validate(ProductCreateSchemaZod),
  createProductController,
);

// Get all approved products (marketplace)
router.get("/", getAllProducts);
router.get("/:id",protectRole(["supplier"]), getSupplierProductsAndStats);

// Admin verify product
router.patch("/:id/verify",protectRole(["admin"]), validate(ProductVerificationSchemaZod), verifyProduct);

// Supplier updates own product (verificationStatus is admin-only)
// In the form we will make sure if it is dirty meaning if there is something that is changed
// and only then we request for an update
router.put(
  "/:id",
  protectRole(["supplier"]),
  upload.array("images", 5),
  uploadMultipleImages,
  validate(ProductUpdateSchemaZod),
  updateProductController,
);

export default router;

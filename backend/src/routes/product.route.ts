import { Router } from "express";

import {
  createProductController,
  updateProductController,
  verifyProduct,
  getSupplierProductsAndStats,
  getAllVerifiedProducts,
  getAllProducts,
} from "../controllers/product.controller";
import { validate } from "../middlewares/validate";
import {
  ProductCreateSchemaZod,
  ProductUpdateSchemaZod,
  ProductVerificationSchemaZod,
} from "../validations/product.validation";
import { upload } from "../lib/multer";
import { uploadMultipleImages } from "../middlewares/uploadMultipleImages";
import { protectRole } from "../middlewares/protectRole";

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
router.get("/verified", getAllVerifiedProducts);
router.get("/:id",protectRole(["supplier"]), getSupplierProductsAndStats);

// Admin verify product
router.patch("/:id/verify",protectRole(["admin"]), validate(ProductVerificationSchemaZod), verifyProduct);

// Supplier updates own product (verificationStatus is admin-only)
// In the form we will make sure if it is dirty meaning if there is something that is changed
// and only then we request for an update
router.patch(
  "/:id",
  protectRole(["supplier"]),
  upload.array("images", 5),
  uploadMultipleImages,
  validate(ProductUpdateSchemaZod),
  updateProductController,
);

export default router;

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
import { protect } from "../middlewares/protect";

const router = Router();

// Supplier creates product
router.post(
  "/",
  protect,
  protectRole(["supplier"]),
  upload.array("images", 5),
  uploadMultipleImages,
  validate(ProductCreateSchemaZod),
  createProductController,
);

// Get all approved products (marketplace)
router.get("/",protect,  getAllProducts);
router.get("/verified",protect, getAllVerifiedProducts);
router.get("/:id",protect,protectRole(["supplier"]), getSupplierProductsAndStats);

// Admin verify product
router.patch("/:id/verify",protect,protectRole(["admin"]), validate(ProductVerificationSchemaZod), verifyProduct);

router.patch(
  "/:id",
  protect,
  protectRole(["supplier"]),
  upload.array("images", 5),
  uploadMultipleImages,
  validate(ProductUpdateSchemaZod),
  updateProductController,
);

export default router;

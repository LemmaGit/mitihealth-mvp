import status from "http-status";
import catchAsync from "../utils/catchAsync.ts";
import ApiError from "../utils/ApiError.ts";
import { Product } from "../models/product.model.ts";
import { createProduct, getProductsOfSupplier, updateProduct, verifyProductStatus } from "../services/product.service.ts";

// ✅
export const createProductController = catchAsync(async (req, res, next) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    return next(new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]));
  }
  const product = await createProduct(userId, req.body);

  res.status(status.CREATED).json(product);
});

// ✅
export const updateProductController = catchAsync(async (req, res, next) => {
  // @ts-ignore
  const userId = req.userId;

  if (!userId) {
    return next(new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]));
  }

  const updated = await updateProduct(userId, req.params.id as string, req.body);

  if (!updated) {
    return next(
      new ApiError(
        status.NOT_FOUND,
        "Product not found (or you do not have permission to update it)",
      ),
    );
  }

  res.json(updated);
});

// ✅
export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find({ verificationStatus: "approved" });
  res.status(status.OK).json(products);
});

export const getSupplierProductsAndStats = catchAsync(async (req, res) => {
  const {id:supplierId} = req.params;
  const data = await getProductsOfSupplier(supplierId as string)
  res.status(status.OK).json({...data
  });
});

// ✅
export const verifyProduct = catchAsync(async (req, res,next) => {
  const { status } = req.body;
  const product = await verifyProductStatus(req.params.id as string, status);
  if (!product) {
    return next(new ApiError(status.NOT_FOUND, "Product not found"));
  }
  res.json(product);
});

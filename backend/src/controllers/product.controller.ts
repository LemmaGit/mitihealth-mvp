import status from "http-status";
import catchAsync from "../utils/catchAsync.ts";
import ApiError from "../utils/ApiError.ts";
import { Product } from "../models/product.model.ts";
import { createProduct } from "../services/product.service.ts";

export const addOrUpdateProduct = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return next(new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]));
  }
  const product = await createProduct(userId, req.body);

  res.status(status.CREATED).json(product);
});

export const getAllProducts = catchAsync(async (req, res) => {
  const products = await Product.find({ verificationStatus: "approved" });
  res.json(products);
});

export const verifyProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: req.body.status },
    { returnDocument: "after" },
  );
  res.json(product);
});

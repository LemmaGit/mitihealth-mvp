import { Product } from "../models/product.model.ts";

const ALLOWED_VERIFICATION_PRODUCT_STATUSES = ["approved", "rejected"] as const;

const isAllowedVerificationProductStatus = (value: unknown): value is
  (typeof ALLOWED_VERIFICATION_PRODUCT_STATUSES)[number] => {
  return (
    typeof value === "string" &&
    (ALLOWED_VERIFICATION_PRODUCT_STATUSES as readonly string[]).includes(value)
  );
};
export const createProduct = async (supplierId: string, productData: any) => {
  const product = await Product.create({
    supplierId,
    ...productData,
  });
  return product;
};

export const updateProduct = async (
  supplierId: string,
  productId: string,
  productData: any,
) => {
  // Ensure suppliers can only update their own products.
  return Product.findOneAndUpdate(
    { _id: productId, supplierId },
    { $set: productData },
    { returnDocument: "after", runValidators: true },
  );
};

export const verifyProductStatus = async (productId: string, status: unknown) => {
  if (!isAllowedVerificationProductStatus(status)) return null;

  return Product.findByIdAndUpdate(
    productId,
    { verificationStatus: status },
    { returnDocument: "after" },
  );
};
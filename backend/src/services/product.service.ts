import { Product } from "../models/product.model.ts";
import { createNotificationsForRole } from "./notification.service.ts";

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
  await createNotificationsForRole({
    role: "admin",
    type: "product:pending",
    title: "New product pending verification",
    message: `A supplier submitted "${product.name}" for review.`,
    metadata: { productId: product._id, supplierId },
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

export const getProductsOfSupplier = async( supplierId:string)=>{
    const products = await Product.find({supplierId});
    const stats = products.reduce(
    (acc, p) => {
      if (p.inventory === 0) acc.outOfStock++;
      if (p.inventory > 0 && p.inventory <= 10) acc.lowStock++;
      if (p.verificationStatus === "approved") acc.active++;
      return acc;
    },
    { outOfStock: 0, lowStock: 0, active: 0 }
  );
  const {active,lowStock,outOfStock} = stats;

  return {
    products,
    total:products.length,
    active,lowStock,outOfStock
  }
}
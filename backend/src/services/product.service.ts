import { Product } from "../models/product.model.ts";

export const createProduct = async (supplierId: string, productData: any) => {
  const product = await Product.create({
    supplierId,
    ...productData,
  });
  return product;
};

import { getAuth } from "@clerk/express";
import { Product } from "../models/product.model.ts";

export const addOrUpdateProduct = async (req, res) => {
  const { userId } = getAuth(req);
  const product = await Product.create({ supplierId: userId, ...req.body });
  res.json(product);
};

export const getAllProducts = async (req, res) => {
  const products = await Product.find({ verificationStatus: "approved" });
  res.json(products);
};

export const verifyProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { verificationStatus: req.body.status },
    { new: true },
  );
  res.json(product);
};

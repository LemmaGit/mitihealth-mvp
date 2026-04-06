import { clerkClient } from "@clerk/express";
import { Consultation } from "../models/consultation.model";
import { Order } from "../models/order.model";
import { Practitioner } from "../models/Practitioner.model";
import { Product } from "../models/product.model";
import { User } from "../models/User.model";

const ALLOWED_VERIFICATION_STATUSES = ["pending", "approved", "rejected"] as const;

const isAllowedVerificationStatus = (value: unknown): value is
  (typeof ALLOWED_VERIFICATION_STATUSES)[number] => {
  return (
    typeof value === "string" &&
    (ALLOWED_VERIFICATION_STATUSES as readonly string[]).includes(value)
  );
};

export const verifyPractitionerStatus = async (practitionerId: string, status: unknown) => {
  if (!isAllowedVerificationStatus(status)) return null;

  return Practitioner.findByIdAndUpdate(
    practitionerId,
    { verificationStatus: status },
    { returnDocument: "after" },
  );
};

export const verifyProductStatus = async (productId: string, status: unknown) => {
  if (!isAllowedVerificationStatus(status)) return null;

  return Product.findByIdAndUpdate(
    productId,
    { verificationStatus: status },
    { returnDocument: "after" },
  );
};

export const listAllUsers = async () => {
  const users = await User.find({});

  const userWithProfileImage = await Promise.all(
    users.map(async (user) => {
      try {
        const clerkUser = await clerkClient.users.getUser(user.clerkId);

        return {
          ...user.toObject(),
          imageUrl: clerkUser.imageUrl,
        };
      } catch (err) {
        return {
          ...user.toObject(),
          imageUrl: null,
        };
      }
    })
  );

  return userWithProfileImage;
};

export const listAllPractitioners = async () => {
  return Practitioner.find({});
};

export const getAdminAnalytics = async () => {
  const [totalUsers, totalPractitioners, totalProducts, totalOrders, totalConsultations] =
    await Promise.all([
      User.countDocuments({}),
      Practitioner.countDocuments({}),
      Product.countDocuments({}),
      Order.countDocuments({}),
      Consultation.countDocuments({}),
    ]);

  const [pendingPractitioners, pendingProducts] = await Promise.all([
    Practitioner.countDocuments({ verificationStatus: "pending" }),
    Product.countDocuments({ verificationStatus: "pending" }),
  ]);

  return {
    totalUsers,
    totalPractitioners,
    totalProducts,
    totalOrders,
    totalConsultations,
    pendingPractitioners,
    pendingProducts,
  };
};


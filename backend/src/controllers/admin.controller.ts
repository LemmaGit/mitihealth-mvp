import status from "http-status";
import catchAsync from "../utils/catchAsync.ts";
import ApiError from "../utils/ApiError.ts";
import {
  getAdminAnalytics,
  listAllUsers,
  listAllPractitioners,
  verifyPractitionerStatus,
  verifyProductStatus,
} from "../services/admin.service.ts";

export const verifyPractitionerHandler = catchAsync(async (req, res) => {
  const { status: statusFromBody } = req.body ?? {};
  const verificationStatus = Array.isArray(statusFromBody)
    ? statusFromBody[0]
    : statusFromBody;

  const practitioner = await verifyPractitionerStatus(req.params.id as string, verificationStatus);
  if (!practitioner) {
    throw new ApiError(
      status.NOT_FOUND,
      "Practitioner not found (or invalid verification status)",
    );
  }

  res.json({ success: true, practitioner });
});

export const verifyProductHandler = catchAsync(async (req, res) => {
  const { status: statusFromBody } = req.body ?? {};
  const verificationStatus = Array.isArray(statusFromBody)
    ? statusFromBody[0]
    : statusFromBody;

  const product = await verifyProductStatus(req.params.id as string, verificationStatus);
  if (!product) {
    throw new ApiError(
      status.NOT_FOUND,
      "Product not found (or invalid verification status)",
    );
  }

  res.json({ success: true, product });
});

export const listUsersHandler = catchAsync(async (req, res) => {
  const users = await listAllUsers();
  res.json(users);
});

export const listPractitionersHandler = catchAsync(async (req, res) => {
  const practitioners = await listAllPractitioners();
  res.json(practitioners);
});

export const analyticsHandler = catchAsync(async (req, res) => {
  const analytics = await getAdminAnalytics();
  res.json(analytics);
});


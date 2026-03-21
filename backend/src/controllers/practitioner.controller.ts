import status from "http-status";
import catchAsync from "../utils/catchAsync.ts";
import ApiError from "../utils/ApiError.ts";
import {
  findPractitionerById,
  findVerifiedPractitioners,
  updatePractitionerAvailabilityAndFee,
  updatePractitionerVerification,
  upsertPractitionerProfile,
} from "../services/practitioner.service.ts";

export const getAllVerifiedPractitioners = catchAsync(async (req, res) => {
  const practitioners = await findVerifiedPractitioners(req.query);
  res.json(practitioners);
});

export const getPractitioner = catchAsync(async (req, res) => {
  const practitioner = await findPractitionerById(req.params.id);
  if (!practitioner) {
    throw new ApiError(status.NOT_FOUND, "Not found");
  }
  res.json(practitioner);
});

export const updatePractitionerProfile = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }

  const practitioner = await upsertPractitionerProfile(userId, req.body);
  res.json(practitioner);
});

export const adminVerification = catchAsync(async (req, res) => {
  const { status: statusFromBody } = req.body ?? {};
  const verificationStatus = Array.isArray(statusFromBody)
    ? statusFromBody[0]
    : statusFromBody;

  const practitioner = await updatePractitionerVerification(
    req.params.id,
    verificationStatus,
  );
  if (!practitioner) {
    throw new ApiError(
      status.NOT_FOUND,
      "Practitioner not found (or invalid verification status)",
    );
  }

  res.json(practitioner);
});

export const updateAvailabilityAndFee = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }

  const practitioner = await updatePractitionerAvailabilityAndFee(userId, {
    consultationFee: req.body?.consultationFee,
    availability: req.body?.availability,
  });

  if (!practitioner) {
    throw new ApiError(status.NOT_FOUND, "Practitioner profile not found");
  }

  res.json({ success: true, practitioner });
});

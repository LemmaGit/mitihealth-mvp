import status from "http-status";
import catchAsync from "../utils/catchAsync.ts";
import ApiError from "../utils/ApiError.ts";
import {
  createConsultationForPatient,
  getConsultationsForUser,
} from "../services/consultation.service.ts";

export const bookConsultation = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }

  const consultation = await createConsultationForPatient(userId, req.body);
  res.status(status.CREATED).json({ success: true, consultation });
});

export const getMyConsultations = catchAsync(async (req: any, res) => {
  const userId: string | undefined = req.userId;
  if (!userId) {
    throw new ApiError(status.UNAUTHORIZED, status[status.UNAUTHORIZED]);
  }

  const consultations = await getConsultationsForUser(userId);
  res.json(consultations);
});

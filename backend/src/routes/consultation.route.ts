import { Router } from "express";

import {
  bookConsultation,
  getMyConsultations,
  startConsultation,
  completeConsultation,
  getConsultationStatusController,
} from "../controllers/consultation.controller";
import { protectRole } from "../middlewares/protectRole";
import { validate } from "../middlewares/validate";
import { ConsultationCreateSchemaZod } from "../validations/consultation.validation";
import { protect } from "../middlewares/protect";

const router = Router();

// Patient books a consultation
router.post(
  "/",
  protect,
  protectRole(["patient"]),
  validate(ConsultationCreateSchemaZod),
  bookConsultation,
);

// Patient/practitioner gets own consultations
router.get("/me",protect, getMyConsultations);

// Start consultation session
router.post("/:id/start",protect, startConsultation);

// Complete consultation session  
router.post("/:id/complete",protect, completeConsultation);

// Get consultation status
router.get("/:id/status",protect, getConsultationStatusController);

export default router;

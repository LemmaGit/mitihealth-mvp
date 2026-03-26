import { Router } from "express";

import {
  bookConsultation,
  getMyConsultations,
  startConsultation,
  completeConsultation,
  getConsultationStatusController,
} from "../controllers/consultation.controller.ts";
import { protectRole } from "../middlewares/protectRole.ts";
import { validate } from "../middlewares/validate.ts";
import { ConsultationCreateSchemaZod } from "../validations/consultation.validation.ts";

const router = Router();

// Patient books a consultation
router.post(
  "/",
  
  protectRole(["patient"]),
  validate(ConsultationCreateSchemaZod),
  bookConsultation,
);

// Patient/practitioner gets own consultations
router.get("/me", getMyConsultations);

// Start consultation session
router.post("/:id/start", startConsultation);

// Complete consultation session  
router.post("/:id/complete", completeConsultation);

// Get consultation status
router.get("/:id/status", getConsultationStatusController);

export default router;

import { Router } from "express";

import {
  bookConsultation,
  getMyConsultations,
} from "../controllers/consultation.controller.ts";

const router = Router();

// Book consultation
router.post("/", bookConsultation);

// Get my consultations
router.get("/me", getMyConsultations);

export default router;

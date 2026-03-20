import { Router } from "express";
import {
  adminVerification,
  getAllVerifiedPractitioners,
  getPractitioner,
  updatePractitionerProfile,
} from "../controllers/practitioner.controller.ts";

const router = Router();

router.get("/", getAllVerifiedPractitioners);

router.post("/me", updatePractitionerProfile);

router.get("/:id", getPractitioner);

router.patch("/:id/verify", adminVerification);

export default router;

import { Router } from "express";
import {
  adminVerification,
  getAllVerifiedPractitioners,
  getPractitioner,
  getPractitionerData,
  updateAvailabilityAndFee,
  updatePractitionerProfile,
} from "../controllers/practitioner.controller.ts";
import { protectRole } from "../middlewares/protectRole.ts";
import { validate } from "../middlewares/validate.ts";
import {
  AdminVerifyPractitionerSchemaZod,
  PractitionerProfileSchemaZod,
  PractitionerUpdateAvailabilitySchemaZod,
} from "../validations/practitioner.validation.ts";

const router = Router();

router.get("/", getAllVerifiedPractitioners);

router.post(
  "/me",
  protectRole(["practitioner"]),
  validate(PractitionerProfileSchemaZod),
  updatePractitionerProfile,
);

router.get("/:id", getPractitioner);
router.get("/data/:id", getPractitionerData);

router.patch(
  "/:id/verify",
  protectRole(["admin"]),
  validate(AdminVerifyPractitionerSchemaZod),
  adminVerification,
);

// Practitioner updates availability + fee
router.patch(
  "/me/availability",
  protectRole(["practitioner"]),
  validate(PractitionerUpdateAvailabilitySchemaZod),
  updateAvailabilityAndFee,
);
export default router;

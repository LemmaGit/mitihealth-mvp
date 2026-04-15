import { Router } from "express";
import {
  adminVerification,
  getAllVerifiedPractitioners,
  getPractitioner,
  getPractitionerData,
  updateAvailabilityAndFee,
  updatePractitionerProfile,
} from "../controllers/practitioner.controller";
import { protectRole } from "../middlewares/protectRole";
import { validate } from "../middlewares/validate";
import {
  AdminVerifyPractitionerSchemaZod,
  PractitionerProfileSchemaZod,
  PractitionerUpdateAvailabilitySchemaZod,
} from "../validations/practitioner.validation";
import { protect } from "../middlewares/protect";

const router = Router();

router.get("/",protect, getAllVerifiedPractitioners);

router.post(
  "/me",
  protect,
  protectRole(["practitioner"]),
  validate(PractitionerProfileSchemaZod),
  updatePractitionerProfile,
);

router.get("/:id",protect, getPractitioner);
router.get("/data/:id",protect, getPractitionerData);

router.patch(
  "/:id/verify",
  protect,
  protectRole(["admin"]),
  validate(AdminVerifyPractitionerSchemaZod),
  adminVerification,
);

// Practitioner updates availability + fee
router.patch(
  "/me/availability",
  protect,
  protectRole(["practitioner"]),
  validate(PractitionerUpdateAvailabilitySchemaZod),
  updateAvailabilityAndFee,
);
export default router;

import { Router } from "express";
import { protectRole } from "../middlewares/protectRole.ts";
import {
  analyticsHandler,
  listUsersHandler,
  verifyPractitionerHandler,
  verifyProductHandler,
} from "../controllers/admin.controller.ts";

const router = Router();


router.use(protectRole(["admin"]));

// 1. Approve / Reject Practitioner
router.patch("/practitioners/:id/verify", verifyPractitionerHandler);

// 2. Approve / Reject Product
router.patch("/products/:id/verify", verifyProductHandler);

// 3. Manage Users (list all users)
router.get("/users", listUsersHandler);

// 4. Analytics Dashboard
router.get("/analytics", analyticsHandler);

export default router;
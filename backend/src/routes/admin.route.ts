import { Router } from "express";
import { protectRole } from "../middlewares/protectRole";
import {
  analyticsHandler,
  listUsersHandler,
  listPractitionersHandler,
  verifyPractitionerHandler,
  verifyProductHandler,
} from "../controllers/admin.controller";

const router = Router();

router.use(protectRole(["admin"]));

router.get("/practitioners", listPractitionersHandler);
router.patch("/practitioners/:id/verify", verifyPractitionerHandler);

router.patch("/products/:id/verify", verifyProductHandler);

router.get("/users", listUsersHandler);

router.get("/analytics", analyticsHandler);

export default router;
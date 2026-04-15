import { Router } from "express";
import { protectRole } from "../middlewares/protectRole";
import {
  analyticsHandler,
  listUsersHandler,
  listPractitionersHandler,
  verifyPractitionerHandler,
  verifyProductHandler,
} from "../controllers/admin.controller";
import { protect } from "../middlewares/protect";

const router = Router();

// router.use(protectRole(["admin"]));

router.get("/practitioners",protect,protectRole(["admin"]), listPractitionersHandler);
router.patch("/practitioners/:id/verify",protect,protectRole(["admin"]), verifyPractitionerHandler);

router.patch("/products/:id/verify",protect,protectRole(["admin"]), verifyProductHandler);

router.get("/users",protect,protectRole(["admin"]), listUsersHandler);

router.get("/analytics",protect,protectRole(["admin"]), analyticsHandler);

export default router;

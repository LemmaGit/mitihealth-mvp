import { Router } from "express";
import { getUser } from "../controllers/user.controller";
import { protect } from "../middlewares/protect";

const router = Router();

router.get("/:id",protect, getUser);

export default router;
    
import { Router } from "express";
import { clearOne, getMyNotifications, markAsRead } from "../controllers/notification.controller";
import { protect } from "../middlewares/protect";

const router = Router();

router.get("/me",protect, getMyNotifications);
router.patch("/:id/read",protect, markAsRead);
router.delete("/:id",protect, clearOne);

export default router;

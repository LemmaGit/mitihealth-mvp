import { Router } from "express";
import { clearOne, getMyNotifications, markAsRead } from "../controllers/notification.controller.ts";

const router = Router();

router.get("/me", getMyNotifications);
router.patch("/:id/read", markAsRead);
router.delete("/:id", clearOne);

export default router;

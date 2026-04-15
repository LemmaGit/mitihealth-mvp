import { Router } from "express";

import { getMessages, sendMessage, getUsersForSidebar, hideConversation } from "../controllers/message.controller";
import { upload } from "../lib/multer";
import { protect } from "../middlewares/protect";   

const router = Router();

router.get("/users",protect, getUsersForSidebar);
router.get("/:receiverId",protect, getMessages);
router.post("/send/:id",protect, upload.single("image"), sendMessage);
router.post("/hide/:userId",protect, hideConversation);

export default router;

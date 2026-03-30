import { Router } from "express";

import { getMessages, sendMessage, getUsersForSidebar, hideConversation } from "../controllers/message.controller.ts";
import { upload } from "../lib/multer.ts";

const router = Router();

router.get("/users", getUsersForSidebar);
router.get("/:receiverId", getMessages);
router.post("/send/:id", upload.single("image"), sendMessage);
router.post("/hide/:userId", hideConversation);

export default router;

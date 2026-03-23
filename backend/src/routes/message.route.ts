import { Router } from "express";

import { getMessages, sendMessage } from "../controllers/message.controller.ts";
import { upload } from "../lib/multer.ts";
import { validate } from "../middlewares/validate.ts";
import { SentMessageSchemaZod } from "../validations/message.validation.ts";

const router = Router();

router.get("/:receiverId", getMessages);
router.post("/send/:id", upload.single("image"), sendMessage);


export default router;

import { Router } from "express";

import { getMessages } from "../controllers/message.controller.ts";

const router = Router();

router.get("/:receiverId", getMessages);

export default router;

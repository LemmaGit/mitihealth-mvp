import { Router } from "express";

import { createOrder, getMyOrder } from "../controllers/order.controller.ts";

const router = Router();

router.post("/", createOrder);

router.get("/me", getMyOrder);

export default router;

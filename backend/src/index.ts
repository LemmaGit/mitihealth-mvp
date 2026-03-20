import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { app, server } from "./lib/socket.ts";
import { connectDb } from "./lib/db.ts";

// Routers
import webhookRouter from "./routes/webhook.js";
import practitionerRouter from "./routes/practitioner.route.ts";
import productRouter from "./routes/product.route.ts";
import consultationRouter from "./routes/consultation.route.ts";
import orderRouter from "./routes/order.route.ts";
import messageRouter from "./routes/message.route.ts";

const PORT = process.env.PORT || 5000;

app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRouter,
);

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(clerkMiddleware());

// All API routes
app.use("/api/practitioners", practitionerRouter);
app.use("/api/products", productRouter);
app.use("/api/consultations", consultationRouter);
app.use("/api/orders", orderRouter);
app.use("/api/messages", messageRouter);

server.listen(PORT, async () => {
  await connectDb();
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

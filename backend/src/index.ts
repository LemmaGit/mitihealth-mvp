import "dotenv/config";
import express from "express";
import cors from "cors";
import httpStatus from "http-status";
import { clerkMiddleware } from "@clerk/express";
import { app, server } from "./lib/socket.ts";
import { connectDb } from "./lib/db.ts";
import cron from "node-cron";
import { checkAndCreateConsultationThreads } from "./services/consultation.service.ts";

// Routers
import webhookRouter from "./routes/webhook.route.ts";
import adminRouter from "./routes/admin.route.ts";
import practitionerRouter from "./routes/practitioner.route.ts";
import productRouter from "./routes/product.route.ts";
import consultationRouter from "./routes/consultation.route.ts";
import orderRouter from "./routes/order.route.ts";
import messageRouter from "./routes/message.route.ts";
import notificationRouter from "./routes/notification.route.ts";
import userRouter from "./routes/user.route.ts";

import ApiError from "./utils/ApiError.ts";
import { errorConverter, errorHandler } from "./middlewares/error.ts";
import { protect } from "./middlewares/protect.ts";
import { syncUser } from "./middlewares/syncUser.ts";

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
app.use(syncUser)
app.use(protect)


// All API routes
app.get("/", (req, res) => res.json({ message: "MitiHealth Backend OK" }));
app.use("/api/practitioners", practitionerRouter);
app.use("/api/admin", adminRouter);
app.use("/api/products", productRouter);
app.use("/api/consultations", consultationRouter);
app.use("/api/orders", orderRouter);
app.use("/api/messages", messageRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/users", userRouter);
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorConverter);
app.use(errorHandler);
server.listen(PORT, async () => {
  await connectDb();
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
  
  // Schedule consultation thread creation check every minute
  cron.schedule('* * * * *', async () => {
    try {
      await checkAndCreateConsultationThreads();
      console.log('📅 Checked for starting consultations');
    } catch (error) {
      console.error('❌ Error checking consultations:', error);
    }
  });
  
  console.log('⏰ Consultation scheduler started');
});

const exitHandler = () => {
  if (server) {
    server.close(() => {
      console.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};
const unExpectedErrorHandler = (error: Error) => {
  console.error(error);
  exitHandler();
};

process.on("uncaughtException", unExpectedErrorHandler);
process.on("unhandledRejection", unExpectedErrorHandler);
process.on("SIGTERM", () => {
  console.info("SIGTERM recieved");
  if (server) {
    server.close();
  }
});

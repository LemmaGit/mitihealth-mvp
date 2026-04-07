import "dotenv/config";
import express from "express";
import cors from "cors";
import httpStatus from "http-status";
import { clerkMiddleware } from "@clerk/express";
import { app, server } from "./lib/socket";
import { connectDb } from "./lib/db";
import cron from "node-cron";
import { checkAndCreateConsultationThreads, autoCompleteElapsedConsultations } from "./services/consultation.service";

// Routers
import webhookRouter from "./routes/webhook.route";
import adminRouter from "./routes/admin.route";
import practitionerRouter from "./routes/practitioner.route";
import productRouter from "./routes/product.route";
import consultationRouter from "./routes/consultation.route";
import orderRouter from "./routes/order.route";
import messageRouter from "./routes/message.route";
import notificationRouter from "./routes/notification.route";
import userRouter from "./routes/user.route";

import ApiError from "./utils/ApiError";
import { errorConverter, errorHandler } from "./middlewares/error";
import { protect } from "./middlewares/protect";
import { syncUser } from "./middlewares/syncUser";

const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "https://mitihealth.me",
  "https://www.mitihealth.me",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

const allowedHeaders = [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With", 
    "Accept",
    "X-App-Version",
    "Baggage",       
    "Sentry-Trace"   
  ]

// Middlewares
/*app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(`CORS blocked for origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type", 
    "Authorization", 
    "X-Requested-With", 
    "Accept",
    "X-App-Version", // Sample custom header
    "Baggage",       // Used by some tracing tools
    "Sentry-Trace"   // Used by Sentry if enabled
  ],
}));*/

app.use(cors({
  origin: "https://mitihealth.me", 
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders,
  optionsSuccessStatus: 204
}));

app.options('*', cors());

app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  webhookRouter,
);

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
  
  // Schedule consultation thread creation check every minute
  cron.schedule('* * * * *', async () => {
    try {
      await checkAndCreateConsultationThreads();
      await autoCompleteElapsedConsultations();
    } catch (error) {
      console.error('❌ Error checking consultations:', error);
    }
  });
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

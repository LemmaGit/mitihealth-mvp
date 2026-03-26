import mongoose from "mongoose";

export const connectDb = async () => {
  //TODO: Fix "MONGODB_URI is not defined" problem for now we will manually use it

  const mongoUri = process.env.MONGO_REMOTE_URI;
  // const mongoUri = "mongodb://127.0.0.1:27017/mitihealth-mvp";

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
};

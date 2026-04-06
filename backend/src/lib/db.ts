import mongoose from "mongoose";

export const connectDb = async () => {

  const mongoUri = process.env.MONGO_REMOTE_URI;

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

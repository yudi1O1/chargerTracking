import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.warn("MongoDB unavailable; API will use deterministic demo data.");
    if (env.NODE_ENV === "production") {
      throw error;
    }
  }
}

export function isDatabaseConnected(): boolean {
  return mongoose.connection.readyState === 1;
}


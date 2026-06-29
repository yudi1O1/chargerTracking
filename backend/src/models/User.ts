import { Schema, model } from "mongoose";
import type { UserRole } from "../types.js";

export interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: "active" | "disabled";
  lastActiveAt?: Date;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "operator", "viewer"], default: "viewer" },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    lastActiveAt: Date,
    refreshTokenHash: String,
  },
  { timestamps: true },
);

export const UserModel = model<UserDocument>("User", userSchema);


import { Schema, model } from "mongoose";

export interface SettingDocument {
  userId: string;
  theme: "light" | "dark" | "system";
  emailNotifications: boolean;
  pushNotifications: boolean;
  stationAlerts: boolean;
  sessionAlerts: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const settingSchema = new Schema<SettingDocument>(
  {
    userId: { type: String, required: true, unique: true },
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    stationAlerts: { type: Boolean, default: true },
    sessionAlerts: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const SettingModel = model<SettingDocument>("Setting", settingSchema);


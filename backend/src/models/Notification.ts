import { Schema, model } from "mongoose";
import type { NotificationSeverity, NotificationType } from "../types.js";

export interface NotificationDocument {
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  stationId?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    type: {
      type: String,
      enum: ["station_offline", "charging_completed", "maintenance_due", "high_demand", "new_operator"],
      required: true,
    },
    severity: { type: String, enum: ["info", "warning", "critical", "success"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    stationId: String,
    read: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

export const NotificationModel = model<NotificationDocument>("Notification", notificationSchema);


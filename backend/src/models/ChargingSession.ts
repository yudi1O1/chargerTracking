import { Schema, model, Types } from "mongoose";
import type { SessionStatus } from "../types.js";

export interface ChargingSessionDocument {
  stationId: Types.ObjectId;
  stationName: string;
  city: string;
  vehicle: string;
  connectorType: string;
  status: SessionStatus;
  energyKwh: number;
  durationMinutes: number;
  cost: number;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new Schema<ChargingSessionDocument>(
  {
    stationId: { type: Schema.Types.ObjectId, ref: "Station", index: true, required: true },
    stationName: { type: String, required: true },
    city: { type: String, required: true, index: true },
    vehicle: { type: String, required: true },
    connectorType: { type: String, required: true },
    status: { type: String, enum: ["active", "completed", "failed", "cancelled"], index: true, required: true },
    energyKwh: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    cost: { type: Number, required: true },
    startedAt: { type: Date, index: true, required: true },
    endedAt: Date,
  },
  { timestamps: true },
);

sessionSchema.index({ startedAt: -1, status: 1 });

export const ChargingSessionModel = model<ChargingSessionDocument>("ChargingSession", sessionSchema);


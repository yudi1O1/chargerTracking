import { Schema, model } from "mongoose";
import type { StationStatus } from "../types.js";

export interface StationDocument {
  name: string;
  city: string;
  address: string;
  status: StationStatus;
  coordinates: { latitude: number; longitude: number };
  connectorTypes: string[];
  capacityKw: number;
  totalConnectors: number;
  availableConnectors: number;
  utilization: number;
  revenue: number;
  energyDeliveredKwh: number;
  healthScore: number;
  maintenanceHistory: Array<{ title: string; notes: string; completedAt: Date }>;
  lastHeartbeat: Date;
  createdAt: Date;
  updatedAt: Date;
}

const stationSchema = new Schema<StationDocument>(
  {
    name: { type: String, required: true, index: true },
    city: { type: String, required: true, index: true },
    address: { type: String, required: true },
    status: { type: String, enum: ["available", "busy", "offline", "maintenance"], index: true, required: true },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    connectorTypes: [{ type: String, required: true }],
    capacityKw: { type: Number, required: true },
    totalConnectors: { type: Number, required: true },
    availableConnectors: { type: Number, required: true },
    utilization: { type: Number, required: true },
    revenue: { type: Number, required: true },
    energyDeliveredKwh: { type: Number, required: true },
    healthScore: { type: Number, required: true },
    maintenanceHistory: [
      {
        title: String,
        notes: String,
        completedAt: Date,
      },
    ],
    lastHeartbeat: { type: Date, required: true },
  },
  { timestamps: true },
);

stationSchema.index({ city: 1, status: 1 });
stationSchema.index({ name: "text", city: "text", address: "text" });

export const StationModel = model<StationDocument>("Station", stationSchema);


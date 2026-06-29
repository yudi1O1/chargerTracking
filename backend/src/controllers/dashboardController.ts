import type { Request, Response } from "express";
import { ChargingSessionModel } from "../models/ChargingSession.js";
import { NotificationModel } from "../models/Notification.js";
import { StationModel } from "../models/Station.js";
import { toNotificationDTO, toSessionDTO, toStationDTO } from "../services/dtoMappers.js";
import { sendSuccess } from "../utils/http.js";

function round(value: number, precision = 2): number {
  return Number(value.toFixed(precision));
}

export async function getDashboard(_req: Request, res: Response): Promise<void> {
  const [
    totalStations,
    onlineStations,
    offlineStations,
    activeSessions,
    stationTotals,
    completedDuration,
    recentAlerts,
    recentSessions,
    topStations,
  ] = await Promise.all([
    StationModel.countDocuments({}),
    StationModel.countDocuments({ status: { $ne: "offline" } }),
    StationModel.countDocuments({ status: "offline" }),
    ChargingSessionModel.countDocuments({ status: "active" }),
    StationModel.aggregate<{ revenue: number; energyDelivered: number }>([
      { $group: { _id: null, revenue: { $sum: "$revenue" }, energyDelivered: { $sum: "$energyDeliveredKwh" } } },
    ]),
    ChargingSessionModel.aggregate<{ averageChargingTime: number }>([
      { $match: { status: "completed" } },
      { $group: { _id: null, averageChargingTime: { $avg: "$durationMinutes" } } },
    ]),
    NotificationModel.find({}).sort({ createdAt: -1 }).limit(4),
    ChargingSessionModel.find({}).sort({ startedAt: -1 }).limit(8),
    StationModel.find({}).sort({ revenue: -1 }).limit(6),
  ]);

  const totals = stationTotals[0] ?? { revenue: 0, energyDelivered: 0 };
  const averageChargingTime = completedDuration[0]?.averageChargingTime ?? 0;

  sendSuccess(res, {
    kpis: {
      totalStations,
      onlineStations,
      offlineStations,
      chargingSessions: activeSessions,
      revenue: round(totals.revenue),
      energyDelivered: round(totals.energyDelivered),
      carbonSaved: round(totals.energyDelivered * 0.82),
      averageChargingTime: round(averageChargingTime, 1),
      peakUsage: "18:00 - 21:00",
    },
    recentAlerts: recentAlerts.map(toNotificationDTO),
    recentSessions: recentSessions.map(toSessionDTO),
    topStations: topStations.map(toStationDTO),
  });
}

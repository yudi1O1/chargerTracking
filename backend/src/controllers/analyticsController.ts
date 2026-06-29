import type { Request, Response } from "express";
import { ChargingSessionModel } from "../models/ChargingSession.js";
import { StationModel } from "../models/Station.js";
import { sendSuccess } from "../utils/http.js";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function round(value: number, precision = 2): number {
  return Number(value.toFixed(precision));
}

function emptyMonthMap(): Map<number, { revenue: number; energy: number; sessions: number; completed: number; total: number }> {
  return new Map(monthNames.map((_, index) => [index + 1, { revenue: 0, energy: 0, sessions: 0, completed: 0, total: 0 }]));
}

export async function getAnalytics(_req: Request, res: Response): Promise<void> {
  const [monthly, cityUsage, utilization, connectorDistribution, availability] = await Promise.all([
    ChargingSessionModel.aggregate<{
      _id: number;
      revenue: number;
      energy: number;
      sessions: number;
      completed: number;
      total: number;
    }>([
      {
        $group: {
          _id: { $month: "$startedAt" },
          revenue: { $sum: "$cost" },
          energy: { $sum: "$energyKwh" },
          sessions: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    ChargingSessionModel.aggregate<{ city: string; sessions: number; energy: number }>([
      { $group: { _id: "$city", sessions: { $sum: 1 }, energy: { $sum: "$energyKwh" } } },
      { $project: { _id: 0, city: "$_id", sessions: 1, energy: { $round: ["$energy", 2] } } },
      { $sort: { sessions: -1 } },
    ]),
    StationModel.find({}).sort({ utilization: -1 }).limit(12).select({ name: 1, utilization: 1 }),
    StationModel.aggregate<{ name: string; value: number }>([
      { $unwind: "$connectorTypes" },
      { $group: { _id: "$connectorTypes", value: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
      { $sort: { value: -1 } },
    ]),
    StationModel.aggregate<{ name: string; value: number }>([
      { $group: { _id: "$status", value: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
      { $sort: { name: 1 } },
    ]),
  ]);

  const monthMap = emptyMonthMap();
  monthly.forEach((item) => {
    monthMap.set(item._id, {
      revenue: round(item.revenue),
      energy: round(item.energy),
      sessions: item.sessions,
      completed: item.completed,
      total: item.total,
    });
  });

  const monthSeries = Array.from(monthMap.entries()).map(([monthNumber, value]) => ({
    month: monthNames[monthNumber - 1] ?? String(monthNumber),
    ...value,
  }));

  sendSuccess(res, {
    revenueTrend: monthSeries.map(({ month, revenue }) => ({ month, revenue })),
    energyConsumption: monthSeries.map(({ month, energy }) => ({ month, energy })),
    sessions: monthSeries.map(({ month, sessions }) => ({ month, sessions })),
    utilization: utilization.map((station) => ({ station: station.name.replace(" PowerHub ", " #"), utilization: station.utilization })),
    successRate: monthSeries.map(({ month, completed, total }) => ({ month, rate: total ? round((completed / total) * 100, 1) : 0 })),
    connectorDistribution,
    revenueVsEnergy: monthSeries.map(({ month, revenue, energy }) => ({ month, revenue, energy })),
    cityUsage,
    availability: availability.map((item) => ({ name: item.name, value: item.value })),
  });
}

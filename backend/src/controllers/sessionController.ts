import type { Request, Response } from "express";
import { ChargingSessionModel } from "../models/ChargingSession.js";
import { toSessionDTO } from "../services/dtoMappers.js";
import { paginationSchema } from "../validators/common.js";
import { HttpError, sendSuccess } from "../utils/http.js";

export async function listSessions(req: Request, res: Response): Promise<void> {
  const query = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = {};

  if (query.search) {
    const search = new RegExp(query.search, "i");
    filter.$or = [{ stationName: search }, { vehicle: search }, { city: search }];
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.city) {
    filter.city = new RegExp(`^${query.city}$`, "i");
  }

  const skip = (query.page - 1) * query.limit;
  const [sessions, total] = await Promise.all([
    ChargingSessionModel.find(filter).sort({ startedAt: -1 }).skip(skip).limit(query.limit),
    ChargingSessionModel.countDocuments(filter),
  ]);

  sendSuccess(res, sessions.map(toSessionDTO), { total, page: query.page, limit: query.limit });
}

export async function getSession(req: Request, res: Response): Promise<void> {
  const session = await ChargingSessionModel.findById(req.params.id);
  if (!session) {
    throw new HttpError(404, "Session not found");
  }
  sendSuccess(res, toSessionDTO(session));
}

export async function exportSessions(req: Request, res: Response): Promise<void> {
  const query = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = {};
  if (query.status) {
    filter.status = query.status;
  }

  const sessions = await ChargingSessionModel.find(filter).sort({ startedAt: -1 }).limit(1000);
  const rows = sessions
    .map(toSessionDTO)
    .map((session) => [session.id, session.stationName, session.city, session.vehicle, session.status, session.energyKwh, session.durationMinutes, session.cost].join(","));

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=evision-sessions.csv");
  res.send(["id,station,city,vehicle,status,energyKwh,durationMinutes,cost", ...rows].join("\n"));
}

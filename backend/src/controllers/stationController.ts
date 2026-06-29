import type { Request, Response } from "express";
import { StationModel } from "../models/Station.js";
import { toStationDTO } from "../services/dtoMappers.js";
import type { StationStatus } from "../types.js";
import { paginationSchema, stationSchema } from "../validators/common.js";
import { HttpError, sendSuccess } from "../utils/http.js";

export async function listStations(req: Request, res: Response): Promise<void> {
  const query = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = {};

  if (query.search) {
    const search = new RegExp(query.search, "i");
    filter.$or = [{ name: search }, { city: search }, { address: search }];
  }
  if (query.status) {
    filter.status = query.status;
  }
  if (query.city) {
    filter.city = new RegExp(`^${query.city}$`, "i");
  }

  const skip = (query.page - 1) * query.limit;
  const [stations, total] = await Promise.all([
    StationModel.find(filter).sort({ name: 1 }).skip(skip).limit(query.limit),
    StationModel.countDocuments(filter),
  ]);

  sendSuccess(res, stations.map(toStationDTO), { total, page: query.page, limit: query.limit });
}

export async function getStation(req: Request, res: Response): Promise<void> {
  const station = await StationModel.findById(req.params.id);
  if (!station) {
    throw new HttpError(404, "Station not found");
  }
  sendSuccess(res, toStationDTO(station));
}

export async function createStation(req: Request, res: Response): Promise<void> {
  const payload = stationSchema.parse(req.body);
  const station = await StationModel.create({
    name: payload.name,
    city: payload.city,
    address: payload.address,
    status: payload.status,
    coordinates: { latitude: payload.latitude, longitude: payload.longitude },
    connectorTypes: payload.connectorTypes,
    capacityKw: payload.capacityKw,
    totalConnectors: payload.totalConnectors,
    availableConnectors: payload.availableConnectors,
    utilization: 0,
    revenue: 0,
    energyDeliveredKwh: 0,
    healthScore: 100,
    lastHeartbeat: new Date(),
    maintenanceHistory: [],
  });

  res.status(201);
  sendSuccess(res, toStationDTO(station));
}

export async function updateStation(req: Request, res: Response): Promise<void> {
  const update = { ...req.body } as Record<string, unknown>;
  if (typeof update.status === "string") {
    update.status = update.status as StationStatus;
  }

  const station = await StationModel.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!station) {
    throw new HttpError(404, "Station not found");
  }
  sendSuccess(res, toStationDTO(station));
}

export async function deleteStation(req: Request, res: Response): Promise<void> {
  const station = await StationModel.findByIdAndDelete(req.params.id);
  if (!station) {
    throw new HttpError(404, "Station not found");
  }
  sendSuccess(res, { id: req.params.id, deleted: true });
}

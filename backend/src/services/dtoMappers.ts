import type { ChargingSessionDocument } from "../models/ChargingSession.js";
import type { NotificationDocument } from "../models/Notification.js";
import type { StationDocument } from "../models/Station.js";
import type { UserDocument } from "../models/User.js";
import type { AuthUser, NotificationDTO, SessionDTO, StationDTO } from "../types.js";

type MongoDoc<T> = T & { _id: unknown };

function idOf(value: unknown): string {
  return String(value);
}

export function toStationDTO(station: MongoDoc<StationDocument>): StationDTO {
  return {
    id: idOf(station._id),
    name: station.name,
    city: station.city,
    address: station.address,
    status: station.status,
    coordinates: station.coordinates,
    connectorTypes: station.connectorTypes,
    capacityKw: station.capacityKw,
    totalConnectors: station.totalConnectors,
    availableConnectors: station.availableConnectors,
    utilization: station.utilization,
    revenue: station.revenue,
    energyDeliveredKwh: station.energyDeliveredKwh,
    healthScore: station.healthScore,
    lastHeartbeat: station.lastHeartbeat.toISOString(),
  };
}

export function toSessionDTO(session: MongoDoc<ChargingSessionDocument>): SessionDTO {
  return {
    id: idOf(session._id),
    stationId: idOf(session.stationId),
    stationName: session.stationName,
    city: session.city,
    vehicle: session.vehicle,
    connectorType: session.connectorType,
    status: session.status,
    energyKwh: session.energyKwh,
    durationMinutes: session.durationMinutes,
    cost: session.cost,
    startedAt: session.startedAt.toISOString(),
    endedAt: session.endedAt?.toISOString(),
  };
}

export function toNotificationDTO(notification: MongoDoc<NotificationDocument>): NotificationDTO {
  return {
    id: idOf(notification._id),
    type: notification.type,
    severity: notification.severity,
    title: notification.title,
    message: notification.message,
    stationId: notification.stationId,
    read: notification.read,
    createdAt: notification.createdAt.toISOString(),
  };
}

export function toAuthUserDTO(user: MongoDoc<UserDocument>): AuthUser & { status: "active" | "disabled"; lastActiveAt?: string } {
  return {
    id: idOf(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    lastActiveAt: user.lastActiveAt?.toISOString(),
  };
}

export type UserRole = "admin" | "operator" | "viewer";
export type StationStatus = "available" | "busy" | "offline" | "maintenance";
export type SessionStatus = "active" | "completed" | "failed" | "cancelled";
export type NotificationType = "station_offline" | "charging_completed" | "maintenance_due" | "high_demand" | "new_operator";
export type NotificationSeverity = "info" | "warning" | "critical" | "success";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface StationDTO {
  id: string;
  name: string;
  city: string;
  address: string;
  status: StationStatus;
  coordinates: Coordinates;
  connectorTypes: string[];
  capacityKw: number;
  totalConnectors: number;
  availableConnectors: number;
  utilization: number;
  revenue: number;
  energyDeliveredKwh: number;
  healthScore: number;
  lastHeartbeat: string;
}

export interface SessionDTO {
  id: string;
  stationId: string;
  stationName: string;
  city: string;
  vehicle: string;
  connectorType: string;
  status: SessionStatus;
  energyKwh: number;
  durationMinutes: number;
  cost: number;
  startedAt: string;
  endedAt?: string;
}

export interface NotificationDTO {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  stationId?: string;
  read: boolean;
  createdAt: string;
}

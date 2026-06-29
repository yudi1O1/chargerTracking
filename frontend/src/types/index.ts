export type UserRole = "admin" | "operator" | "viewer";
export type StationStatus = "available" | "busy" | "offline" | "maintenance";
export type SessionStatus = "active" | "completed" | "failed" | "cancelled";
export type NotificationSeverity = "info" | "warning" | "critical" | "success";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: "active" | "disabled";
  lastActiveAt?: string;
}

export interface Station {
  id: string;
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
  lastHeartbeat: string;
}

export interface ChargingSession {
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

export interface Notification {
  id: string;
  type: string;
  severity: NotificationSeverity;
  title: string;
  message: string;
  stationId?: string;
  read: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
  message?: string;
}

export interface DashboardData {
  kpis: {
    totalStations: number;
    onlineStations: number;
    offlineStations: number;
    chargingSessions: number;
    revenue: number;
    energyDelivered: number;
    carbonSaved: number;
    averageChargingTime: number;
    peakUsage: string;
  };
  recentAlerts: Notification[];
  recentSessions: ChargingSession[];
  topStations: Station[];
}

export interface AnalyticsData {
  revenueTrend: Array<{ month: string; revenue: number }>;
  energyConsumption: Array<{ month: string; energy: number }>;
  sessions: Array<{ month: string; sessions: number }>;
  utilization: Array<{ station: string; utilization: number }>;
  successRate: Array<{ month: string; rate: number }>;
  connectorDistribution: Array<{ name: string; value: number }>;
  revenueVsEnergy: Array<{ month: string; revenue: number; energy: number }>;
  cityUsage: Array<{ city: string; sessions: number; energy: number }>;
  availability: Array<{ name: string; value: number }>;
}


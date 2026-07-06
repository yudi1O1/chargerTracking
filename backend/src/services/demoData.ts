import type { AuthUser, NotificationDTO, SessionDTO, StationDTO, StationStatus, UserRole } from "../types.js";

const cities = [
  { city: "Bengaluru", lat: 12.9716, lng: 77.5946 },
  { city: "Mumbai", lat: 19.076, lng: 72.8777 },
  { city: "Delhi", lat: 28.6139, lng: 77.209 },
  { city: "Hyderabad", lat: 17.385, lng: 78.4867 },
  { city: "Pune", lat: 18.5204, lng: 73.8567 },
  { city: "Chennai", lat: 13.0827, lng: 80.2707 },
  { city: "Ahmedabad", lat: 23.0225, lng: 72.5714 },
  { city: "Kolkata", lat: 22.5726, lng: 88.3639 },
];

const statuses: StationStatus[] = ["available", "busy", "offline", "maintenance"];
const connectorSets = [["CCS2", "Type 2"], ["CCS2", "CHAdeMO"], ["Type 2"], ["CCS2", "Bharat AC001"]];
const vehicles = ["Tata Nexon EV", "MG ZS EV", "Hyundai Kona", "BYD Atto 3", "Mahindra XUV400", "Kia EV6"];

function round(value: number, precision = 2): number {
  return Number(value.toFixed(precision));
}

function isoDaysAgo(days: number, hour = 10): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

export const demoUsers: Array<AuthUser & { status: "active" | "disabled"; lastActiveAt: string }> = [
  { id: "u-admin", name: "Aarav Sharma", email: "admin@evision.dev", role: "admin", status: "active", lastActiveAt: isoDaysAgo(0, 9) },
  { id: "u-operator", name: "Meera Iyer", email: "operator@evision.dev", role: "operator", status: "active", lastActiveAt: isoDaysAgo(0, 8) },
  { id: "u-viewer", name: "Rohan Mehta", email: "viewer@evision.dev", role: "viewer", status: "active", lastActiveAt: isoDaysAgo(1, 11) },
  ...Array.from({ length: 497 }, (_, index) => {
    const role: UserRole = index % 7 === 0 ? "admin" : index % 3 === 0 ? "operator" : "viewer";
    return {
      id: `u-${index + 4}`,
      name: `EVision User ${index + 4}`,
      email: `user${index + 4}@evision.dev`,
      role,
      status: index % 13 === 0 ? "disabled" as const : "active" as const,
      lastActiveAt: isoDaysAgo(index % 18, 9 + (index % 8)),
    };
  }),
];

export const demoStations: StationDTO[] = Array.from({ length: 100 }, (_, index) => {
  const cityInfo = cities[index % cities.length] ?? cities[0]!;
  const status = statuses[index % statuses.length] ?? "available";
  const totalConnectors = 4 + (index % 8);
  const availableConnectors = status === "offline" ? 0 : Math.max(0, totalConnectors - (index % totalConnectors) - (status === "busy" ? 2 : 0));
  const utilization = status === "offline" ? 0 : round(38 + ((index * 7) % 58), 1);
  return {
    id: `st-${index + 1}`,
    name: `${cityInfo.city} PowerHub ${String(index + 1).padStart(3, "0")}`,
    city: cityInfo.city,
    address: `${18 + index}, ${cityInfo.city} Tech Corridor`,
    status,
    coordinates: {
      latitude: round(cityInfo.lat + ((index % 9) - 4) * 0.018, 5),
      longitude: round(cityInfo.lng + ((index % 7) - 3) * 0.021, 5),
    },
    connectorTypes: connectorSets[index % connectorSets.length] ?? ["CCS2"],
    capacityKw: 60 + (index % 6) * 30,
    totalConnectors,
    availableConnectors,
    utilization,
    revenue: round(52000 + index * 1375 + utilization * 120),
    energyDeliveredKwh: round(1800 + index * 42 + utilization * 15),
    healthScore: Math.max(55, 99 - (index % 41)),
    lastHeartbeat: isoDaysAgo(status === "offline" ? 2 : 0, 12),
  };
});

export const demoSessions: SessionDTO[] = Array.from({ length: 10000 }, (_, index) => {
  const station = demoStations[index % demoStations.length] ?? demoStations[0]!;
  const active = index < 24;
  const status = active ? "active" : index % 23 === 0 ? "failed" : index % 29 === 0 ? "cancelled" : "completed";
  const energyKwh = round(12 + (index % 40) * 1.35);
  const durationMinutes = 20 + (index % 130);
  return {
    id: `sess-${index + 1}`,
    stationId: station.id,
    stationName: station.name,
    city: station.city,
    vehicle: vehicles[index % vehicles.length] ?? "Tata Nexon EV",
    connectorType: station.connectorTypes[index % station.connectorTypes.length] ?? "CCS2",
    status,
    energyKwh,
    durationMinutes,
    cost: round(energyKwh * (14 + (index % 6))),
    startedAt: isoDaysAgo(index % 60, index % 24),
    endedAt: active ? undefined : isoDaysAgo(index % 60, (index % 24) + 2),
  };
});

export const demoNotifications: NotificationDTO[] = [
  {
    id: "not-1",
    type: "station_offline",
    severity: "critical",
    title: "Station offline",
    message: "Delhi PowerHub 003 stopped sending heartbeats.",
    stationId: "st-3",
    read: false,
    createdAt: isoDaysAgo(0, 12),
  },
  {
    id: "not-2",
    type: "high_demand",
    severity: "warning",
    title: "High demand detected",
    message: "Bengaluru corridor utilization crossed 90%.",
    stationId: "st-1",
    read: false,
    createdAt: isoDaysAgo(0, 11),
  },
  {
    id: "not-3",
    type: "maintenance_due",
    severity: "warning",
    title: "Maintenance due",
    message: "Mumbai PowerHub 010 is due for connector inspection.",
    stationId: "st-10",
    read: true,
    createdAt: isoDaysAgo(1, 15),
  },
  {
    id: "not-4",
    type: "charging_completed",
    severity: "success",
    title: "Charging completed",
    message: "Session sess-12 completed successfully.",
    read: true,
    createdAt: isoDaysAgo(1, 18),
  },
  {
    id: "not-5",
    type: "new_operator",
    severity: "info",
    title: "New operator added",
    message: "Meera Iyer joined the western region operations team.",
    read: false,
    createdAt: isoDaysAgo(2, 10),
  },
];

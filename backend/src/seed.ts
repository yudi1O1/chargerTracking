import bcrypt from "bcryptjs";
import { connectDatabase, isDatabaseConnected } from "./config/database.js";
import { ChargingSessionModel } from "./models/ChargingSession.js";
import { NotificationModel } from "./models/Notification.js";
import { StationModel } from "./models/Station.js";
import { UserModel } from "./models/User.js";
import { demoNotifications, demoSessions, demoStations, demoUsers } from "./services/demoData.js";

async function seed(): Promise<void> {
  await connectDatabase();
  if (!isDatabaseConnected()) {
    throw new Error("MongoDB is required for seeding");
  }

  await Promise.all([
    UserModel.deleteMany({}),
    StationModel.deleteMany({}),
    ChargingSessionModel.deleteMany({}),
    NotificationModel.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash("Password123!", 12);
  await UserModel.insertMany(
    demoUsers.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      lastActiveAt: new Date(user.lastActiveAt),
      passwordHash,
    })),
  );

  const stations = await StationModel.insertMany(
    demoStations.map((station) => ({
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
      lastHeartbeat: new Date(station.lastHeartbeat),
      maintenanceHistory: [],
    })),
  );

  await ChargingSessionModel.insertMany(
    demoSessions.map((session, index) => ({
      stationId: stations[index % stations.length]?._id,
      stationName: session.stationName,
      city: session.city,
      vehicle: session.vehicle,
      connectorType: session.connectorType,
      status: session.status,
      energyKwh: session.energyKwh,
      durationMinutes: session.durationMinutes,
      cost: session.cost,
      startedAt: new Date(session.startedAt),
      endedAt: session.endedAt ? new Date(session.endedAt) : undefined,
    })),
  );

  await NotificationModel.insertMany(demoNotifications);
  console.log("Seed complete: users, stations, sessions, and notifications inserted.");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


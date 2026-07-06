import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { isAllowedOrigin } from "../config/cors.js";
import { isDatabaseConnected } from "../config/database.js";
import { ChargingSessionModel } from "../models/ChargingSession.js";
import { NotificationModel } from "../models/Notification.js";
import { StationModel } from "../models/Station.js";
import { demoNotifications, demoSessions, demoStations } from "../services/demoData.js";
import { toNotificationDTO, toSessionDTO, toStationDTO } from "../services/dtoMappers.js";

async function emitLatestSnapshot(socketOrServer: Pick<Server, "emit">): Promise<void> {
  if (!isDatabaseConnected()) {
    const notification = demoNotifications[0];
    const session = demoSessions[0];
    const station = demoStations[0];

    if (notification) {
      socketOrServer.emit("notification:new", notification);
    }
    if (session) {
      socketOrServer.emit("session:update", session);
    }
    if (station) {
      socketOrServer.emit("station:update", station);
    }
    return;
  }

  const [notification, session, station] = await Promise.all([
    NotificationModel.findOne({}).sort({ createdAt: -1 }),
    ChargingSessionModel.findOne({}).sort({ startedAt: -1 }),
    StationModel.findOne({}).sort({ updatedAt: -1 }),
  ]);

  if (notification) {
    socketOrServer.emit("notification:new", toNotificationDTO(notification));
  }
  if (session) {
    socketOrServer.emit("session:update", toSessionDTO(session));
  }
  if (station) {
    socketOrServer.emit("station:update", toStationDTO(station));
  }
}

export function createSocketServer(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => callback(null, isAllowedOrigin(origin)),
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    void emitLatestSnapshot(socket);
  });

  setInterval(() => {
    void emitLatestSnapshot(io);
  }, 15000);

  return io;
}

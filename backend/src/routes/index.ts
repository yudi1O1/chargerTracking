import { Router } from "express";
import { analyticsRoutes } from "./analyticsRoutes.js";
import { authRoutes } from "./authRoutes.js";
import { dashboardRoutes } from "./dashboardRoutes.js";
import { notificationRoutes } from "./notificationRoutes.js";
import { sessionRoutes } from "./sessionRoutes.js";
import { settingsRoutes } from "./settingsRoutes.js";
import { stationRoutes } from "./stationRoutes.js";
import { userRoutes } from "./userRoutes.js";

export const apiRoutes = Router();

apiRoutes.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", service: "evision-api" } });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/dashboard", dashboardRoutes);
apiRoutes.use("/stations", stationRoutes);
apiRoutes.use("/sessions", sessionRoutes);
apiRoutes.use("/analytics", analyticsRoutes);
apiRoutes.use("/notifications", notificationRoutes);
apiRoutes.use("/users", userRoutes);
apiRoutes.use("/settings", settingsRoutes);


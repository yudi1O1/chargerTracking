import { Router } from "express";
import { listNotifications, markNotificationRead } from "../controllers/notificationController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const notificationRoutes = Router();

notificationRoutes.get("/", authenticate, asyncHandler(listNotifications));
notificationRoutes.patch("/:id/read", authenticate, authorize(["admin", "operator"]), asyncHandler(markNotificationRead));


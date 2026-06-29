import { Router } from "express";
import { exportSessions, getSession, listSessions } from "../controllers/sessionController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const sessionRoutes = Router();

sessionRoutes.get("/", authenticate, asyncHandler(listSessions));
sessionRoutes.get("/export", authenticate, authorize(["admin", "operator"]), asyncHandler(exportSessions));
sessionRoutes.get("/:id", authenticate, asyncHandler(getSession));


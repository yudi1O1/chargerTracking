import { Router } from "express";
import { getDashboard } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const dashboardRoutes = Router();

dashboardRoutes.get("/", authenticate, asyncHandler(getDashboard));


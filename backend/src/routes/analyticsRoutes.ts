import { Router } from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const analyticsRoutes = Router();

analyticsRoutes.get("/", authenticate, asyncHandler(getAnalytics));


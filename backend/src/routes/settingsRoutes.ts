import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settingsController.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const settingsRoutes = Router();

settingsRoutes.get("/", authenticate, asyncHandler(getSettings));
settingsRoutes.patch("/", authenticate, asyncHandler(updateSettings));


import { Router } from "express";
import { createStation, deleteStation, getStation, listStations, updateStation } from "../controllers/stationController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const stationRoutes = Router();

stationRoutes.get("/", authenticate, asyncHandler(listStations));
stationRoutes.get("/:id", authenticate, asyncHandler(getStation));
stationRoutes.post("/", authenticate, authorize(["admin", "operator"]), asyncHandler(createStation));
stationRoutes.patch("/:id", authenticate, authorize(["admin", "operator"]), asyncHandler(updateStation));
stationRoutes.delete("/:id", authenticate, authorize(["admin"]), asyncHandler(deleteStation));


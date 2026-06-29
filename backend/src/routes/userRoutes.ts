import { Router } from "express";
import { listUsers, updateUser } from "../controllers/userController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const userRoutes = Router();

userRoutes.get("/", authenticate, authorize(["admin"]), asyncHandler(listUsers));
userRoutes.patch("/:id", authenticate, authorize(["admin"]), asyncHandler(updateUser));


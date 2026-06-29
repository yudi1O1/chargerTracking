import { Router } from "express";
import { login, logout, me, refresh } from "../controllers/authController.js";
import { authenticate } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";

export const authRoutes = Router();

authRoutes.post("/login", asyncHandler(login));
authRoutes.post("/refresh", asyncHandler(refresh));
authRoutes.post("/logout", authenticate, asyncHandler(logout));
authRoutes.get("/me", authenticate, asyncHandler(me));


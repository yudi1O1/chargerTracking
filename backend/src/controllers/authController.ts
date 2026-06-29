import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import { isDatabaseConnected } from "../config/database.js";
import { UserModel } from "../models/User.js";
import { signTokenPair, verifyRefreshToken } from "../services/tokenService.js";
import { loginSchema } from "../validators/common.js";
import { HttpError, sendSuccess } from "../utils/http.js";

export async function login(req: Request, res: Response): Promise<void> {
  const payload = loginSchema.parse(req.body);

  if (!isDatabaseConnected()) {
    throw new HttpError(503, "MongoDB connection is required for login");
  }

  const user = await UserModel.findOne({ email: payload.email.toLowerCase(), status: "active" });
  if (!user || !(await bcrypt.compare(payload.password, user.passwordHash))) {
    throw new HttpError(401, "Invalid email or password");
  }
  const authUser = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
  sendSuccess(res, { user: authUser, ...signTokenPair(authUser) });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = String(req.body.refreshToken ?? "");
  if (!token) {
    throw new HttpError(400, "Refresh token is required");
  }
  const user = verifyRefreshToken(token);
  sendSuccess(res, { user, ...signTokenPair(user) });
}

export async function me(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    throw new HttpError(401, "Authentication required");
  }
  sendSuccess(res, req.user);
}

export async function logout(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, { loggedOut: true });
}

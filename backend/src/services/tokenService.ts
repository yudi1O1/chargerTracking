import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import type { AuthUser } from "../types.js";

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function signTokenPair(user: AuthUser): TokenPair {
  const payload = { sub: user.id, name: user.name, email: user.email, role: user.role };
  return {
    accessToken: jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"] }),
    refreshToken: jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"] }),
  };
}

export function verifyAccessToken(token: string): AuthUser {
  const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
  if (typeof payload === "string" || !payload.sub || !payload.email || !payload.role || !payload.name) {
    throw new Error("Invalid token payload");
  }
  return {
    id: String(payload.sub),
    name: String(payload.name),
    email: String(payload.email),
    role: payload.role as AuthUser["role"],
  };
}

export function verifyRefreshToken(token: string): AuthUser {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
  if (typeof payload === "string" || !payload.sub || !payload.email || !payload.role || !payload.name) {
    throw new Error("Invalid token payload");
  }
  return {
    id: String(payload.sub),
    name: String(payload.name),
    email: String(payload.email),
    role: payload.role as AuthUser["role"],
  };
}

import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http.js";
import { verifyAccessToken } from "../services/tokenService.js";
import type { UserRole } from "../types.js";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    next(new HttpError(401, "Authentication required"));
    return;
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new HttpError(401, "Invalid or expired token"));
  }
}

export function authorize(roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new HttpError(401, "Authentication required"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new HttpError(403, "You do not have permission to perform this action"));
      return;
    }
    next();
  };
}


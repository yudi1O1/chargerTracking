import type { Request, Response } from "express";
import { UserModel } from "../models/User.js";
import { toAuthUserDTO } from "../services/dtoMappers.js";
import { paginationSchema } from "../validators/common.js";
import { HttpError, sendSuccess } from "../utils/http.js";

export async function listUsers(req: Request, res: Response): Promise<void> {
  const query = paginationSchema.parse(req.query);
  const filter: Record<string, unknown> = {};

  if (query.search) {
    const search = new RegExp(query.search, "i");
    filter.$or = [{ name: search }, { email: search }];
  }
  if (query.role) {
    filter.role = query.role;
  }

  const skip = (query.page - 1) * query.limit;
  const [users, total] = await Promise.all([
    UserModel.find(filter).sort({ name: 1 }).skip(skip).limit(query.limit),
    UserModel.countDocuments(filter),
  ]);

  sendSuccess(res, users.map(toAuthUserDTO), { total, page: query.page, limit: query.limit });
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!user) {
    throw new HttpError(404, "User not found");
  }
  sendSuccess(res, toAuthUserDTO(user));
}

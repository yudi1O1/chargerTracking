import type { Request, Response } from "express";
import { NotificationModel } from "../models/Notification.js";
import { toNotificationDTO } from "../services/dtoMappers.js";
import { paginationSchema } from "../validators/common.js";
import { HttpError, sendSuccess } from "../utils/http.js";

export async function listNotifications(req: Request, res: Response): Promise<void> {
  const query = paginationSchema.parse(req.query);
  const skip = (query.page - 1) * query.limit;
  const [notifications, total] = await Promise.all([
    NotificationModel.find({}).sort({ createdAt: -1 }).skip(skip).limit(query.limit),
    NotificationModel.countDocuments({}),
  ]);

  sendSuccess(res, notifications.map(toNotificationDTO), { total, page: query.page, limit: query.limit });
}

export async function markNotificationRead(req: Request, res: Response): Promise<void> {
  const notification = await NotificationModel.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  if (!notification) {
    throw new HttpError(404, "Notification not found");
  }
  sendSuccess(res, toNotificationDTO(notification));
}

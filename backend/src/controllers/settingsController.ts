import type { Request, Response } from "express";
import { sendSuccess } from "../utils/http.js";

const defaultSettings = {
  theme: "system",
  emailNotifications: true,
  pushNotifications: true,
  stationAlerts: true,
  sessionAlerts: true,
};

export async function getSettings(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, defaultSettings);
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
  sendSuccess(res, { ...defaultSettings, ...req.body });
}


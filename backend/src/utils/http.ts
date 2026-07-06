import type { Response } from "express";

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

type ApiMeta = Record<string, string | number | boolean | null>;

export function sendSuccess<T>(res: Response, data: T, meta?: ApiMeta): void {
  res.json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  });
}

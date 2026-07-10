import { env } from "./env.js";

const configuredOrigins = env.CLIENT_ORIGIN
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const localDevOrigin =
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export function isAllowedOrigin(origin?: string): boolean {
  // Allow requests without an Origin header
  // (e.g., Postman, curl, health checks)
  if (!origin) {
    return true;
  }

  // Explicitly configured origins
  if (configuredOrigins.includes(origin)) {
    return true;
  }

  // Allow localhost only during development
  if (
    env.NODE_ENV !== "production" &&
    localDevOrigin.test(origin)
  ) {
    return true;
  }

  return false;
}

export function resolveCorsOrigin(
  origin: string | undefined,
  callback: (error: Error | null, allow?: boolean) => void
): void {
  if (isAllowedOrigin(origin)) {
    callback(null, true);
    return;
  }

  callback(
    new Error(
      `CORS policy violation: Origin '${origin ?? "unknown"}' is not allowed.`
    )
  );
}
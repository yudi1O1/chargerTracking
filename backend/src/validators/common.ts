import { z } from "zod";

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  city: z.string().optional(),
  role: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const stationSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  address: z.string().min(4),
  status: z.enum(["available", "busy", "offline", "maintenance"]),
  latitude: z.number(),
  longitude: z.number(),
  connectorTypes: z.array(z.string()).min(1),
  capacityKw: z.number().positive(),
  totalConnectors: z.number().int().positive(),
  availableConnectors: z.number().int().nonnegative(),
});


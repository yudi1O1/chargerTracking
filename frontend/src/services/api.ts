import axios from "axios";
import type { AnalyticsData, ApiResponse, ChargingSession, DashboardData, Notification, Station, User } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("evision.accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

async function getData<T>(url: string, params?: Record<string, string | number | undefined>): Promise<ApiResponse<T>> {
  const response = await api.get<ApiResponse<T>>(url, { params });
  return response.data;
}

export const authApi = {
  login: async (payload: { email: string; password: string }) => {
    const response = await api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>("/auth/login", payload);
    return response.data.data;
  },
  me: async () => getData<User>("/auth/me"),
};

export const dashboardApi = {
  get: async () => getData<DashboardData>("/dashboard"),
};

export const stationApi = {
  list: async (params?: Record<string, string | number | undefined>) => getData<Station[]>("/stations", params),
  detail: async (id: string) => getData<Station>(`/stations/${id}`),
};

export const sessionApi = {
  list: async (params?: Record<string, string | number | undefined>) => getData<ChargingSession[]>("/sessions", params),
};

export const analyticsApi = {
  get: async () => getData<AnalyticsData>("/analytics"),
};

export const notificationApi = {
  list: async () => getData<Notification[]>("/notifications"),
};

export const userApi = {
  list: async (params?: Record<string, string | number | undefined>) => getData<User[]>("/users", params),
};

export const settingsApi = {
  get: async () => getData<Record<string, boolean | string>>("/settings"),
  update: async (payload: Record<string, boolean | string>) => {
    const response = await api.patch<ApiResponse<Record<string, boolean | string>>>("/settings", payload);
    return response.data;
  },
};


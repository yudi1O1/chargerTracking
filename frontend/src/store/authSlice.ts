"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    restoreUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.accessToken = typeof window !== "undefined" ? window.localStorage.getItem("evision.accessToken") : null;
      state.refreshToken = typeof window !== "undefined" ? window.localStorage.getItem("evision.refreshToken") : null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
  },
});

export const { logout, restoreUser, setCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;


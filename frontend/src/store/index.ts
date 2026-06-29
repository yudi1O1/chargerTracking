"use client";

import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./authSlice";
import { notificationReducer } from "./notificationSlice";
import { themeReducer } from "./themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


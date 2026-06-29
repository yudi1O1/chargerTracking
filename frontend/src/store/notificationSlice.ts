"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "@/types";

interface NotificationState {
  items: Notification[];
}

const initialState: NotificationState = {
  items: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    pushNotification: (state, action: PayloadAction<Notification>) => {
      if (!state.items.some((item) => item.id === action.payload.id)) {
        state.items.unshift(action.payload);
      }
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload;
    },
  },
});

export const { pushNotification, setNotifications } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;

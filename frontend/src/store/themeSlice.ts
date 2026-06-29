"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ThemeState {
  mode: "light" | "dark" | "system";
}

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: "system" } as ThemeState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeState["mode"]>) => {
      state.mode = action.payload;
    },
  },
});

export const { setThemeMode } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;

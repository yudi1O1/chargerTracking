"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/store";

export function useAppSelector<T>(selector: (state: RootState) => T): T {
  return useSelector(selector);
}


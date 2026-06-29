"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { restoreUser } from "@/store/authSlice";
import { authApi } from "@/services/api";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = window.localStorage.getItem("evision.accessToken");
    if (!token) {
      router.replace("/login");
      return;
    }

    authApi
      .me()
      .then((response) => dispatch(restoreUser(response.data)))
      .catch(() => {
        window.localStorage.removeItem("evision.accessToken");
        window.localStorage.removeItem("evision.refreshToken");
        router.replace("/login");
      })
      .finally(() => setReady(true));
  }, [dispatch, router]);

  if (!ready && !user) {
    return <div className="flex min-h-screen items-center justify-center bg-background text-foreground">Loading EVision...</div>;
  }

  return <>{children}</>;
}


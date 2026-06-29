"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BatteryCharging } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { authApi } from "@/services/api";
import { setCredentials } from "@/store/authSlice";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "admin@evision.dev",
      password: "Password123!",
    },
  });

  async function onSubmit(values: LoginValues) {
    setError(null);
    const response = await authApi.login(values).catch(() => null);
    if (!response) {
      setError("Invalid credentials. Use admin@evision.dev / Password123! for the seeded admin.");
      return;
    }
    window.localStorage.setItem("evision.accessToken", response.accessToken);
    window.localStorage.setItem("evision.refreshToken", response.refreshToken);
    dispatch(setCredentials(response));
    router.replace("/dashboard");
  }

  return (
    <Card className="w-full max-w-md">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <BatteryCharging />
        </span>
        <div>
          <h1 className="text-2xl font-bold">EVision</h1>
          <p className="text-sm text-muted-foreground">Charging network management</p>
        </div>
      </div>
      <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <label className="text-sm font-medium" htmlFor="email">
            Email
          </label>
          <Input id="email" type="email" {...form.register("email")} />
          <p className="mt-1 text-xs text-destructive">{form.formState.errors.email?.message}</p>
        </div>
        <div>
          <label className="text-sm font-medium" htmlFor="password">
            Password
          </label>
          <Input id="password" type="password" {...form.register("password")} />
          <p className="mt-1 text-xs text-destructive">{form.formState.errors.password?.message}</p>
        </div>
        {error ? <p className="rounded-md bg-red-500/10 p-3 text-sm text-red-500">{error}</p> : null}
        <Button className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <div className="mt-6 rounded-md bg-muted p-3 text-xs text-muted-foreground">
        Demo roles: admin@evision.dev, operator@evision.dev, viewer@evision.dev. Password: Password123!
      </div>
    </Card>
  );
}


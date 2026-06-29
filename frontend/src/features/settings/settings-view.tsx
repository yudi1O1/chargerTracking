"use client";

import { useTheme } from "next-themes";
import { Bell, Moon, UserCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";

export function SettingsView() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <PageHeader title="Settings" description="Theme, profile, and notification preferences." />
      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <Moon className="mb-4 text-primary" />
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="mt-1 text-sm text-muted-foreground">Choose the console appearance.</p>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {["light", "dark", "system"].map((item) => (
              <button
                key={item}
                className={`rounded-md border px-3 py-2 text-sm capitalize ${theme === item ? "bg-primary text-primary-foreground" : ""}`}
                onClick={() => setTheme(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <Bell className="mb-4 text-primary" />
          <h2 className="text-lg font-semibold">Notifications</h2>
          <div className="mt-5 space-y-3">
            {["Station alerts", "Session alerts", "Maintenance alerts", "Demand alerts"].map((item) => (
              <label key={item} className="flex items-center justify-between rounded-md border p-3 text-sm">
                {item}
                <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary" />
              </label>
            ))}
          </div>
        </Card>
        <Card>
          <UserCircle className="mb-4 text-primary" />
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage operator identity from the profile page.</p>
        </Card>
      </div>
    </>
  );
}


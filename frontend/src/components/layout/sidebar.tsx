"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BatteryCharging } from "lucide-react";
import { navigationItems } from "@/constants/navigation";
import { useAppSelector } from "@/hooks/useAppSelector";
import { cn } from "@/utils/cn";

export function Sidebar() {
  const pathname = usePathname();
  const role = useAppSelector((state) => state.auth.user?.role);

  return (
    <aside className="hidden w-72 shrink-0 border-r bg-card/80 p-4 lg:block">
      <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-2 py-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <BatteryCharging size={22} />
        </span>
        <span>
          <span className="block text-lg font-bold">EVision</span>
          <span className="text-xs text-muted-foreground">Network Ops Console</span>
        </span>
      </Link>
      <nav className="mt-8 space-y-1">
        {navigationItems
          .filter((item) => !item.hidden && (!item.adminOnly || role === "admin"))
          .map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  active && "bg-primary/10 text-primary",
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}


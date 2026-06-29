"use client";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { useAppSelector } from "@/hooks/useAppSelector";

export default function ProfilePage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>
      <PageHeader title="Profile" description="Your EVision account and access level." />
      <Card className="max-w-xl">
        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-primary text-2xl font-bold text-primary-foreground">
          {user?.name?.slice(0, 1) ?? "E"}
        </div>
        <h2 className="mt-5 text-xl font-semibold">{user?.name}</h2>
        <p className="text-muted-foreground">{user?.email}</p>
        <div className="mt-5 rounded-md border p-4 text-sm">
          Role: <span className="font-semibold capitalize">{user?.role}</span>
        </div>
      </Card>
    </>
  );
}


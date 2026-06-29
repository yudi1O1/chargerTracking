"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { notificationApi } from "@/services/api";
import { getSocket } from "@/services/socket";
import { pushNotification, setNotifications } from "@/store/notificationSlice";
import type { Notification } from "@/types";
import { formatDate } from "@/utils/format";

export function NotificationsView() {
  const dispatch = useAppDispatch();
  const liveNotifications = useAppSelector((state) => state.notifications.items);
  const { data } = useQuery({ queryKey: ["notifications"], queryFn: notificationApi.list });

  useEffect(() => {
    if (data?.data) {
      dispatch(setNotifications(data.data));
    }
  }, [data, dispatch]);

  useEffect(() => {
    const socket = getSocket();
    const handler = (notification: Notification) => dispatch(pushNotification(notification));
    socket.on("notification:new", handler);
    return () => {
      socket.off("notification:new", handler);
    };
  }, [dispatch]);

  return (
    <>
      <PageHeader title="Notifications" description="Real-time alerts for station health, sessions, maintenance, and demand." />
      <div className="grid gap-4 xl:grid-cols-[.7fr_1.3fr]">
        <Card>
          <div className="flex items-center gap-3">
            <span className="rounded-md bg-primary/10 p-3 text-primary">
              <Bell />
            </span>
            <div>
              <p className="text-3xl font-semibold">{liveNotifications.filter((item) => !item.read).length}</p>
              <p className="text-sm text-muted-foreground">Unread alerts</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="space-y-3">
            {liveNotifications.map((notification) => (
              <div key={notification.id} className="flex items-start justify-between gap-4 rounded-md border p-4">
                <div>
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p>
                </div>
                <Badge tone={notification.severity === "critical" ? "red" : notification.severity === "warning" ? "orange" : notification.severity === "success" ? "green" : "blue"}>
                  {notification.severity}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}


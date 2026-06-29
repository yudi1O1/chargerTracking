"use client";

import { useQuery } from "@tanstack/react-query";
import { Activity, BatteryCharging, IndianRupee, Leaf, Timer, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { dashboardApi } from "@/services/api";
import { formatCurrency, formatDate, formatNumber } from "@/utils/format";

export function DashboardView() {
  const { data, isLoading } = useQuery({ queryKey: ["dashboard"], queryFn: dashboardApi.get });
  const dashboard = data?.data;

  const kpis = dashboard
    ? [
        { label: "Total Stations", value: dashboard.kpis.totalStations, icon: BatteryCharging },
        { label: "Online Stations", value: dashboard.kpis.onlineStations, icon: Activity },
        { label: "Offline Stations", value: dashboard.kpis.offlineStations, icon: Activity },
        { label: "Live Sessions", value: dashboard.kpis.chargingSessions, icon: Zap },
        { label: "Revenue", value: formatCurrency(dashboard.kpis.revenue), icon: IndianRupee },
        { label: "Energy Delivered", value: `${formatNumber(dashboard.kpis.energyDelivered)} kWh`, icon: BatteryCharging },
        { label: "Carbon Saved", value: `${formatNumber(dashboard.kpis.carbonSaved)} kg`, icon: Leaf },
        { label: "Avg Charge Time", value: `${dashboard.kpis.averageChargingTime} min`, icon: Timer },
      ]
    : [];

  return (
    <>
      <PageHeader title="Dashboard" description="Real-time operating posture across the EVision charging network." />
      {isLoading ? <Card>Loading operational telemetry...</Card> : null}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-semibold">{kpi.value}</p>
                </div>
                <span className="rounded-md bg-primary/10 p-2 text-primary">
                  <Icon size={20} />
                </span>
              </div>
            </Card>
          );
        })}
      </section>
      <section className="mt-6 grid gap-4 xl:grid-cols-[1fr_1.1fr]">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Recent Alerts</h2>
          <div className="space-y-3">
            {dashboard?.recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between gap-4 rounded-md border p-3">
                <div>
                  <p className="font-medium">{alert.title}</p>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <Badge tone={alert.severity === "critical" ? "red" : alert.severity === "warning" ? "orange" : "blue"}>{alert.severity}</Badge>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Recent Charging Sessions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="pb-3">Station</th>
                  <th className="pb-3">Vehicle</th>
                  <th className="pb-3">Energy</th>
                  <th className="pb-3">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dashboard?.recentSessions.map((session) => (
                  <tr key={session.id}>
                    <td className="py-3">{session.stationName}</td>
                    <td className="py-3">{session.vehicle}</td>
                    <td className="py-3">{session.energyKwh} kWh</td>
                    <td className="py-3">{formatDate(session.startedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
      <section className="mt-6">
        <Card>
          <h2 className="mb-4 text-lg font-semibold">Top Performing Stations</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {dashboard?.topStations.map((station) => (
              <div key={station.id} className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{station.name}</p>
                  <Badge tone="green">{station.status}</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{station.city}</p>
                <div className="mt-4 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${station.utilization}%` }} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{station.utilization}% utilization</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </>
  );
}


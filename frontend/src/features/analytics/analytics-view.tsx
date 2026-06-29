"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { analyticsApi } from "@/services/api";

const colors = ["#14b8a6", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      <div className="h-72 min-h-72">{children}</div>
    </Card>
  );
}

export function AnalyticsView() {
  const { data, isLoading } = useQuery({ queryKey: ["analytics"], queryFn: analyticsApi.get });
  const analytics = data?.data;

  if (isLoading || !analytics) {
    return (
      <>
        <PageHeader title="Analytics" description="Performance, utilization, revenue, and energy insights." />
        <Card>Loading analytics...</Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Analytics" description="Performance, utilization, revenue, and energy insights." />
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Revenue Trend">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.revenueTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="revenue" stroke="#14b8a6" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Energy Consumption">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.energyConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area dataKey="energy" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.18} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Charging Sessions">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.sessions}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sessions" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Station Utilization">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.utilization} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="station" type="category" width={110} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="utilization" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Charging Success Rate">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.successRate}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" />
              <YAxis domain={[85, 100]} />
              <Tooltip />
              <Line dataKey="rate" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.revenueVsEnergy}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Connector Distribution">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={analytics.connectorDistribution} dataKey="value" nameKey="name" outerRadius={96} label>
                {analytics.connectorDistribution.map((entry, index) => (
                  <Cell key={entry.name} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </>
  );
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { Download, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { sessionApi } from "@/services/api";
import { formatCurrency, formatDate } from "@/utils/format";

export function SessionsView() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({ queryKey: ["sessions", search], queryFn: () => sessionApi.list({ search, limit: 50 }) });
  const sessions = data?.data ?? [];

  return (
    <>
      <PageHeader
        title="Charging Sessions"
        description="Live and historical charging activity across the network."
        action={
          <Button onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"}/sessions/export`, "_blank")}>
            <Download size={17} /> Export CSV
          </Button>
        }
      />
      <Card>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 text-muted-foreground" size={17} />
          <Input className="pl-10" placeholder="Search station or vehicle" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        {isLoading ? <p className="text-sm text-muted-foreground">Loading sessions...</p> : null}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">Station</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Energy</th>
                <th>Duration</th>
                <th>Cost</th>
                <th>Started</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sessions.map((session) => (
                <tr key={session.id}>
                  <td className="py-3">{session.stationName}</td>
                  <td>{session.vehicle}</td>
                  <td>
                    <Badge tone={session.status === "active" ? "green" : session.status === "completed" ? "blue" : "red"}>{session.status}</Badge>
                  </td>
                  <td>{session.energyKwh} kWh</td>
                  <td>{session.durationMinutes} min</td>
                  <td>{formatCurrency(session.cost)}</td>
                  <td>{formatDate(session.startedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}


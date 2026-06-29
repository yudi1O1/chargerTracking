"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, MapPin, Plus, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/layout/page-header";
import { stationApi } from "@/services/api";
import { formatCurrency, formatDate } from "@/utils/format";
import type { StationStatus } from "@/types";

const Map = dynamic(() => import("./station-map").then((module) => module.StationMap), {
  ssr: false,
  loading: () => <Card className="h-[420px] md:h-[520px]">Loading station map...</Card>,
});

const statuses: Array<StationStatus | "all"> = ["all", "available", "busy", "offline", "maintenance"];
const pageSize = 12;

function stationTone(status: StationStatus): "green" | "orange" | "red" | "blue" {
  return status === "available" ? "green" : status === "busy" ? "orange" : status === "offline" ? "red" : "blue";
}

export function StationsView() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StationStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const mapParams = useMemo(() => ({ search: search || undefined, status: status === "all" ? undefined : status, limit: 100 }), [search, status]);
  const queryParams = useMemo(
    () => ({ search: search || undefined, status: status === "all" ? undefined : status, page, limit: pageSize }),
    [page, search, status],
  );
  const { data, isLoading } = useQuery({ queryKey: ["stations", queryParams], queryFn: () => stationApi.list(queryParams) });
  const { data: mapData } = useQuery({ queryKey: ["stations", "map", mapParams], queryFn: () => stationApi.list(mapParams) });
  const { data: stationDetail } = useQuery({
    queryKey: ["station", selectedStationId],
    queryFn: () => stationApi.detail(selectedStationId!),
    enabled: Boolean(selectedStationId),
  });
  const stations = data?.data ?? [];
  const mapStations = mapData?.data ?? stations;
  const total = data?.meta?.total ?? stations.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const selectedStation = stationDetail?.data ?? stations.find((station) => station.id === selectedStationId);

  useEffect(() => {
    setPage(1);
  }, [search, status]);

  return (
    <>
      <PageHeader
        title="Charging Stations"
        description="Search, filter, monitor, and manage charging infrastructure."
        action={
          <Button>
            <Plus size={17} /> Add station
          </Button>
        }
      />
      <Card className="mb-6">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-muted-foreground" size={17} />
            <Input className="pl-10" placeholder="Search by station name or city" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((item) => (
              <button
                key={item}
                className={`rounded-md border px-3 py-2 text-sm capitalize ${status === item ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground"}`}
                onClick={() => {
                  setStatus(item);
                  setSelectedStationId(null);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <Map stations={mapStations} />
        <Card className="min-h-[420px] md:min-h-[520px]">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Station Details</h2>
              <p className="text-sm text-muted-foreground">Select a row to inspect capacity, health, and location.</p>
            </div>
            <MapPin className="mt-1 text-muted-foreground" size={20} />
          </div>
          {selectedStation ? (
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{selectedStation.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedStation.address}</p>
                  </div>
                  <Badge tone={stationTone(selectedStation.status)}>{selectedStation.status}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Heartbeat {formatDate(selectedStation.lastHeartbeat)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground">Connectors</p>
                  <p className="font-semibold">{selectedStation.availableConnectors}/{selectedStation.totalConnectors} open</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground">Capacity</p>
                  <p className="font-semibold">{selectedStation.capacityKw} kW</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground">Utilization</p>
                  <p className="font-semibold">{selectedStation.utilization}%</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="text-muted-foreground">Revenue</p>
                  <p className="font-semibold">{formatCurrency(selectedStation.revenue)}</p>
                </div>
              </div>
              <div className="rounded-md border p-3 text-sm">
                <p className="text-muted-foreground">Connector types</p>
                <p className="font-semibold">{selectedStation.connectorTypes.join(", ")}</p>
              </div>
            </div>
          ) : (
            <div className="flex h-72 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              No station selected
            </div>
          )}
        </Card>
      </div>
      <Card className="mt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Charging Station Inventory</h2>
            <p className="text-sm text-muted-foreground">{total} stations match the current filters.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="h-9 px-3" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              <ChevronLeft size={16} /> Previous
            </Button>
            <span className="min-w-20 text-center text-sm text-muted-foreground">Page {page} of {totalPages}</span>
            <Button className="h-9 px-3" disabled={page === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}>
              Next <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b text-xs uppercase text-muted-foreground">
              <tr>
                <th className="py-3 pr-4 font-semibold">Station</th>
                <th className="px-4 py-3 font-semibold">City</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Connectors</th>
                <th className="px-4 py-3 font-semibold">Utilization</th>
                <th className="px-4 py-3 font-semibold">Revenue</th>
                <th className="py-3 pl-4 font-semibold">Heartbeat</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="py-6 text-muted-foreground" colSpan={7}>Loading stations...</td>
                </tr>
              ) : null}
              {!isLoading && stations.length === 0 ? (
                <tr>
                  <td className="py-6 text-muted-foreground" colSpan={7}>No stations found.</td>
                </tr>
              ) : null}
              {stations.map((station) => (
                <tr
                  key={station.id}
                  role="button"
                  aria-label={`Open details for ${station.name}`}
                  tabIndex={0}
                  className={`cursor-pointer border-b transition hover:bg-muted/60 ${selectedStationId === station.id ? "bg-muted" : ""}`}
                  onClick={() => setSelectedStationId(station.id)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedStationId(station.id);
                    }
                  }}
                >
                  <td className="py-3 pr-4">
                    <p className="font-medium">{station.name}</p>
                    <p className="text-xs text-muted-foreground">{station.capacityKw} kW</p>
                  </td>
                  <td className="px-4 py-3">{station.city}</td>
                  <td className="px-4 py-3">
                    <Badge tone={stationTone(station.status)}>{station.status}</Badge>
                  </td>
                  <td className="px-4 py-3">{station.availableConnectors}/{station.totalConnectors}</td>
                  <td className="px-4 py-3">{station.utilization}%</td>
                  <td className="px-4 py-3">{formatCurrency(station.revenue)}</td>
                  <td className="py-3 pl-4 text-muted-foreground">{formatDate(station.lastHeartbeat)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

"use client";

import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from "react-leaflet";
import type { Station } from "@/types";
import { Badge } from "@/components/ui/badge";

type Coordinates = { latitude: number; longitude: number };

const markerIcon = (color: string) =>
  L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:999px;background:${color};border:3px solid white;box-shadow:0 6px 18px rgba(0,0,0,.25)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });

const statusColor = {
  available: "#10b981",
  busy: "#f59e0b",
  offline: "#ef4444",
  maintenance: "#3b82f6",
};

const currentLocationIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:18px;height:18px;border-radius:999px;background:#0ea5e9;border:4px solid white;box-shadow:0 0 0 8px rgba(14,165,233,.18),0 8px 24px rgba(0,0,0,.25)"></span>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

function ResizeMap({ stations }: { stations: Station[] }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map, stations.length]);

  return null;
}

export function StationMap({ stations }: { stations: Station[] }) {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const center = currentLocation ?? stations[0]?.coordinates ?? { latitude: 20.5937, longitude: 78.9629 };
  const route = useMemo(
    () => stations.slice(0, 4).map((station) => [station.coordinates.latitude, station.coordinates.longitude] as [number, number]),
    [stations],
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => undefined,
      { enableHighAccuracy: false, maximumAge: 300000, timeout: 5000 },
    );
  }, []);

  return (
    <div className="h-[420px] overflow-hidden rounded-lg border md:h-[520px]">
      <MapContainer center={[center.latitude, center.longitude]} zoom={5} zoomControl scrollWheelZoom className="h-full w-full">
        <ResizeMap stations={stations} />
        <TileLayer attribution="&copy; OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {currentLocation ? (
          <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={currentLocationIcon}>
            <Popup>
              <p className="font-semibold">Current location</p>
            </Popup>
          </Marker>
        ) : null}
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.coordinates.latitude, station.coordinates.longitude]}
            icon={markerIcon(statusColor[station.status])}
          >
            <Popup>
              <div className="min-w-52 space-y-2">
                <p className="font-semibold">{station.name}</p>
                <p className="text-sm">{station.address}</p>
                <Badge tone={station.status === "available" ? "green" : station.status === "busy" ? "orange" : station.status === "offline" ? "red" : "blue"}>
                  {station.status}
                </Badge>
                <p className="text-sm">{station.availableConnectors}/{station.totalConnectors} connectors available</p>
                <p className="text-sm">{station.capacityKw} kW capacity</p>
              </div>
            </Popup>
          </Marker>
        ))}
        {route.length > 1 ? <Polyline positions={route} color="#14b8a6" weight={3} dashArray="8 10" /> : null}
        <Circle center={[center.latitude, center.longitude]} radius={45000} pathOptions={{ color: "#14b8a6", fillOpacity: 0.08 }} />
      </MapContainer>
    </div>
  );
}

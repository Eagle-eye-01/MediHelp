"use client";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { useGeolocation } from "@/hooks/use-geolocation";

type UserLocation = {
  latitude: number;
  longitude: number;
};

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

const userMarkerIcon = L.divIcon({
  className: "medihelp-user-marker",
  html: `
    <div style="position:relative;width:22px;height:22px;">
      <span style="position:absolute;inset:-8px;border-radius:9999px;background:rgba(239,68,68,0.22);"></span>
      <span style="position:absolute;inset:0;border-radius:9999px;background:#ef4444;border:4px solid white;box-shadow:0 10px 24px rgba(239,68,68,0.4);"></span>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11]
});

export default function MapView({
  points,
  userLocation
}: {
  points: Array<{
    id: string;
    label: string;
    lat: number;
    lng: number;
  }>;
  userLocation?: UserLocation | null;
}) {
  const { location } = useGeolocation();
  const activeLocation = userLocation || location;
  const center = activeLocation
    ? [activeLocation.latitude, activeLocation.longitude]
    : [12.9716, 77.5946];

  return (
    <MapContainer center={center as [number, number]} scrollWheelZoom={false} zoom={11}>
      <RecenterMap center={center as [number, number]} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {activeLocation ? (
        <Marker icon={userMarkerIcon} position={[activeLocation.latitude, activeLocation.longitude]}>
          <Popup>Your current location</Popup>
        </Marker>
      ) : null}
      {points.map((point) => (
        <Marker icon={markerIcon} key={point.id} position={[point.lat, point.lng]}>
          <Popup>{point.label}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

function RecenterMap({
  center
}: {
  center: [number, number];
}) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [center, map]);

  return null;
}

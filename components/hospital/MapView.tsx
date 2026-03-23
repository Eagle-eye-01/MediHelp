"use client";

import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

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
  const fallbackCenter: [number, number] = points.length
    ? [
        points.reduce((sum, point) => sum + point.lat, 0) / points.length,
        points.reduce((sum, point) => sum + point.lng, 0) / points.length
      ]
    : [12.9716, 77.5946];
  const center: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : fallbackCenter;

  return (
    <MapContainer center={center as [number, number]} scrollWheelZoom={false} zoom={11}>
      <FitMapToContent points={points} userLocation={userLocation} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocation ? (
        <Marker icon={userMarkerIcon} position={[userLocation.latitude, userLocation.longitude]}>
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

function FitMapToContent({
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
  const map = useMap();

  useEffect(() => {
    const targets = [
      ...points.map((point) => [point.lat, point.lng] as [number, number]),
      ...(userLocation ? ([[userLocation.latitude, userLocation.longitude]] as [number, number][]) : [])
    ];

    if (!targets.length) {
      map.setView([12.9716, 77.5946], 11);
      return;
    }

    if (targets.length === 1) {
      map.setView(targets[0], userLocation ? 12 : 11);
      return;
    }

    map.fitBounds(L.latLngBounds(targets), {
      animate: false,
      padding: [24, 24]
    });
  }, [map, points, userLocation]);

  return null;
}

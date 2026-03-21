"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { useGeolocation } from "@/hooks/use-geolocation";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

export default function MapView({
  points
}: {
  points: Array<{
    id: string;
    label: string;
    lat: number;
    lng: number;
  }>;
}) {
  const { location } = useGeolocation();
  const center = location
    ? [location.latitude, location.longitude]
    : [12.9716, 77.5946];

  return (
    <MapContainer center={center as [number, number]} scrollWheelZoom={false} zoom={11}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {location ? (
        <Marker icon={markerIcon} position={[location.latitude, location.longitude]}>
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

"use client";

import { useEffect, useState } from "react";

interface GeolocationState {
  latitude: number;
  longitude: number;
}

export function useGeolocation() {
  const [location, setLocation] = useState<GeolocationState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported on this device.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        setError("Location permission was denied. Showing Bangalore by default.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  }, []);

  return {
    location,
    error
  };
}

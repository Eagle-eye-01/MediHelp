"use client";

import { useEffect, useState } from "react";

type Coordinates = {
  latitude: number;
  longitude: number;
  accuracy: number | null;
};

type UseGeolocationOptions = PositionOptions & {
  immediate?: boolean;
};

export function useGeolocation({
  immediate = false,
  enableHighAccuracy = true,
  timeout = 10000,
  maximumAge = 0
}: UseGeolocationOptions = {}) {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported in this browser.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy ?? null
        });
        setLoading(false);
      },
      (positionError) => {
        setError(positionError.message || "Unable to fetch your location.");
        setLoading(false);
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );
  };

  useEffect(() => {
    if (immediate) {
      requestLocation();
    }
    // `requestLocation` is intentionally not in deps to avoid repeated prompts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [immediate, enableHighAccuracy, timeout, maximumAge]);

  return {
    coords,
    loading,
    error,
    requestLocation
  };
}

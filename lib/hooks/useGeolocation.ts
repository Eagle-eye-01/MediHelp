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

function formatGeolocationError(positionError: GeolocationPositionError) {
  switch (positionError.code) {
    case positionError.PERMISSION_DENIED:
      return "Location access is blocked. You can keep browsing nearby results or try again after closing any app overlays.";
    case positionError.POSITION_UNAVAILABLE:
      return "Your device could not determine a live location right now.";
    case positionError.TIMEOUT:
      return "Live location timed out. You can continue with nearby results or try again.";
    default:
      return positionError.message || "Unable to fetch your location.";
  }
}

export function useGeolocation({
  immediate = false,
  enableHighAccuracy = true,
  timeout = 10000,
  maximumAge = 0
}: UseGeolocationOptions = {}) {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);
  const supported = typeof navigator !== "undefined" && "geolocation" in navigator;

  const requestLocation = () => {
    if (!supported) {
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
        setError(formatGeolocationError(positionError));
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
    supported,
    requestLocation
  };
}

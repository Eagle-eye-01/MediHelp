"use client";

import { useEffect, useMemo, useState } from "react";

import { FilterPanel } from "@/components/hospital/FilterPanel";
import { LocationMap } from "@/components/hospital/LocationMap";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { LabCard } from "@/components/labs/LabCard";
import { TestList } from "@/components/labs/TestList";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { calculateDistanceKm, formatCoordinates, formatDistanceKm } from "@/lib/utils";
import type { LabWithTests } from "@/types";

const NEARBY_LAB_RADIUS_KM = 25;
const MAX_NEARBY_LABS = 6;

export function LabsExplorer({
  labs
}: {
  labs: LabWithTests[];
}) {
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedLabId, setSelectedLabId] = useState(labs[0]?.id || "");
  const { coords, loading: locationLoading, error: locationError } = useGeolocation({ immediate: true });

  const filteredLabs = useMemo(() => {
    const rankedLabs = labs
      .filter((lab) =>
        typeFilter
          ? lab.tests.some((test) => test.test_type.toLowerCase() === typeFilter.toLowerCase())
          : true
      )
      .map((lab) => ({
        ...lab,
        distanceKm: coords
          ? calculateDistanceKm(coords.latitude, coords.longitude, lab.coordinates.lat, lab.coordinates.lng)
          : null
      }))
      .sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null && a.distanceKm !== b.distanceKm) {
          return a.distanceKm - b.distanceKm;
        }

        const cheapestA = Math.min(...a.tests.map((test) => test.price));
        const cheapestB = Math.min(...b.tests.map((test) => test.price));

        if (cheapestA !== cheapestB) {
          return cheapestA - cheapestB;
        }

        return b.rating - a.rating;
      });

    if (!coords) {
      return rankedLabs.slice(0, MAX_NEARBY_LABS);
    }

    const nearbyLabs = rankedLabs.filter(
      (lab) => lab.distanceKm != null && lab.distanceKm <= NEARBY_LAB_RADIUS_KM
    );

    return nearbyLabs.slice(0, MAX_NEARBY_LABS);
  }, [coords, labs, typeFilter]);

  const selectedLab = filteredLabs.find((lab) => lab.id === selectedLabId) || filteredLabs[0];

  useEffect(() => {
    if (!filteredLabs.some((lab) => lab.id === selectedLabId)) {
      setSelectedLabId(filteredLabs[0]?.id || "");
    }
  }, [filteredLabs, selectedLabId]);

  return (
    <div className="space-y-4">
      <LocationMap
        points={filteredLabs.map((lab) => ({
          id: lab.id,
          label: lab.name,
          lat: lab.coordinates.lat,
          lng: lab.coordinates.lng
        }))}
        title="Nearby labs and your location"
        userLocation={coords}
      />
        <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4">
          <p className="text-sm font-semibold text-slate-950">Live recommendation status</p>
          <p className="mt-2 text-sm text-slate-600">
            {coords
            ? `Using your live location (${formatCoordinates(coords.latitude, coords.longitude)}) to show labs within ${NEARBY_LAB_RADIUS_KM} km of you.`
            : locationLoading
              ? "Detecting your live location to find nearby labs."
              : locationError || "Location permission not available. Showing the strongest default lab matches only."}
          </p>
        </div>
      <div className="flex h-full flex-col gap-4 lg:flex-row">
        <div className="w-full flex-shrink-0 lg:w-64">
          <FilterPanel description="Choose the test type you need." title="Lab Filters">
            <div className="space-y-2">
              <Label>Type of test</Label>
              <select
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm sm:h-10"
                onChange={(event) => setTypeFilter(event.target.value)}
                value={typeFilter}
              >
                <option value="">All types</option>
                <option value="Blood">Blood</option>
                <option value="Imaging">Imaging</option>
                <option value="Hormone">Hormone</option>
                <option value="Vitamin">Vitamin</option>
                <option value="Cardiac">Cardiac</option>
              </select>
            </div>
          </FilterPanel>
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row">
          <div className="w-full space-y-4 overflow-y-auto sm:w-2/5 lg:w-1/3">
            {filteredLabs.length ? (
              filteredLabs.map((lab, index) => (
                <LabCard
                  active={selectedLab?.id === lab.id}
                  distanceKm={lab.distanceKm}
                  key={lab.id}
                  lab={lab}
                  onClick={() => setSelectedLabId(lab.id)}
                  recommended={Boolean(coords) && index === 0}
                />
              ))
            ) : (
              <EmptyState
                description={
                  coords
                    ? "No labs matched both your test filter and nearby radius. Try another test type."
                    : "No labs matched the current filter. Try another test type."
                }
                title="No nearby labs found"
              />
            )}
          </div>
          <div className="min-w-0 flex-1 overflow-y-auto">
            {selectedLab ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{selectedLab.name}</h2>
                      <p className="mt-2 text-sm text-slate-500">{selectedLab.location}</p>
                    </div>
                    {selectedLab.distanceKm != null ? (
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                        {formatDistanceKm(selectedLab.distanceKm)}
                      </div>
                    ) : null}
                  </div>
                </div>
                <TestList labName={selectedLab.name} tests={selectedLab.tests} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

import { FilterPanel } from "@/components/hospital/FilterPanel";
import { LocationMap } from "@/components/hospital/LocationMap";
import { EmptyState } from "@/components/ui/empty-state";
import { Label } from "@/components/ui/label";
import { LabCard } from "@/components/labs/LabCard";
import { TestList } from "@/components/labs/TestList";
import type { LabWithTests } from "@/types";

export function LabsExplorer({
  labs
}: {
  labs: LabWithTests[];
}) {
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedLabId, setSelectedLabId] = useState(labs[0]?.id || "");

  const filteredLabs = useMemo(() => {
    return labs
      .filter((lab) =>
        typeFilter
          ? lab.tests.some((test) => test.test_type.toLowerCase() === typeFilter.toLowerCase())
          : true
      )
      .sort((a, b) => {
        const cheapestA = Math.min(...a.tests.map((test) => test.price));
        const cheapestB = Math.min(...b.tests.map((test) => test.price));

        if (cheapestA !== cheapestB) {
          return cheapestA - cheapestB;
        }

        return b.rating - a.rating;
      });
  }, [labs, typeFilter]);

  const selectedLab = filteredLabs.find((lab) => lab.id === selectedLabId) || filteredLabs[0];

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
      />
      <div className="flex flex-col lg:flex-row gap-4 h-full">
        <div className="w-full lg:w-64 flex-shrink-0">
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
        <div className="flex flex-col sm:flex-row flex-1 gap-4 min-w-0">
          <div className="w-full sm:w-2/5 lg:w-1/3 overflow-y-auto space-y-4">
            {filteredLabs.length ? (
              filteredLabs.map((lab) => (
                <LabCard
                  active={selectedLab?.id === lab.id}
                  key={lab.id}
                  lab={lab}
                  onClick={() => setSelectedLabId(lab.id)}
                />
              ))
            ) : (
              <EmptyState
                description="Try a different test type to see more matching labs."
                title="No labs found"
              />
            )}
          </div>
          <div className="flex-1 min-w-0 overflow-y-auto">
            {selectedLab ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-5">
                  <h2 className="text-lg font-semibold text-slate-900">{selectedLab.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">{selectedLab.location}</p>
                </div>
                <TestList tests={selectedLab.tests} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

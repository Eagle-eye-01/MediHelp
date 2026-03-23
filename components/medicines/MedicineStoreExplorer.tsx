"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { MedicineSearch } from "@/components/medicines/MedicineSearch";
import { PharmacyCard } from "@/components/medicines/PharmacyCard";
import { EmptyState } from "@/components/ui/empty-state";
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { calculateDistanceKm, fileToBase64, formatCoordinates } from "@/lib/utils";
import type { MedicineStore } from "@/types";

const NEARBY_MEDICINE_RADIUS_KM = 20;
const MAX_NEARBY_MEDICINE_STORES = 6;

const STORE_COORDINATE_OVERRIDES: Record<string, { lat: number; lng: number }> = {
  "SRM Care Pharmacy": { lat: 12.8226, lng: 80.0436 },
  "Guduvanchery MediMart": { lat: 12.8434, lng: 80.0588 },
  "Chengalpattu Wellness Pharmacy": { lat: 12.6912, lng: 79.9787 },
  "Tambaram Health Pharmacy": { lat: 12.9251, lng: 80.1160 },
  "Urapakkam Family Pharmacy": { lat: 12.8674, lng: 80.0694 }
};

export function MedicineStoreExplorer({
  stores
}: {
  stores: MedicineStore[];
}) {
  const [query, setQuery] = useState("");
  const [ocrMedicines, setOcrMedicines] = useState<string[]>([]);
  const { coords, loading: locationLoading, error: locationError } = useGeolocation({ immediate: true });

  const effectiveQuery = query || ocrMedicines[0] || "";

  const filteredStores = useMemo(() => {
    const normalized = effectiveQuery.toLowerCase();

    const rankedStores = [...stores]
      .map((store) => {
        const coordinates = store.coordinates || STORE_COORDINATE_OVERRIDES[store.name];
        return {
          ...store,
          coordinates,
          distanceKm:
            coords && coordinates
              ? calculateDistanceKm(coords.latitude, coords.longitude, coordinates.lat, coordinates.lng)
              : null
        };
      })
      .filter((store) =>
        normalized
          ? store.medicines.some(
              (medicine) =>
                medicine.name.toLowerCase().includes(normalized) && medicine.available
            )
          : true
      )
      .sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null && a.distanceKm !== b.distanceKm) {
          return a.distanceKm - b.distanceKm;
        }

        const aPrice =
          a.medicines.find((medicine) =>
            normalized ? medicine.name.toLowerCase().includes(normalized) : medicine.available
          )?.price || Number.MAX_SAFE_INTEGER;
        const bPrice =
          b.medicines.find((medicine) =>
            normalized ? medicine.name.toLowerCase().includes(normalized) : medicine.available
          )?.price || Number.MAX_SAFE_INTEGER;

        return aPrice - bPrice;
      });

    if (!coords) {
      return rankedStores.slice(0, MAX_NEARBY_MEDICINE_STORES);
    }

    const nearbyStores = rankedStores.filter(
      (store) => store.distanceKm != null && store.distanceKm <= NEARBY_MEDICINE_RADIUS_KM
    );

    return nearbyStores.slice(0, MAX_NEARBY_MEDICINE_STORES);
  }, [coords, effectiveQuery, stores]);

  async function handleUpload(file: File) {
    try {
      const base64 = await fileToBase64(file);
      const response = await fetch("/api/ai/prescription-ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          base64,
          mimeType: file.type
        })
      });
      const data = await response.json();
      setOcrMedicines(data.medicines || []);
      if (data.medicines?.length) {
        toast.success(`Found ${data.medicines.length} medicines from the prescription`);
      }
    } catch {
      toast.error("Unable to read prescription image");
    }
  }

  return (
    <div className="min-w-0 overflow-x-hidden flex flex-col gap-6">
      <div className="rounded-2xl border border-emerald-100 bg-white px-5 py-4">
        <p className="text-sm font-semibold text-slate-950">Live recommendation status</p>
        <p className="mt-2 text-sm text-slate-600">
          {coords
            ? `Using your live location (${formatCoordinates(coords.latitude, coords.longitude)}) to show pharmacies within ${NEARBY_MEDICINE_RADIUS_KM} km of you.`
            : locationLoading
              ? "Detecting your live location to find nearby pharmacies."
              : locationError || "Location permission not available. Showing the strongest default pharmacy matches only."}
        </p>
      </div>
      <MedicineSearch onChange={setQuery} onUpload={handleUpload} value={query} />
      {ocrMedicines.length ? (
        <div className="flex flex-wrap gap-2 overflow-hidden">
          {ocrMedicines.map((medicine) => (
            <button
              className="max-w-full truncate rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-primary active:scale-95"
              key={medicine}
              onClick={() => setQuery(medicine)}
            >
              {medicine}
            </button>
          ))}
        </div>
      ) : null}
      {filteredStores.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store, index) => (
            <PharmacyCard
              distanceKm={store.distanceKm}
              key={store.id}
              medicineName={effectiveQuery}
              recommended={Boolean(coords) && index === 0}
              store={store}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description={
            coords
              ? "No nearby pharmacies matched that medicine within your current area. Try another medicine name or upload a clearer prescription."
              : "No pharmacies matched that medicine. Try another medicine name or upload a clearer prescription."
          }
          title="No nearby stores found"
        />
      )}
    </div>
  );
}

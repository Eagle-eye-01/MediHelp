"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { MedicineSearch } from "@/components/medicines/MedicineSearch";
import { PharmacyCard } from "@/components/medicines/PharmacyCard";
import { EmptyState } from "@/components/ui/empty-state";
import { fileToBase64 } from "@/lib/utils";
import type { MedicineStore } from "@/types";

export function MedicineStoreExplorer({
  stores
}: {
  stores: MedicineStore[];
}) {
  const [query, setQuery] = useState("");
  const [ocrMedicines, setOcrMedicines] = useState<string[]>([]);

  const effectiveQuery = query || ocrMedicines[0] || "";

  const filteredStores = useMemo(() => {
    const normalized = effectiveQuery.toLowerCase();

    return [...stores]
      .filter((store) =>
        normalized
          ? store.medicines.some(
              (medicine) =>
                medicine.name.toLowerCase().includes(normalized) && medicine.available
            )
          : true
      )
      .sort((a, b) => {
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
  }, [effectiveQuery, stores]);

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
    <div className="flex flex-col gap-6">
      <MedicineSearch onChange={setQuery} onUpload={handleUpload} value={query} />
      {ocrMedicines.length ? (
        <div className="flex flex-wrap gap-2">
          {ocrMedicines.map((medicine) => (
            <button
              className="rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-primary active:scale-95"
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
          {filteredStores.map((store) => (
            <PharmacyCard key={store.id} medicineName={effectiveQuery} store={store} />
          ))}
        </div>
      ) : (
        <EmptyState
          description="Try a different medicine name or upload a clearer prescription image."
          title="No stores found"
        />
      )}
    </div>
  );
}

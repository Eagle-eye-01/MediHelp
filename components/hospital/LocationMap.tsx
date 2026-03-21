"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/hospital/MapView"), { ssr: false });

export function LocationMap({
  points,
  title
}: {
  title: string;
  points: Array<{
    id: string;
    label: string;
    lat: number;
    lng: number;
  }>;
}) {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-100 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="h-48 w-full sm:h-64 lg:h-80">
        <MapView points={points} />
      </div>
    </div>
  );
}

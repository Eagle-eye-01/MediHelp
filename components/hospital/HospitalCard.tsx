import { BedDouble, MapPin, Phone, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HospitalWithDoctors } from "@/types";

export function HospitalCard({
  hospital,
  active,
  onClick,
  distanceKm,
  recommended = false
}: {
  hospital: HospitalWithDoctors;
  active: boolean;
  onClick: () => void;
  distanceKm?: number | null;
  recommended?: boolean;
}) {
  return (
    <Card
      className={`flex cursor-pointer flex-col gap-3 p-4 hover:shadow-md active:scale-95 ${
        active ? "border-blue-200 bg-blue-50/60" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{hospital.name}</h3>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            {hospital.location}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge>{hospital.specializations[0]}</Badge>
          {distanceKm != null ? (
            <Badge className={recommended ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-600"}>
              {distanceKm.toFixed(1)} km
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="grid gap-2 text-sm text-slate-600">
        {recommended ? (
          <p className="font-medium text-blue-700">Recommended from your live location</p>
        ) : null}
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          {hospital.contact}
        </p>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <span className="flex items-center gap-2">
            <BedDouble className="h-4 w-4 text-primary" />
            {hospital.bed_vacancy} beds open
          </span>
          <span className="flex items-center gap-1 font-medium text-amber-600">
            <Star className="h-4 w-4 fill-current" />
            {hospital.rating}
          </span>
        </div>
      </div>
    </Card>
  );
}

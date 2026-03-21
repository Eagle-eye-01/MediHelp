import { BedDouble, MapPin, Phone, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { HospitalWithDoctors } from "@/types";

export function HospitalCard({
  hospital,
  active,
  onClick
}: {
  hospital: HospitalWithDoctors;
  active: boolean;
  onClick: () => void;
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
        <Badge>{hospital.specializations[0]}</Badge>
      </div>
      <div className="grid gap-2 text-sm text-slate-600">
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

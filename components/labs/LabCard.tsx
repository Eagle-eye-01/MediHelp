import { Calendar, MapPin, Phone, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { LabWithTests } from "@/types";
import { formatDate } from "@/lib/utils";

const VERIFIED_PARTNERS = new Set(["Precision Labs", "CureQuest Diagnostics", "Zenith Path Labs"]);

export function LabCard({
  lab,
  active,
  onClick
}: {
  lab: LabWithTests;
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
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">{lab.name}</h3>
          {VERIFIED_PARTNERS.has(lab.name) ? (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Verified Partner</Badge>
          ) : null}
        </div>
        <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="h-4 w-4" />
          {lab.location}
        </p>
      </div>
      <div className="grid gap-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          {lab.contact}
        </p>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
          <span>{lab.vacancy} slots open</span>
          <span className="flex items-center gap-1 font-medium text-amber-600">
            <Star className="h-4 w-4 fill-current" />
            {lab.rating}
          </span>
        </div>
        <p className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Available {formatDate(lab.date_available)}
        </p>
      </div>
    </Card>
  );
}

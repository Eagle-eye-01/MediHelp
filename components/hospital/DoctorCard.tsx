import { BriefcaseMedical, Phone, Trophy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Doctor } from "@/types";

export function DoctorCard({
  doctor,
  onBook
}: {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}) {
  return (
    <Card className="flex flex-col gap-3 p-4">
      <div>
        <h3 className="text-base font-semibold text-slate-900">{doctor.name}</h3>
        <p className="text-sm text-slate-500">{doctor.specialization}</p>
      </div>
      <div className="grid gap-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <BriefcaseMedical className="h-4 w-4 text-primary" />
          {doctor.experience_years} years experience
        </p>
        <p className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          {doctor.success_rate}% success rate
        </p>
        <p className="flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          {doctor.contact}
        </p>
      </div>
      <Button onClick={() => onBook(doctor)}>Book Appointment</Button>
    </Card>
  );
}

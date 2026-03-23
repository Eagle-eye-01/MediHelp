import { MapPin, Pill, Sparkles } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { InternalPageHeader } from "@/components/layout/internal-page-header";
import { MedicationReminderWorkspace } from "@/components/medicines/medication-reminder-workspace";
import { MedicineStoreExplorer } from "@/components/medicines/MedicineStoreExplorer";
import { Badge } from "@/components/ui/badge";
import { getCurrentUserProfile, getMedicineStores } from "@/lib/data";

export default async function MedicinesPage() {
  const [{ profile }, stores] = await Promise.all([getCurrentUserProfile(), getMedicineStores()]);

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-8 pb-10">
        <InternalPageHeader
          actions={
            <div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-white bg-white/90 p-4">
                  <Pill className="h-5 w-5 text-blue-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">Readable results</p>
                </div>
                <div className="rounded-[22px] border border-white bg-white/90 p-4">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">AI prescription OCR</p>
                </div>
                <div className="rounded-[22px] border border-white bg-white/90 p-4">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">Nearby pickup options</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="bg-blue-50 text-blue-700">Sort by best price</Badge>
                <Badge className="bg-emerald-50 text-emerald-700">Contact stores directly</Badge>
                <Badge className="bg-indigo-50 text-indigo-700">Prescription upload supported</Badge>
              </div>
            </div>
          }
          description="Look up medicines directly or upload a prescription for AI-assisted extraction, then compare pharmacies with clear pricing and availability."
          eyebrow="Medicine search"
          title="Search prescriptions in one focused flow."
        />
        <MedicationReminderWorkspace />
        <MedicineStoreExplorer stores={stores} />
      </div>
    </AppShell>
  );
}

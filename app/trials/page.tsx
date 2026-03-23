import { BrainCircuit, Globe2, Stethoscope } from "lucide-react";

import { PlanGate } from "@/components/PlanGate";
import { AppShell } from "@/components/layout/app-shell";
import { InternalPageHeader } from "@/components/layout/internal-page-header";
import { PartnerProgramBanner } from "@/components/trials/partner-program-banner";
import { TrialsExplorer } from "@/components/trials/TrialsExplorer";
import { Badge } from "@/components/ui/badge";
import { getCurrentUserProfile } from "@/lib/data";
import { cityOptions, languageOptions } from "@/lib/mock-data";

export default async function TrialsPage() {
  const { profile } = await getCurrentUserProfile();

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-8 pb-10">
        <InternalPageHeader
          actions={
            <div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[22px] border border-white bg-white/90 p-4">
                  <BrainCircuit className="h-5 w-5 text-indigo-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">AI matching</p>
                </div>
                <div className="rounded-[22px] border border-white bg-white/90 p-4">
                  <Globe2 className="h-5 w-5 text-blue-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">Local language support</p>
                </div>
                <div className="rounded-[22px] border border-white bg-white/90 p-4">
                  <Stethoscope className="h-5 w-5 text-emerald-600" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">Care-aware filtering</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge className="bg-indigo-50 text-indigo-700">Condition match scoring</Badge>
                <Badge className="bg-blue-50 text-blue-700">City-based search</Badge>
                <Badge className="bg-emerald-50 text-emerald-700">English, Tamil, Hindi</Badge>
              </div>
            </div>
          }
          description="Search by condition, city, age, and language to surface relevant trials in a way that feels guided and understandable."
          eyebrow="Clinical trial finder"
          title="Find studies that match the care journey you are already on."
        />
        <PartnerProgramBanner />
        <PlanGate feature="AI Clinical Trial Matching" requiredPlan="premium">
          <TrialsExplorer cities={cityOptions} languages={languageOptions} />
        </PlanGate>
      </div>
    </AppShell>
  );
}

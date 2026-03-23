import { AppShell } from "@/components/layout/app-shell";
import { HospitalExplorer } from "@/components/hospital/HospitalExplorer";
import { InternalPageHeader } from "@/components/layout/internal-page-header";
import { getCurrentUserProfile, getHospitals, getUserDocuments } from "@/lib/data";

export default async function HospitalPage() {
  const [{ profile }, hospitals, documents] = await Promise.all([
    getCurrentUserProfile(),
    getHospitals(),
    getUserDocuments(3)
  ]);
  const recentSummaries = documents.map((document) => document.ai_summary).filter(Boolean);

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-8 pb-10">
        <InternalPageHeader
          actions={
            <div className="rounded-[24px] border border-blue-100 bg-white/90 p-4">
              <p className="text-sm font-semibold text-slate-950">Booking context</p>
              <p className="mt-2 text-sm text-slate-600">
                Your last three AI summaries are ready to attach when you request an appointment.
              </p>
            </div>
          }
          description="Compare nearby hospitals, review specializations, and book the right doctor without leaving the same care flow."
          eyebrow="Hospital care"
          title="Choose care with the map, not guesswork."
        />
        <HospitalExplorer hospitals={hospitals} recentSummaries={recentSummaries} />
      </div>
    </AppShell>
  );
}

import { HospitalExplorer } from "@/components/hospital/HospitalExplorer";
import { AppShell } from "@/components/layout/AppShell";
import { getCurrentUserProfile, getHospitals, getUserDocuments } from "@/lib/data";

export default async function HospitalPage() {
  const [{ profile }, hospitals, documents] = await Promise.all([
    getCurrentUserProfile(),
    getHospitals(),
    getUserDocuments(3)
  ]);

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl">Hospitals and doctors</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Find nearby hospitals, review doctors, and send your recent medical history with one appointment request.
          </p>
        </div>
        <HospitalExplorer
          hospitals={hospitals}
          recentSummaries={documents.map((document) => document.ai_summary).filter(Boolean)}
        />
      </div>
    </AppShell>
  );
}

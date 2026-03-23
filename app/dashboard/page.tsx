import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getCurrentUserProfile, getHospitals, getUserDocuments } from "@/lib/data";

function buildTrendData(uploadDates: string[]) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });

  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const label = formatter.format(date);
    const uploads = uploadDates.filter((value) => {
      const uploadDate = new Date(value);
      return (
        uploadDate.getFullYear() === date.getFullYear() &&
        uploadDate.getMonth() === date.getMonth()
      );
    }).length;

    return { label, uploads };
  });
}

export default async function DashboardPage() {
  const [{ profile }, documents, hospitals] = await Promise.all([
    getCurrentUserProfile(),
    getUserDocuments(),
    getHospitals()
  ]);

  const summaries = documents.map((document) => document.ai_summary).filter(Boolean);
  const conditionsTracked = new Set(
    documents.map((document) => document.disease_name).filter(Boolean)
  ).size;
  const trendData = buildTrendData(documents.map((document) => document.upload_date));

  return (
    <div className="space-y-8 pb-10">
      <DashboardOverview
        conditionsTracked={conditionsTracked}
        documentsCount={documents.length}
        hospitalsNearby={hospitals.length}
        lastUploadDate={documents[0]?.upload_date}
        name={profile?.name || "MediHelp User"}
        summaries={summaries}
        trendData={trendData}
      />
    </div>
  );
}

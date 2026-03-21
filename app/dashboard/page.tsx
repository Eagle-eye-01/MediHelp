import { AppShell } from "@/components/layout/AppShell";
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { HealthSummaryCard } from "@/components/dashboard/HealthSummaryCard";
import { HealthTrendChart } from "@/components/dashboard/HealthTrendChart";
import { PersonalDetailsAlert } from "@/components/dashboard/PersonalDetailsAlert";
import { QuickLinkButton } from "@/components/dashboard/QuickLinkButton";
import { getCurrentUserProfile, getUserDocuments } from "@/lib/data";

export default async function DashboardPage() {
  const [{ profile }, documents] = await Promise.all([getCurrentUserProfile(), getUserDocuments()]);

  const chartBuckets = documents.reduce<Record<string, number>>((accumulator, document) => {
    const key = new Date(document.upload_date).toLocaleDateString("en-IN", {
      month: "short",
      day: "2-digit"
    });
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  const chartData = Object.entries(chartBuckets).map(([date, uploads]) => ({
    date,
    uploads
  }));

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="flex flex-col gap-4 sm:gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl">MediHelp Health Summary</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Track your medical records, act on AI suggestions, and move quickly when you need care.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <HealthSummaryCard
            lastUploadDate={documents[0]?.upload_date}
            totalDocuments={documents.length}
          />
          <AIInsightsCard summaries={documents.map((document) => document.ai_summary).filter(Boolean)} />
          <PersonalDetailsAlert missingDob={!profile?.dob} name={profile?.name} />
        </div>
        <div className="w-full">
          <HealthTrendChart data={chartData} />
        </div>
        <div className="flex flex-wrap gap-3">
          <QuickLinkButton href="/hospital" label="Hospital" />
          <QuickLinkButton href="/labs" label="Labs" />
          <QuickLinkButton href="/medicines" label="Medicine Store" />
        </div>
      </div>
    </AppShell>
  );
}

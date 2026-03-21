import { AppShell } from "@/components/layout/AppShell";
import { LabsExplorer } from "@/components/labs/LabsExplorer";
import { getCurrentUserProfile, getLabs } from "@/lib/data";

export default async function LabsPage() {
  const [{ profile }, labs] = await Promise.all([getCurrentUserProfile(), getLabs()]);

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl">Labs and tests</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Compare labs by availability, pricing, and ratings, then drill into tests and reviews.
          </p>
        </div>
        <LabsExplorer labs={labs} />
      </div>
    </AppShell>
  );
}

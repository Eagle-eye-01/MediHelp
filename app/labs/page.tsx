import { AppShell } from "@/components/layout/app-shell";
import { InternalPageHeader } from "@/components/layout/internal-page-header";
import { LabsExplorer } from "@/components/labs/LabsExplorer";
import { getCurrentUserProfile, getLabs } from "@/lib/data";

export default async function LabsPage() {
  const [{ profile }, labs] = await Promise.all([getCurrentUserProfile(), getLabs()]);

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-8 pb-10">
        <InternalPageHeader
          actions={
            <div className="rounded-[24px] border border-emerald-100 bg-white/90 p-4">
              <p className="text-sm font-semibold text-slate-950">What improves here</p>
              <p className="mt-2 text-sm text-slate-600">
                Clear map placement, readable test cards, and easier sorting for the cheapest available options.
              </p>
            </div>
          }
          description="See nearby labs on the map, compare prices, and choose the best slot without bouncing through disconnected screens."
          eyebrow="Labs & diagnostics"
          title="Browse diagnostics through a real location-first view."
        />
        <LabsExplorer labs={labs} />
      </div>
    </AppShell>
  );
}

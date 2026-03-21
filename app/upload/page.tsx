import { UploadWorkspace } from "@/components/documents/UploadWorkspace";
import { AppShell } from "@/components/layout/AppShell";
import { getCurrentUserProfile } from "@/lib/data";

export default async function UploadPage() {
  const { profile, userId } = await getCurrentUserProfile();

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl">Upload medical documents</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Add reports and prescriptions so Gemini can extract names, conditions, and summaries.
          </p>
        </div>
        <UploadWorkspace userId={userId} />
      </div>
    </AppShell>
  );
}

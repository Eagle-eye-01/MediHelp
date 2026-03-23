import { AppShell } from "@/components/layout/app-shell";
import { InternalPageHeader } from "@/components/layout/internal-page-header";
import { UploadWorkspace } from "@/components/documents/UploadWorkspace";
import { getCurrentUserProfile, getUserDocuments } from "@/lib/data";

export default async function UploadPage() {
  const [{ profile, userId }, documents] = await Promise.all([
    getCurrentUserProfile(),
    getUserDocuments()
  ]);

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-8 pb-10">
        <InternalPageHeader
          actions={
            <div className="rounded-[24px] border border-blue-100 bg-white/92 p-4">
              <p className="text-sm font-semibold text-slate-950">Upload flow</p>
              <p className="mt-2 text-sm text-slate-600">
                Files are analyzed on upload and saved directly into your documents workspace.
              </p>
            </div>
          }
          description="Securely upload your reports, prescriptions, and scans. MediHelp will analyze them and save them directly to My Documents."
          eyebrow="Document intake"
          title="Upload Medical Documents"
        />
        <UploadWorkspace currentDocumentCount={documents.length} userId={userId} />
      </div>
    </AppShell>
  );
}

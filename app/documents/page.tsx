import { DocumentsManager } from "@/components/documents/DocumentsManager";
import { AppShell } from "@/components/layout/AppShell";
import { getCurrentUserProfile, getUserDocuments } from "@/lib/data";

export default async function DocumentsPage() {
  const [{ profile }, documents] = await Promise.all([getCurrentUserProfile(), getUserDocuments()]);

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl">Check & Edit Documents</h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Rename files, prepare a combined health summary, and mark images for compression.
          </p>
        </div>
        <DocumentsManager initialDocuments={documents} />
      </div>
    </AppShell>
  );
}

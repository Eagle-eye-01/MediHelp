import { AppShell } from "@/components/layout/app-shell";
import { InternalPageHeader } from "@/components/layout/internal-page-header";
import { DocumentsManager } from "@/components/documents/DocumentsManager";
import { getCurrentUserProfile, getUserDocuments } from "@/lib/data";

export default async function DocumentsPage() {
  const [{ profile }, documents] = await Promise.all([getCurrentUserProfile(), getUserDocuments()]);

  return (
    <AppShell email={profile?.email} name={profile?.name}>
      <div className="space-y-8 pb-12">
        <InternalPageHeader
          actions={
            <div className="rounded-[24px] border border-blue-100 bg-white/92 p-4">
              <p className="text-sm font-semibold text-slate-950">Document workspace</p>
              <p className="mt-2 text-sm text-slate-600">
                Rename, compress, summarize, and review every uploaded record from one place.
              </p>
            </div>
          }
          description="Manage all your medical records in one secure, readable workspace."
          eyebrow="Document vault"
          title="My Documents"
        />
        <DocumentsManager initialDocuments={documents} />
      </div>
    </AppShell>
  );
}

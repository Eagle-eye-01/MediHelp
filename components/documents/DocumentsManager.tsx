"use client";

import { Sparkles, FolderPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { UploadModal } from "@/components/documents/UploadModal";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { getDocumentPreview } from "@/lib/document-preview";
import { getMockPlan, PLAN_LIMITS, subscribeToMockPlan, type Plan } from "@/lib/mock-plan";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured } from "@/lib/supabase";
import { compressImageFile, extractStoragePathFromPublicUrl } from "@/lib/utils";
import type { MedicalDocument } from "@/types";

export function DocumentsManager({
  initialDocuments
}: {
  initialDocuments: MedicalDocument[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [renamingAll, setRenamingAll] = useState(false);
  const [activeDocument, setActiveDocument] = useState<MedicalDocument | null>(null);
  const [plan, setPlan] = useState<Plan>("free");

  const summaries = useMemo(() => documents.map((document) => document.ai_summary).filter(Boolean), [documents]);
  const activePreview = activeDocument ? getDocumentPreview(activeDocument) : null;

  useEffect(() => {
    setPlan(getMockPlan());
    return subscribeToMockPlan(setPlan);
  }, []);

  async function patchDocument(id: string, payload: Partial<MedicalDocument>) {
    const response = await fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Unable to save document.");
    }

    const data = await response.json();
    return data.document as MedicalDocument;
  }

  async function handleRename(id: string, value: string) {
    try {
      const document = await patchDocument(id, { file_name: value });
      setDocuments((current) => current.map((item) => (item.id === id ? document : item)));
      toast.success("Document name updated");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Rename failed");
    }
  }

  async function handleCompress(document: MedicalDocument, nextValue: boolean) {
    try {
      let payload: Partial<MedicalDocument> = {
        is_compressed: nextValue
      };

      if (nextValue && document.file_type.startsWith("image/") && isSupabaseConfigured()) {
        const supabase = createBrowserSupabaseClient();
        const fileResponse = await fetch(document.file_url);
        const blob = await fileResponse.blob();
        const compressed = await compressImageFile(new File([blob], document.original_name, { type: blob.type }));
        const storagePath = extractStoragePathFromPublicUrl(document.file_url);

        if (storagePath) {
          const { error } = await supabase.storage
            .from("medical-documents")
            .upload(storagePath, compressed, { upsert: true, contentType: compressed.type });

          if (error) {
            throw error;
          }

          payload = {
            ...payload,
            file_size: compressed.size
          };
        }
      }

      const updated = await patchDocument(document.id, payload);
      setDocuments((current) => current.map((item) => (item.id === document.id ? updated : item)));
      toast.success(nextValue ? "Compression flag updated" : "Compression removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Compression failed");
    }
  }

  async function handleRenameAll() {
    try {
      setRenamingAll(true);
      const response = await fetch("/api/documents/rename-all", {
        method: "POST"
      });

      if (!response.ok) {
        throw new Error("Unable to rename all documents.");
      }

      const data = await response.json();
      setDocuments(data.documents);
      toast.success("Documents renamed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "AI rename failed");
    } finally {
      setRenamingAll(false);
    }
  }

  async function handleSummary() {
    try {
      setLoadingSummary(true);
      setSummaryOpen(true);
      const response = await fetch("/api/ai/unified-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summaries })
      });
      const data = await response.json();
      setSummary(data.summary || "");
    } catch {
      setSummary("We could not generate a unified health overview right now.");
    } finally {
      setLoadingSummary(false);
    }
  }

  async function handleDelete(document: MedicalDocument) {
    try {
      const response = await fetch(`/api/documents/${document.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Unable to delete document.");
      }

      setDocuments((current) => current.filter((item) => item.id !== document.id));
      setActiveDocument((current) => (current?.id === document.id ? null : current));
      toast.success("Document removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Delete failed");
    }
  }

  if (!documents.length) {
    return (
      <>
        <EmptyState
          ctaHref="/upload"
          ctaLabel="Upload your first document"
          description="Add prescriptions, reports, and scans so MediHelp can organize and summarize them for you."
          title="No documents yet"
        />
        <UploadModal onClose={() => setUploadOpen(false)} open={uploadOpen} />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button className="w-full sm:w-auto" onClick={() => setUploadOpen(true)} variant="secondary">
            <FolderPlus className="h-4 w-4" />
            Add more files
          </Button>
          <Button className="w-full sm:w-auto" disabled={renamingAll} onClick={handleRenameAll} variant="outline">
            <Sparkles className="h-4 w-4" />
            AI Rename All
          </Button>
          <Button className="w-full sm:w-auto" onClick={handleSummary}>Prepare Summary</Button>
        </div>
        <DocumentGrid
          documents={documents}
          onCompress={handleCompress}
          onDelete={handleDelete}
          onOpen={setActiveDocument}
          onRename={handleRename}
        />
      </div>
      <ResponsiveModal
        description="Gemini combines your saved summaries into a quick overall overview."
        onClose={() => setSummaryOpen(false)}
        open={summaryOpen}
        title="Unified Health Summary"
      >
        <p className="text-sm leading-6 text-slate-600">
          {loadingSummary ? "Preparing your overall summary..." : summary || "No summary available yet."}
        </p>
      </ResponsiveModal>
      <ResponsiveModal
        description={activePreview?.subtitle}
        onClose={() => setActiveDocument(null)}
        open={Boolean(activeDocument)}
        title={activeDocument?.file_name || "Document preview"}
      >
        {activeDocument && activePreview ? (
          <div className="space-y-5">
            <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {activePreview.label}
                </span>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {activeDocument.patient_name}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {new Date(activeDocument.upload_date).toLocaleDateString("en-IN")}
                </span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {activePreview.highlights.map((item) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.25)]">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                    MediHelp document reader
                  </p>
                  <h4 className="mt-2 text-xl font-semibold text-slate-900">
                    {activeDocument.disease_name || "Medical record"}
                  </h4>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {activeDocument.file_type.includes("pdf") ? "PDF" : "Scan"}
                </span>
              </div>
              <div className="space-y-5">
                {activePreview.sections.map((section) => (
                  <section className="space-y-2" key={section.title}>
                    <h5 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
                      {section.title}
                    </h5>
                    <div className="space-y-2 text-sm leading-7 text-slate-700">
                      {section.lines.map((line) => (
                        <p key={line}>{line}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm leading-6 text-blue-900">
              <span className="font-semibold">AI summary:</span> {activeDocument.ai_summary || "No AI summary yet."}
            </div>
            {activeDocument.parsed_data ? (
              <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.25)]">
                {activeDocument.parsed_data.subtitle ? (
                  <p className="text-sm text-slate-500">{activeDocument.parsed_data.subtitle}</p>
                ) : null}

                <div className="flex flex-wrap gap-2">
                  {activeDocument.parsed_data.tags.map((tag) => (
                    <Badge className="bg-blue-50 text-blue-700" key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                  {activeDocument.parsed_data.patientName ? (
                    <Badge className="bg-emerald-50 text-emerald-700">{activeDocument.parsed_data.patientName}</Badge>
                  ) : null}
                  {activeDocument.parsed_data.date ? (
                    <span className="self-center text-sm text-slate-500">{activeDocument.parsed_data.date}</span>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeDocument.parsed_data.keyInsights.map((insight) => (
                    <Badge className="bg-slate-100 text-slate-700" key={insight}>
                      {insight}
                    </Badge>
                  ))}
                </div>

                <div className="rounded-[24px] border border-slate-200 p-4">
                  <p className="mb-1 text-xs uppercase tracking-[0.28em] text-slate-500">
                    MediHelp Document Reader
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-slate-950">
                      {activeDocument.parsed_data.title}
                    </h3>
                    <Badge variant="outline">
                      {activeDocument.file_type.includes("pdf") ? "PDF" : "SCAN"}
                    </Badge>
                  </div>
                  <hr className="my-3 border-slate-200" />
                  <div className="space-y-4">
                    {activeDocument.parsed_data.sections.map((section) => (
                      <div className="mt-4" key={section.heading}>
                        <p className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                          {section.heading}
                        </p>
                        <p className="text-sm leading-relaxed text-slate-700">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_45px_-35px_rgba(15,23,42,0.25)]">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    MediHelp Document Reader
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {PLAN_LIMITS[plan].aiTrialMatching
                      ? "Structured AI extraction is still being prepared for this document."
                      : "Upgrade to Premium to unlock structured AI parsing for this document."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-7 w-24 rounded-full" />
                  <Skeleton className="h-7 w-32 rounded-full" />
                    <Skeleton className="h-7 w-20 rounded-full" />
                  </div>
              </div>
            )}
          </div>
        ) : null}
      </ResponsiveModal>
      <UploadModal onClose={() => setUploadOpen(false)} open={uploadOpen} />
    </>
  );
}

"use client";

import { Sparkles, FolderPlus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DocumentGrid } from "@/components/documents/DocumentGrid";
import { UploadModal } from "@/components/documents/UploadModal";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
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

  const summaries = useMemo(() => documents.map((document) => document.ai_summary).filter(Boolean), [documents]);

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
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setUploadOpen(true)} variant="secondary">
            <FolderPlus className="h-4 w-4" />
            Add more files
          </Button>
          <Button disabled={renamingAll} onClick={handleRenameAll} variant="outline">
            <Sparkles className="h-4 w-4" />
            AI Rename All
          </Button>
          <Button onClick={handleSummary}>Prepare Summary</Button>
        </div>
        <DocumentGrid documents={documents} onCompress={handleCompress} onRename={handleRename} />
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
      <UploadModal onClose={() => setUploadOpen(false)} open={uploadOpen} />
    </>
  );
}

"use client";

import { FileBadge2, FileScan, FileText, Save, Shrink, Sparkles, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getMockPlan, PLAN_LIMITS, subscribeToMockPlan, type Plan } from "@/lib/mock-plan";
import type { MedicalDocument } from "@/types";
import { formatDate } from "@/lib/utils";

export function DocumentCard({
  document,
  onRename,
  onCompress,
  onOpen,
  onDelete
}: {
  document: MedicalDocument;
  onRename: (id: string, value: string) => Promise<void>;
  onCompress: (document: MedicalDocument, nextValue: boolean) => Promise<void>;
  onOpen: (document: MedicalDocument) => void;
  onDelete: (document: MedicalDocument) => Promise<void>;
}) {
  const [editingName, setEditingName] = useState(document.file_name);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [plan, setPlan] = useState<Plan>("free");
  const isPdf = document.file_type.includes("pdf");
  const TileIcon = isPdf ? FileText : FileScan;
  const accentClasses = isPdf
    ? "from-blue-600/15 via-indigo-500/10 to-cyan-400/15 text-blue-700"
    : "from-emerald-500/15 via-teal-500/10 to-sky-500/15 text-emerald-700";

  async function handleSave() {
    setSaving(true);
    await onRename(document.id, editingName);
    setSaving(false);
  }

  useEffect(() => {
    setPlan(getMockPlan());
    return subscribeToMockPlan(setPlan);
  }, []);

  async function handleDelete() {
    const confirmed = window.confirm(`Remove "${document.file_name}" from your documents?`);

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    await onDelete(document);
    setDeleting(false);
  }

  const canUseAiParsing = PLAN_LIMITS[plan].aiTrialMatching;

  return (
    <Card className="flex flex-col gap-3 rounded-[28px] border border-slate-200/80 bg-white p-4 shadow-[0_20px_45px_-30px_rgba(15,23,42,0.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-32px_rgba(37,99,235,0.35)]">
      <button
        className={`group relative overflow-hidden rounded-[24px] border border-white/70 bg-gradient-to-br ${accentClasses} p-5 text-left transition-all duration-300 hover:scale-[1.02] active:scale-95`}
        onClick={() => onOpen(document)}
        type="button"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.75),transparent_50%),linear-gradient(135deg,rgba(255,255,255,0.65),rgba(255,255,255,0.2))]" />
        <div className="relative flex h-40 flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                {isPdf ? "Medical report" : "Scanned record"}
              </p>
              <p className="mt-2 max-w-[13rem] text-lg font-semibold leading-tight text-slate-900">
                {document.disease_name || "Health record"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-white/70">
              <TileIcon className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="grid gap-2">
              <div className="h-2 rounded-full bg-white/80" />
              <div className="h-2 w-10/12 rounded-full bg-white/65" />
              <div className="h-2 w-8/12 rounded-full bg-white/50" />
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                <FileBadge2 className="mr-1.5 h-3.5 w-3.5" />
                {document.file_type.includes("pdf") ? "PDF" : "Scan"}
              </span>
              {document.parsed_data ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100/90 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI parsed
                </span>
              ) : !canUseAiParsing ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100/95 px-3 py-1 text-xs font-semibold text-slate-600">
                  <FileText className="h-3.5 w-3.5" />
                  Static record
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/90 px-3 py-1 text-xs font-semibold text-blue-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI ready
                </span>
              )}
            </div>
          </div>
        </div>
      </button>
      <div className="space-y-2">
        <Input
          className="rounded-2xl border-slate-200 text-slate-900"
          onChange={(event) => setEditingName(event.target.value)}
          value={editingName}
        />
        <div className="grid gap-1 text-sm text-slate-500">
          <p>
            <span className="font-medium text-slate-900">Disease:</span> {document.disease_name || "Pending"}
          </p>
          <p>
            <span className="font-medium text-slate-900">Patient:</span> {document.patient_name || "Pending"}
          </p>
          <p>
            <span className="font-medium text-slate-900">Date:</span> {formatDate(document.upload_date)}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button className="flex-1" disabled={saving} onClick={handleSave} variant="secondary">
          <Save className="h-4 w-4" />
          Save name
        </Button>
        <Button
          className="flex-1"
          onClick={() => onCompress(document, !document.is_compressed)}
          variant="outline"
        >
          <Shrink className="h-4 w-4" />
          {document.is_compressed ? "Compressed" : "Compress"}
        </Button>
        <Button
          className="w-full border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
          disabled={deleting}
          onClick={handleDelete}
          variant="outline"
        >
          <Trash2 className="h-4 w-4" />
          {deleting ? "Removing..." : "Delete record"}
        </Button>
      </div>
    </Card>
  );
}

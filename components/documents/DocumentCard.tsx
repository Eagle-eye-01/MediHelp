"use client";

import { FileText, Save, Shrink } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { MedicalDocument } from "@/types";
import { formatDate } from "@/lib/utils";

export function DocumentCard({
  document,
  onRename,
  onCompress
}: {
  document: MedicalDocument;
  onRename: (id: string, value: string) => Promise<void>;
  onCompress: (document: MedicalDocument, nextValue: boolean) => Promise<void>;
}) {
  const [editingName, setEditingName] = useState(document.file_name);
  const [saving, setSaving] = useState(false);

  const isImage = document.file_type.startsWith("image/");

  async function handleSave() {
    setSaving(true);
    await onRename(document.id, editingName);
    setSaving(false);
  }

  return (
    <Card className="flex cursor-pointer flex-col gap-3 p-4 hover:shadow-md active:scale-95">
      <div className="overflow-hidden rounded-xl bg-slate-50">
        {isImage ? (
          <img alt={document.file_name} className="h-40 w-full object-cover" src={document.file_url} />
        ) : (
          <div className="flex h-40 items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
            <FileText className="h-10 w-10 text-slate-400" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Input value={editingName} onChange={(event) => setEditingName(event.target.value)} />
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
      </div>
    </Card>
  );
}

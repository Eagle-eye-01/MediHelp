"use client";

import { Camera, Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { isSupabaseConfigured } from "@/lib/supabase";
import { fileToBase64, makeSuggestedDocumentName } from "@/lib/utils";

type UploadStatus = {
  name: string;
  progress: number;
  state: "queued" | "uploading" | "analyzing" | "done" | "error";
};

export function UploadWorkspace({
  userId
}: {
  userId: string | null;
}) {
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<UploadStatus[]>([]);
  const [busy, setBusy] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) {
      return;
    }

    if (!isSupabaseConfigured() || !userId) {
      toast.error("Configure Supabase and log in to upload files.");
      return;
    }

    const selected = Array.from(files);
    const invalid = selected.find((file) => file.size > 10 * 1024 * 1024);

    if (invalid) {
      toast.error(`${invalid.name} is larger than 10MB.`);
      return;
    }

    setBusy(true);
    setItems(selected.map((file) => ({ name: file.name, progress: 10, state: "queued" })));

    try {
      const supabase = createBrowserSupabaseClient();

      for (let index = 0; index < selected.length; index += 1) {
        const file = selected[index];

        setItems((current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? { ...item, progress: 30, state: "uploading" } : item
          )
        );

        const storagePath = `${userId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("medical-documents")
          .upload(storagePath, file, { upsert: true, contentType: file.type });

        if (uploadError) {
          throw uploadError;
        }

        setItems((current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? { ...item, progress: 65, state: "analyzing" } : item
          )
        );

        const {
          data: { publicUrl }
        } = supabase.storage.from("medical-documents").getPublicUrl(storagePath);

        const base64 = await fileToBase64(file);
        const analysisResponse = await fetch("/api/ai/document-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            base64,
            mimeType: file.type
          })
        });
        const analysis = await analysisResponse.json();

        const fileName =
          analysis.suggestedFilename ||
          makeSuggestedDocumentName(analysis.patientName, analysis.diseaseName, new Date().toISOString());

        const { error: insertError } = await supabase.from("documents").insert({
          user_id: userId,
          file_name: fileName,
          original_name: file.name,
          file_url: publicUrl,
          file_type: file.type,
          file_size: file.size,
          ai_summary: analysis.summary || "",
          disease_name: analysis.diseaseName || "",
          patient_name: analysis.patientName || "",
          upload_date: new Date().toISOString(),
          is_compressed: false
        });

        if (insertError) {
          throw insertError;
        }

        setItems((current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? { ...item, progress: 100, state: "done" } : item
          )
        );
      }

      toast.success("Documents uploaded successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
      setItems((current) =>
        current.map((item) => (item.state === "done" ? item : { ...item, state: "error" }))
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch max-w-2xl mx-auto">
        <label className="flex-1 cursor-pointer">
          <Card className="flex h-full cursor-pointer flex-col justify-between gap-4 p-6 hover:shadow-md active:scale-95">
            <UploadCloud className="h-10 w-10 text-primary" />
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Upload from device</h2>
              <p className="mt-2 text-sm text-slate-500">
                Select one or many reports, scans, or prescriptions from your device.
              </p>
            </div>
            <span className="text-sm font-medium text-primary">Choose files</span>
          </Card>
          <input
            className="hidden"
            disabled={busy}
            multiple
            onChange={(event) => handleFiles(event.target.files)}
            type="file"
          />
        </label>
        <button
          className="flex-1"
          onClick={() => cameraInputRef.current?.click()}
          type="button"
        >
          <Card className="flex h-full cursor-pointer flex-col justify-between gap-4 p-6 hover:shadow-md active:scale-95">
            <Camera className="h-10 w-10 text-primary" />
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Click a picture</h2>
              <p className="mt-2 text-sm text-slate-500">
                Use the camera on your phone to capture a new report instantly.
              </p>
            </div>
            <span className="text-sm font-medium text-primary">Open camera</span>
          </Card>
        </button>
        <input
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
          ref={cameraInputRef}
          type="file"
        />
      </div>
      <div className="grid gap-4">
        {items.map((item) => (
          <Card className="p-4" key={item.name}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                <p className="text-xs text-slate-500 capitalize">{item.state}</p>
              </div>
              {item.state !== "done" && item.state !== "error" ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : null}
            </div>
            <Progress className="mt-3" value={item.progress} />
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Button disabled={busy} onClick={() => window.location.assign("/documents")}>
          Review uploaded files
        </Button>
      </div>
    </div>
  );
}

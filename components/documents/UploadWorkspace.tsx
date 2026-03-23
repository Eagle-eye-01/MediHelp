"use client";

import { Camera, ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PlanUpgradeNudge } from "@/components/PlanGate";
import { createBrowserSupabaseClient } from "@/lib/supabase-browser";
import { parseAndStoreDocument } from "@/lib/document-parser";
import { getMockPlan, PLAN_LIMITS } from "@/lib/mock-plan";
import { isSupabaseConfigured } from "@/lib/supabase";
import { fileToBase64 } from "@/lib/utils";

type UploadStatus = {
  name: string;
  progress: number;
  state: "queued" | "uploading" | "analyzing" | "done" | "error";
};

export function UploadWorkspace({
  userId,
  currentDocumentCount
}: {
  userId: string | null;
  currentDocumentCount: number;
}) {
  const router = useRouter();
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const [items, setItems] = useState<UploadStatus[]>([]);
  const [busy, setBusy] = useState(false);
  const [documentCount, setDocumentCount] = useState(currentDocumentCount);
  const [showUpgradeNudge, setShowUpgradeNudge] = useState(false);

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

    const plan = getMockPlan();
    const limit = PLAN_LIMITS[plan].documents;
    // TODO: Replace with real Supabase billing table
    if (limit !== Infinity && documentCount + selected.length > limit) {
      setShowUpgradeNudge(true);
      toast.error("Free plan document limit reached.");
      return;
    }

    setBusy(true);
    setItems(selected.map((file) => ({ name: file.name, progress: 10, state: "queued" })));

    try {
      for (let index = 0; index < selected.length; index += 1) {
        const file = selected[index];

        setItems((current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? { ...item, progress: 30, state: "uploading" } : item
          )
        );

        setItems((current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? { ...item, progress: 65, state: "analyzing" } : item
          )
        );

        const base64 = await fileToBase64(file);
        const uploadResponse = await fetch("/api/documents/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: file.name,
            size: file.size,
            base64,
            mimeType: file.type
          })
        });

        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) {
          throw new Error(uploadData.error || "Upload failed");
        }

        if (PLAN_LIMITS[plan].aiTrialMatching) {
          const supabase = createBrowserSupabaseClient();
          parseAndStoreDocument(uploadData.document.id, uploadData.document.file_url, supabase).catch(console.error);
        }

        setItems((current) =>
          current.map((item, itemIndex) =>
            itemIndex === index ? { ...item, progress: 100, state: "done" } : item
          )
        );
      }

      toast.success("Documents uploaded successfully");
      setDocumentCount((current) => current + selected.length);
      setShowUpgradeNudge(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
      setItems((current) =>
        current.map((item) => (item.state === "done" ? item : { ...item, state: "error" }))
      );
    } finally {
      setBusy(false);
    }
  }

  function openCameraPicker() {
    if (busy) {
      return;
    }

    if (!cameraInputRef.current) {
      toast.error("Camera input is not available in this browser.");
      return;
    }

    cameraInputRef.current.value = "";
    cameraInputRef.current.click();
    window.setTimeout(() => {
      if (cameraInputRef.current && document.visibilityState === "visible") {
        toast.message("If the camera did not open, your browser is showing the image picker instead.");
      }
    }, 900);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
        <button
          className="w-full"
          onClick={() => uploadInputRef.current?.click()}
          type="button"
        >
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
        </button>
        <button
          className="w-full"
          onClick={openCameraPicker}
          type="button"
        >
          <Card className="flex h-full cursor-pointer flex-col justify-between gap-4 p-6 hover:shadow-md active:scale-95">
            <Camera className="h-10 w-10 text-primary" />
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">Click a picture</h2>
              <p className="mt-2 text-sm text-slate-500">
                Open the camera on mobile, or use the image picker on desktop to capture or choose a photo.
              </p>
            </div>
            <span className="text-sm font-medium text-primary">Open camera</span>
          </Card>
        </button>
        <input
          className="hidden"
          disabled={busy}
          multiple
          onChange={(event) => handleFiles(event.target.files)}
          ref={uploadInputRef}
          type="file"
        />
        <input
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
          ref={cameraInputRef}
          type="file"
        />
      </div>
      <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
        <ImagePlus className="h-4 w-4" />
        Camera capture depends on device/browser permissions. Desktop browsers may open the image picker instead.
      </div>
      {showUpgradeNudge ? (
        <PlanUpgradeNudge compact feature="Upload beyond 5 documents" requiredPlan="premium" />
      ) : null}
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
      <div className="flex justify-stretch sm:justify-end">
        <Button
          className="w-full sm:w-auto"
          disabled={busy}
          onClick={() => {
            router.push("/documents");
            router.refresh();
          }}
        >
          Review uploaded files
        </Button>
      </div>
    </div>
  );
}

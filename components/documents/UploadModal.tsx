"use client";

import Link from "next/link";
import { Camera, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";

export function UploadModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <ResponsiveModal
      description="Choose the fastest way to add another medical document."
      onClose={onClose}
      open={open}
      title="Upload Options"
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <Link className="flex-1" href="/upload" onClick={onClose}>
          <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 p-5 transition hover:shadow-sm">
            <UploadCloud className="h-8 w-8 text-primary" />
            <div className="mt-4">
              <p className="font-semibold text-slate-900">Upload from device</p>
              <p className="mt-1 text-sm text-slate-500">
                Select one or many reports from your phone or computer.
              </p>
            </div>
          </div>
        </Link>
        <Link className="flex-1" href="/upload" onClick={onClose}>
          <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 p-5 transition hover:shadow-sm">
            <Camera className="h-8 w-8 text-primary" />
            <div className="mt-4">
              <p className="font-semibold text-slate-900">Click a picture</p>
              <p className="mt-1 text-sm text-slate-500">
                Use your camera to capture a new prescription or report.
              </p>
            </div>
          </div>
        </Link>
      </div>
      <div className="mt-5 flex justify-end">
        <Button onClick={onClose} variant="outline">
          Close
        </Button>
      </div>
    </ResponsiveModal>
  );
}

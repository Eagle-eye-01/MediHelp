"use client";

import { Search, Upload } from "lucide-react";

import { Input } from "@/components/ui/input";

export function MedicineSearch({
  value,
  onChange,
  onUpload
}: {
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => void;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="pl-11"
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search a medicine name"
          value={value}
        />
      </div>
      <label className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 active:scale-95 sm:h-10">
        <Upload className="h-4 w-4" />
        Upload prescription
        <input
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onUpload(file);
            }
          }}
          type="file"
        />
      </label>
    </div>
  );
}

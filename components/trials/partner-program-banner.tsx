"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

import { PharmaPartnerModal } from "@/components/PharmaPartnerModal";

const DISMISS_KEY = "medihelp_partner_program_dismissed";

export function PartnerProgramBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    setDismissed(window.localStorage.getItem(DISMISS_KEY) === "true");
  }, []);

  function handleDismiss() {
    setDismissed(true);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(DISMISS_KEY, "true");
    }
  }

  if (dismissed) {
    return null;
  }

  return (
    <>
      <div className="rounded-[28px] border border-emerald-200 bg-[linear-gradient(135deg,#ECFDF5_0%,#FFFFFF_100%)] px-5 py-4 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="text-sm leading-7 text-slate-700">
            <span className="font-semibold text-slate-950">
              Are you a CRO or pharma company?
            </span>{" "}
            MediHelp connects you with pre-matched, consenting patients.{" "}
            <button
              className="font-semibold text-emerald-700 hover:text-emerald-800"
              onClick={() => setOpen(true)}
              type="button"
            >
              Learn about our partner programme →
            </button>
          </div>
          <button
            className="rounded-full p-1 text-slate-400 hover:bg-white hover:text-slate-600"
            onClick={handleDismiss}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <PharmaPartnerModal onClose={() => setOpen(false)} open={open} />
    </>
  );
}

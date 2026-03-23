"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, ExternalLink, MapPin, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TrialResult } from "@/types";
import { cn } from "@/lib/utils";

const cardCopy = {
  English: {
    match: "match",
    sponsor: "Sponsor",
    sponsorMissing: "Sponsor not listed",
    eligibility: "Eligibility",
    hideDetails: "Hide details",
    viewFullTrial: "View details",
    officialPage: "Official page",
    indiaBased: "India-based trial"
  },
  Tamil: {
    match: "பொருத்தம்",
    sponsor: "ஆதரவாளர்",
    sponsorMissing: "ஆதரவாளர் விவரம் இல்லை",
    eligibility: "தகுதி",
    hideDetails: "விவரங்களை மறை",
    viewFullTrial: "விவரங்களை காண்க",
    officialPage: "அதிகாரப்பூர்வ பக்கம்",
    indiaBased: "இந்தியாவில் நடைபெறும் ஆய்வு"
  },
  Hindi: {
    match: "मेल",
    sponsor: "प्रायोजक",
    sponsorMissing: "प्रायोजक उपलब्ध नहीं",
    eligibility: "पात्रता",
    hideDetails: "विवरण छिपाएँ",
    viewFullTrial: "विवरण देखें",
    officialPage: "आधिकारिक पेज",
    indiaBased: "भारत-आधारित ट्रायल"
  }
} as const;

export function TrialCard({
  trial,
  language = "English"
}: {
  trial: TrialResult;
  language?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const copy = cardCopy[language as keyof typeof cardCopy] || cardCopy.English;

  return (
    <Card className="flex h-full flex-col rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            <ShieldCheck className="h-3.5 w-3.5" />
            {copy.indiaBased}
          </div>
          <h3 className="mt-3 text-lg font-semibold leading-8 text-slate-950">{trial.trialName}</h3>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-2 text-center">
          <p className="text-lg font-semibold text-slate-950">{trial.matchScore}%</p>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{copy.match}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{trial.status}</Badge>
        {trial.nctId ? (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">{trial.nctId}</Badge>
        ) : null}
      </div>

      <div className="mt-4 flex items-start gap-2 text-sm text-slate-600">
        <MapPin className="mt-0.5 h-4 w-4 text-blue-600" />
        <p>{trial.location}</p>
      </div>

      <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-600">{trial.description}</p>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">{trial.contact}</p>
      </div>

      {expanded ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">{copy.sponsor}:</span>{" "}
            {trial.sponsor || copy.sponsorMissing}
          </p>
          {trial.eligibilitySummary ? (
            <p className="mt-2">
              <span className="font-semibold text-slate-900">{copy.eligibility}:</span>{" "}
              {trial.eligibilitySummary}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap gap-3 pt-5">
        <Button onClick={() => setExpanded((value) => !value)} variant="outline">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {expanded ? copy.hideDetails : copy.viewFullTrial}
        </Button>
        {trial.trialUrl ? (
          <Link
            className={cn(buttonVariants({ variant: "secondary" }), "inline-flex")}
            href={trial.trialUrl}
            rel="noreferrer"
            target="_blank"
          >
            {copy.officialPage}
            <ExternalLink className="h-4 w-4" />
          </Link>
        ) : null}
      </div>
    </Card>
  );
}

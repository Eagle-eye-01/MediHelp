"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
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
    hideDetails: "Hide Details",
    viewFullTrial: "View Full Trial",
    officialPage: "Official Page"
  },
  Tamil: {
    match: "பொருத்தம்",
    sponsor: "ஆதரவாளர்",
    sponsorMissing: "ஆதரவாளர் விவரம் இல்லை",
    eligibility: "தகுதி",
    hideDetails: "விவரங்களை மறை",
    viewFullTrial: "முழு ஆய்வை காண்க",
    officialPage: "அதிகாரப்பூர்வ பக்கம்"
  },
  Hindi: {
    match: "मेल",
    sponsor: "प्रायोजक",
    sponsorMissing: "प्रायोजक उपलब्ध नहीं",
    eligibility: "पात्रता",
    hideDetails: "विवरण छिपाएँ",
    viewFullTrial: "पूरा ट्रायल देखें",
    officialPage: "आधिकारिक पेज"
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
    <Card className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md active:scale-95">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{trial.trialName}</h3>
          <p className="text-sm text-slate-500">{trial.location}</p>
        </div>
        <Badge>
          {trial.matchScore}% {copy.match}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{trial.status}</Badge>
        {trial.nctId ? (
          <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">{trial.nctId}</Badge>
        ) : null}
      </div>
      <p className="line-clamp-3 text-sm leading-6 text-slate-600">{trial.description}</p>
      <p className="text-sm text-slate-600">{trial.contact}</p>
      {expanded ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
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
      <div className="flex flex-wrap gap-3">
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

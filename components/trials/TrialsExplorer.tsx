"use client";

import { useState } from "react";
import { toast } from "sonner";

import { TrialCard } from "@/components/trials/TrialCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TrialResult } from "@/types";

const languageCopy = {
  English: {
    conditionPlaceholder: "Condition",
    ageLabel: "Age range",
    findTrials: "Find Trials",
    findingTrials: "Finding trials...",
    noTrialsTitle: "No trials found",
    noTrialsDescription: "Try a broader condition or a different city to see more recruiting studies.",
    emptyTitle: "No trials generated yet",
    emptyDescription: "Choose a condition, city, and age range to find live recruiting trials.",
    noResultsToast: "No matching recruiting trials found for that search."
  },
  Tamil: {
    conditionPlaceholder: "நிலை / நோய்",
    ageLabel: "வயது வரம்பு",
    findTrials: "ஆய்வுகளை தேடு",
    findingTrials: "ஆய்வுகள் தேடப்படுகிறது...",
    noTrialsTitle: "ஆய்வுகள் எதுவும் கிடைக்கவில்லை",
    noTrialsDescription: "மேலும் முடிவுகளுக்கு விரிவான நிலை அல்லது வேறு நகரத்தை முயற்சிக்கவும்.",
    emptyTitle: "இன்னும் ஆய்வுகள் உருவாக்கப்படவில்லை",
    emptyDescription: "நேரடி ஆய்வுகளை காண நிலை, நகரம் மற்றும் வயது வரம்பை தேர்வு செய்யவும்.",
    noResultsToast: "இந்த தேடலுக்கு பொருந்தும் ஆட்கள் சேர்க்கை நடைபெறும் ஆய்வுகள் கிடைக்கவில்லை."
  },
  Hindi: {
    conditionPlaceholder: "स्थिति / बीमारी",
    ageLabel: "आयु सीमा",
    findTrials: "ट्रायल खोजें",
    findingTrials: "ट्रायल खोजे जा रहे हैं...",
    noTrialsTitle: "कोई ट्रायल नहीं मिला",
    noTrialsDescription: "ज्यादा परिणामों के लिए व्यापक स्थिति या किसी दूसरे शहर को चुनें।",
    emptyTitle: "अभी कोई ट्रायल नहीं दिखाया गया है",
    emptyDescription: "लाइव ट्रायल देखने के लिए स्थिति, शहर और आयु सीमा चुनें।",
    noResultsToast: "इस खोज के लिए कोई उपयुक्त भर्ती वाला ट्रायल नहीं मिला।"
  }
} as const;

export function TrialsExplorer({
  cities,
  languages
}: {
  cities: string[];
  languages: string[];
}) {
  const [condition, setCondition] = useState("");
  const [city, setCity] = useState("Bangalore");
  const [ageRange, setAgeRange] = useState<[number, number]>([25, 50]);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [trials, setTrials] = useState<TrialResult[]>([]);
  const [searched, setSearched] = useState(false);
  const copy = languageCopy[language as keyof typeof languageCopy] || languageCopy.English;

  async function handleSearch() {
    try {
      setLoading(true);
      setSearched(true);
      const response = await fetch("/api/ai/trials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          condition,
          city,
          ageRange,
          language
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to find trials right now");
      }
      setTrials(data.trials || []);
      if (!data.trials?.length) {
        toast.message(copy.noResultsToast);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to find trials right now");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Input
          className="min-w-[200px] flex-1"
          onChange={(event) => setCondition(event.target.value)}
          placeholder={copy.conditionPlaceholder}
          value={condition}
        />
        <select
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm sm:h-10 sm:w-48"
          onChange={(event) => setCity(event.target.value)}
          value={city}
        >
          {cities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 sm:w-64">
          <Label>
            {copy.ageLabel}: {ageRange[0]} - {ageRange[1]}
          </Label>
          <div className="mt-4">
            <div className="relative h-11">
              <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-slate-200" />
              <div
                className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-blue-500"
                style={{
                  left: `${ageRange[0]}%`,
                  right: `${100 - ageRange[1]}%`
                }}
              />
              <input
                className="pointer-events-none absolute left-0 top-1/2 h-11 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:mt-0 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-track]:h-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-md"
                max={ageRange[1]}
                min={0}
                onChange={(event) =>
                  setAgeRange([Math.min(Number(event.target.value), ageRange[1]), ageRange[1]])
                }
                type="range"
                value={ageRange[0]}
              />
              <input
                className="pointer-events-none absolute left-0 top-1/2 h-11 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:mt-0 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-slate-900 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-track]:h-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-slate-900 [&::-moz-range-thumb]:shadow-md"
                max={100}
                min={ageRange[0]}
                onChange={(event) =>
                  setAgeRange([ageRange[0], Math.max(Number(event.target.value), ageRange[0])])
                }
                type="range"
                value={ageRange[1]}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-medium text-slate-500">
              <span>0</span>
              <span>100</span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {languages.map((item) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium active:scale-95 ${
                language === item
                  ? "bg-primary text-white"
                  : "border border-slate-200 bg-white text-slate-600"
              }`}
              key={item}
              onClick={() => setLanguage(item)}
              type="button"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <Button disabled={loading || !condition.trim()} onClick={handleSearch}>
        {loading ? copy.findingTrials : copy.findTrials}
      </Button>
      {trials.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trials.map((trial) => (
            <TrialCard key={trial.nctId || trial.trialName} language={language} trial={trial} />
          ))}
        </div>
      ) : (
        <EmptyState
          description={searched ? copy.noTrialsDescription : copy.emptyDescription}
          title={searched ? copy.noTrialsTitle : copy.emptyTitle}
        />
      )}
    </div>
  );
}

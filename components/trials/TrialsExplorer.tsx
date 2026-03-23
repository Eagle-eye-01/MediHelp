"use client";

import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { toast } from "sonner";

import { TrialCard } from "@/components/trials/TrialCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TrialResult } from "@/types";

const languageCopy = {
  English: {
    conditionPlaceholder: "Condition or disease",
    ageLabel: "Age range",
    scopeLabel: "India-based recruiting studies",
    findTrials: "Find Trials",
    findingTrials: "Finding trials...",
    noTrialsTitle: "No India-based trials found",
    noTrialsDescription: "Try a broader condition or another Indian city to see more recruiting studies.",
    emptyTitle: "No trials generated yet",
    emptyDescription: "Choose a condition, city, and age range to search India-based recruiting trials.",
    noResultsToast: "No India-based recruiting trials matched that search."
  },
  Tamil: {
    conditionPlaceholder: "நிலை அல்லது நோய்",
    ageLabel: "வயது வரம்பு",
    scopeLabel: "இந்தியாவில் நடைபெறும் ஆய்வுகள்",
    findTrials: "ஆய்வுகளை தேடு",
    findingTrials: "ஆய்வுகள் தேடப்படுகிறது...",
    noTrialsTitle: "இந்தியாவில் பொருந்தும் ஆய்வுகள் இல்லை",
    noTrialsDescription: "மேலும் முடிவுகளுக்கு விரிவான நிலை அல்லது வேறு இந்திய நகரத்தை முயற்சிக்கவும்.",
    emptyTitle: "இன்னும் ஆய்வுகள் காட்டப்படவில்லை",
    emptyDescription: "நிலை, நகரம், மற்றும் வயது வரம்பை தேர்வு செய்து இந்திய ஆய்வுகளை தேடவும்.",
    noResultsToast: "இந்த தேடலுக்கு பொருந்தும் இந்திய ஆய்வுகள் கிடைக்கவில்லை."
  },
  Hindi: {
    conditionPlaceholder: "स्थिति या बीमारी",
    ageLabel: "आयु सीमा",
    scopeLabel: "भारत-आधारित भर्ती ट्रायल",
    findTrials: "ट्रायल खोजें",
    findingTrials: "ट्रायल खोजे जा रहे हैं...",
    noTrialsTitle: "भारत-आधारित ट्रायल नहीं मिले",
    noTrialsDescription: "ज़्यादा परिणामों के लिए व्यापक स्थिति या किसी दूसरे भारतीय शहर को चुनें।",
    emptyTitle: "अभी कोई ट्रायल नहीं दिखाया गया है",
    emptyDescription: "स्थिति, शहर और आयु सीमा चुनकर भारत-आधारित ट्रायल खोजें।",
    noResultsToast: "इस खोज के लिए भारत-आधारित ट्रायल नहीं मिला।"
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
  const [city, setCity] = useState("Chennai");
  const [ageRange, setAgeRange] = useState<[number, number]>([25, 50]);
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [trials, setTrials] = useState<TrialResult[]>([]);
  const [searched, setSearched] = useState(false);
  const [emptyMessage, setEmptyMessage] = useState("");
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
      setEmptyMessage(data.emptyMessage || copy.noResultsToast);

      if (!data.trials?.length) {
        toast.message(data.emptyMessage || copy.noResultsToast);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to find trials right now");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            <MapPin className="h-4 w-4" />
            {copy.scopeLabel}
          </div>
        </div>

        <div className="grid gap-3 xl:grid-cols-[1.3fr_0.6fr_0.8fr_auto]">
          <Input
            onChange={(event) => setCondition(event.target.value)}
            placeholder={copy.conditionPlaceholder}
            value={condition}
          />

          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm sm:h-10"
            onChange={(event) => setCity(event.target.value)}
            value={city}
          >
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <div className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3">
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
                  className="pointer-events-none absolute left-0 top-1/2 h-11 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-track]:h-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:shadow-md"
                  max={ageRange[1]}
                  min={0}
                  onChange={(event) =>
                    setAgeRange([Math.min(Number(event.target.value), ageRange[1]), ageRange[1]])
                  }
                  type="range"
                  value={ageRange[0]}
                />
                <input
                  className="pointer-events-none absolute left-0 top-1/2 h-11 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-slate-900 [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-track]:h-0 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-slate-900 [&::-moz-range-thumb]:shadow-md"
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

          <Button className="w-full xl:min-w-[160px]" disabled={loading || !condition.trim()} onClick={handleSearch}>
            <Search className="h-4 w-4" />
            {loading ? copy.findingTrials : copy.findTrials}
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
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

      {trials.length ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {trials.map((trial) => (
            <TrialCard key={trial.nctId || trial.trialName} language={language} trial={trial} />
          ))}
        </div>
      ) : (
        <EmptyState
          description={searched ? emptyMessage || copy.noTrialsDescription : copy.emptyDescription}
          title={searched ? copy.noTrialsTitle : copy.emptyTitle}
        />
      )}
    </div>
  );
}

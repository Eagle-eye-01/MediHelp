"use client";

import { useState } from "react";
import { toast } from "sonner";

import { TrialCard } from "@/components/trials/TrialCard";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TrialResult } from "@/types";

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

  async function handleSearch() {
    try {
      setLoading(true);
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
      setTrials(data.trials || []);
    } catch {
      toast.error("Unable to find trials right now");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 mb-6">
        <Input
          className="flex-1 min-w-[200px]"
          onChange={(event) => setCondition(event.target.value)}
          placeholder="Condition"
          value={condition}
        />
        <select
          className="w-full sm:w-48 h-11 sm:h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm"
          onChange={(event) => setCity(event.target.value)}
          value={city}
        >
          {cities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <div className="w-full sm:w-64 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <Label>Age range: {ageRange[0]} - {ageRange[1]}</Label>
          <div className="mt-3 grid gap-3">
            <input
              max={ageRange[1]}
              min={0}
              onChange={(event) =>
                setAgeRange([Math.min(Number(event.target.value), ageRange[1]), ageRange[1]])
              }
              type="range"
              value={ageRange[0]}
            />
            <input
              max={100}
              min={ageRange[0]}
              onChange={(event) =>
                setAgeRange([ageRange[0], Math.max(Number(event.target.value), ageRange[0])])
              }
              type="range"
              value={ageRange[1]}
            />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {languages.map((item) => (
            <button
              className={`rounded-full px-4 py-2 text-sm font-medium active:scale-95 ${
                language === item
                  ? "bg-primary text-white"
                  : "bg-white text-slate-600 border border-slate-200"
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
        {loading ? "Finding trials..." : "Find Trials"}
      </Button>
      {trials.length ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {trials.map((trial) => (
            <TrialCard key={trial.trialName} trial={trial} />
          ))}
        </div>
      ) : (
        <EmptyState
          description="Choose a condition, city, and age range to generate matching trial options."
          title="No trials generated yet"
        />
      )}
    </div>
  );
}

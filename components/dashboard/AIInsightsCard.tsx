"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { HealthInsight } from "@/types";

export function AIInsightsCard({
  summaries
}: {
  summaries: string[];
}) {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadInsights() {
      setLoading(true);

      try {
        const response = await fetch("/api/ai/dashboard-insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ summaries })
        });

        const data = await response.json();

        if (active) {
          setInsights(data.insights || []);
        }
      } catch {
        if (active) {
          setInsights([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadInsights();

    return () => {
      active = false;
    };
  }, [summaries]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardDescription>Gemini-powered reminders</CardDescription>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Health Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        ) : (
          <div className="space-y-3">
            {insights.map((insight) => (
              <div className="rounded-xl border border-slate-100 p-3" key={insight.title}>
                <p className="text-sm font-semibold text-slate-900">{insight.title}</p>
                <p className="mt-1 text-sm text-slate-500">{insight.description}</p>
              </div>
            ))}
            {!insights.length ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                Upload documents to unlock personalized insights.
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

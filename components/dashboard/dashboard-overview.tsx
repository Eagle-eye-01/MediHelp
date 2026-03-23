"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  FileText,
  HeartPulse,
  MapPin,
  Pill,
  Sparkles,
  Stethoscope,
  TestTube2
} from "lucide-react";
import { toast } from "sonner";

import { PlanBadge } from "@/components/PlanBadge";
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCountUp } from "@/lib/hooks/useCountUp";
import { getMockPlan, PLAN_LIMITS, subscribeToMockPlan, type Plan } from "@/lib/mock-plan";
import { formatDate } from "@/lib/utils";

export function DashboardOverview({
  name,
  documentsCount,
  lastUploadDate,
  hospitalsNearby,
  conditionsTracked,
  summaries,
  trendData
}: {
  name: string;
  documentsCount: number;
  lastUploadDate?: string | null;
  hospitalsNearby: number;
  conditionsTracked: number;
  summaries: string[];
  trendData: Array<{ label: string; uploads: number }>;
}) {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryText, setSummaryText] = useState("");
  const [plan, setPlan] = useState<Plan>("free");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPlan(getMockPlan());
    }
    return subscribeToMockPlan(setPlan);
  }, []);

  const docsCount = useCountUp(documentsCount);
  const hospitalCount = useCountUp(hospitalsNearby);
  const conditionsCount = useCountUp(conditionsTracked);
  const chartMax = useMemo(() => Math.max(...trendData.map((item) => item.uploads), 1), [trendData]);

  async function handlePrepareSummary() {
    try {
      setSummaryOpen(true);
      setSummaryLoading(true);
      const response = await fetch("/api/ai/unified-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ summaries })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to prepare summary.");
      }

      setSummaryText(data.summary || "No summary available yet.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to prepare summary.";
      setSummaryText(message);
      toast.error(message);
    } finally {
      setSummaryLoading(false);
    }
  }

  const statCards = [
    {
      label: "Total Documents",
      value: Math.round(docsCount).toString(),
      icon: FileText,
      accent: "bg-blue-100 text-blue-700"
    },
    {
      label: "Last Upload",
      value: lastUploadDate ? formatDate(lastUploadDate) : "No uploads yet",
      icon: Activity,
      accent: "bg-emerald-100 text-emerald-700"
    },
    {
      label: "Hospitals Nearby",
      value: Math.round(hospitalCount).toString(),
      icon: MapPin,
      accent: "bg-amber-100 text-amber-700"
    },
    {
      label: "Conditions Tracked",
      value: Math.round(conditionsCount).toString(),
      icon: HeartPulse,
      accent: "bg-indigo-100 text-indigo-700"
    }
  ];
  const planLimits = PLAN_LIMITS[plan];
  const usagePercent =
    planLimits.documents === Infinity ? 0 : Math.min(100, (documentsCount / planLimits.documents) * 100);

  return (
    <>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Good morning, {name}
            </h2>
            <div className="mt-3">
              <PlanBadge plan={plan} />
            </div>
            <p className="mt-2 text-base text-slate-600">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </p>
          </div>
          <Button className="shadow-[0_16px_40px_-24px_rgba(37,99,235,0.8)]" onClick={handlePrepareSummary}>
            <Sparkles className="h-4 w-4" />
            Prepare AI Summary
          </Button>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {statCards.map((stat) => (
            <Card className="rounded-[28px] border border-slate-200 bg-white shadow-sm" key={stat.label}>
              <CardContent className="p-6">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.accent}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <p className="mt-6 text-2xl font-semibold text-slate-950">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="rounded-[28px] border border-slate-200 bg-white shadow-sm md:col-span-2 xl:col-span-1">
            <CardContent className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Usage</p>
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Documents:</span>{" "}
                  {documentsCount} / {planLimits.documents === Infinity ? "∞" : planLimits.documents}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">Clinical trial matching:</span>{" "}
                  {planLimits.aiTrialMatching ? "Enabled" : "Locked"}
                </p>
              </div>
              {plan === "free" ? (
                <div className="mt-5">
                  <div className="h-2 rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-blue-600 transition-all"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">Free tier document usage</p>
                </div>
              ) : null}
              <Link className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700" href="/pricing">
                View plans
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <Card className="rounded-[32px] border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-slate-950">Document Uploads</p>
                  <p className="text-sm text-slate-500">Your activity over the last 6 months</p>
                </div>
              </div>
              <div className="mt-8">
                <div className="flex h-64 items-end gap-4 rounded-[28px] bg-[linear-gradient(180deg,#F8FAFC_0%,#EEF4FF_100%)] p-6">
                  {trendData.map((point) => (
                    <div className="flex flex-1 flex-col items-center gap-3" key={point.label}>
                      <div className="flex w-full items-end justify-center">
                        <div
                          className="w-full rounded-t-[18px] bg-gradient-to-t from-blue-600 via-indigo-500 to-blue-300 shadow-[0_18px_40px_-24px_rgba(37,99,235,0.9)] transition-all duration-700"
                          style={{
                            height: `${Math.max(18, (point.uploads / chartMax) * 180)}px`
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-slate-800">{point.uploads}</p>
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{point.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <AIInsightsCard summaries={summaries} />
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Quick actions</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { href: "/hospital", label: "Find Hospital", icon: Stethoscope, tone: "bg-blue-50 text-blue-700" },
              { href: "/labs", label: "Book Lab Test", icon: TestTube2, tone: "bg-emerald-50 text-emerald-700" },
              { href: "/medicines", label: "Find Medicines", icon: Pill, tone: "bg-amber-50 text-amber-700" },
              { href: "/upload", label: "Upload Records", icon: FileText, tone: "bg-indigo-50 text-indigo-700" }
            ].map((item) => (
              <Link
                className={`flex min-h-[84px] items-center gap-4 rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${item.tone}`}
                href={item.href}
                key={item.href}
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.tone}`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-950">{item.label}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <ResponsiveModal
        description="MediHelp combines your saved document summaries into one readable overview."
        onClose={() => setSummaryOpen(false)}
        open={summaryOpen}
        title="Unified Health Summary"
      >
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
          {summaryLoading ? "Preparing your summary..." : summaryText || "No summary available yet."}
        </div>
      </ResponsiveModal>
    </>
  );
}

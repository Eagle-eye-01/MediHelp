"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getMockPlan, planMeetsRequirement, subscribeToMockPlan, type Plan } from "@/lib/mock-plan";
import { cn } from "@/lib/utils";

export function PlanUpgradeNudge({
  feature,
  requiredPlan = "premium",
  compact = false
}: {
  feature: string;
  requiredPlan?: Plan;
  compact?: boolean;
}) {
  const copy =
    requiredPlan === "enterprise"
      ? {
          title: "This feature is available on Enterprise",
          cta: "Contact Sales"
        }
      : {
          title: "This feature is available on Premium",
          cta: "Upgrade - Rs. 199/mo"
        };

  return (
    <Card
      className={cn(
        "rounded-[28px] border border-blue-200 bg-[linear-gradient(135deg,#EFF6FF_0%,#FFFFFF_100%)] p-5 shadow-sm",
        compact ? "p-4" : "p-6"
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
          <Lock className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            {feature}
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{copy.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upgrade the mock plan state to demonstrate how MediHelp unlocks premium monetised
            features for users and partner organisations.
          </p>
        </div>
        <Link
          className={cn(buttonVariants({ variant: "default" }), "w-full justify-center text-center sm:w-auto")}
          href="/pricing"
        >
          {copy.cta}
        </Link>
      </div>
    </Card>
  );
}

export function PlanGate({
  requiredPlan,
  feature,
  children
}: {
  requiredPlan: Plan;
  feature: string;
  children: React.ReactNode;
}) {
  const [plan, setPlan] = useState<Plan>("free");

  useEffect(() => {
    setPlan(getMockPlan());
    return subscribeToMockPlan(setPlan);
  }, []);

  if (!planMeetsRequirement(plan, requiredPlan)) {
    return <PlanUpgradeNudge feature={feature} requiredPlan={requiredPlan} />;
  }

  return <>{children}</>;
}

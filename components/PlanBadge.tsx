"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { Plan } from "@/lib/mock-plan";

export function PlanBadge({ plan }: { plan: Plan }) {
  if (plan === "premium") {
    return <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">Premium ✓</Badge>;
  }

  if (plan === "enterprise") {
    return <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100">Enterprise ✓</Badge>;
  }

  return (
    <div className="flex items-center gap-3">
      <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100">Free plan</Badge>
      <Link className="text-sm font-semibold text-blue-600 hover:text-blue-700" href="/pricing">
        Upgrade
      </Link>
    </div>
  );
}

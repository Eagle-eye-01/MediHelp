"use client";

import { BellRing } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PlanUpgradeNudge } from "@/components/PlanGate";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { getMockPlan, PLAN_LIMITS } from "@/lib/mock-plan";

export function ReminderToggleCard() {
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [canUseReminders, setCanUseReminders] = useState(false);

  useEffect(() => {
    const plan = getMockPlan();
    setCanUseReminders(PLAN_LIMITS[plan].reminders);
  }, []);

  if (!canUseReminders) {
    return <PlanUpgradeNudge compact feature="Medication reminders & refill alerts" requiredPlan="premium" />;
  }

  return (
    <Card className="rounded-[24px] border border-slate-200 bg-white/92 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
            <BellRing className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-950">Medication reminders</p>
            <p className="text-sm text-slate-500">Demo refill alerts and reminder automation.</p>
          </div>
        </div>
        <Switch
          checked={remindersEnabled}
          onCheckedChange={(checked) => {
            setRemindersEnabled(checked);
            toast.success(checked ? "Medication reminders enabled." : "Medication reminders disabled.");
          }}
        />
      </div>
    </Card>
  );
}

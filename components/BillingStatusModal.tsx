"use client";

import { CreditCard, Crown, Receipt, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { getMockPlan, setMockPlan, subscribeToMockPlan, type Plan } from "@/lib/mock-plan";

const PLAN_STYLES: Record<Plan, { label: string; tone: string; badgeTone: string }> = {
  free: {
    label: "Free",
    tone: "border-slate-200 bg-slate-50",
    badgeTone: "bg-slate-100 text-slate-700"
  },
  premium: {
    label: "Premium",
    tone: "border-violet-200 bg-violet-50",
    badgeTone: "bg-violet-100 text-violet-700"
  },
  enterprise: {
    label: "Enterprise",
    tone: "border-teal-200 bg-teal-50",
    badgeTone: "bg-teal-100 text-teal-700"
  }
};

export function BillingStatusModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [plan, setPlan] = useState<Plan>("free");

  useEffect(() => {
    if (!open) {
      return;
    }

    setPlan(getMockPlan());
    return subscribeToMockPlan(setPlan);
  }, [open]);

  const planStyle = PLAN_STYLES[plan];
  const billingSummary = useMemo(() => {
    if (plan === "free") {
      return {
        status: "Demo access active",
        renewal: "No recurring charge",
        amount: "Rs. 0",
        method: "No payment method required"
      };
    }

    if (plan === "premium") {
      return {
        status: "Active subscription",
        renewal: "Renews on 15 Apr 2026",
        amount: "Rs. 199 / month",
        method: "UPI Autopay ending in 27"
      };
    }

    return {
      status: "Partner plan active",
      renewal: "Renews on 01 Apr 2026",
      amount: "Rs. 9,999 / month",
      method: "Business invoice billing"
    };
  }, [plan]);

  function handleSwitch(nextPlan: Plan) {
    // TODO: Replace with Stripe/Razorpay integration
    setMockPlan(nextPlan);
    setPlan(nextPlan);
    toast.success(`Demo membership switched to ${PLAN_STYLES[nextPlan].label}.`);
  }

  return (
    <ResponsiveModal
      description="A mock subscription and billing center for investor demos."
      onClose={onClose}
      open={open}
      title="Billing Status"
    >
      <div className="space-y-5">
        <div className={`rounded-[24px] border p-4 ${planStyle.tone}`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Current plan</p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">{planStyle.label}</h3>
              <p className="mt-2 text-sm text-slate-600">{billingSummary.status}</p>
            </div>
            <Badge className={planStyle.badgeTone}>{planStyle.label}</Badge>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-white/80 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Plan amount</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{billingSummary.amount}</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Renewal</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{billingSummary.renewal}</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-3">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Payment method</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{billingSummary.method}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 rounded-[24px] border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-semibold text-slate-950">Recent billing activity</p>
          </div>
          {[
            plan === "free" ? "No invoices yet" : "Invoice generated for current demo cycle",
            plan === "premium" ? "Autopay simulation successful" : "No failed billing attempts",
            "GST-ready invoice flow mocked for presentation"
          ].map((item) => (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600" key={item}>
              {item}
            </div>
          ))}
        </div>

        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-violet-600" />
            <p className="text-sm font-semibold text-slate-950">Switch demo membership</p>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {(["free", "premium", "enterprise"] as Plan[]).map((option) => (
              <button
                className={`rounded-[22px] border px-4 py-4 text-left transition-all active:scale-95 ${
                  option === plan
                    ? "border-blue-300 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
                key={option}
                onClick={() => handleSwitch(option)}
                type="button"
              >
                <div className="flex items-center gap-2">
                  {option === "free" ? (
                    <ShieldCheck className="h-4 w-4 text-slate-600" />
                  ) : option === "premium" ? (
                    <Crown className="h-4 w-4 text-violet-600" />
                  ) : (
                    <CreditCard className="h-4 w-4 text-teal-600" />
                  )}
                  <span className="font-semibold text-slate-900">{PLAN_STYLES[option].label}</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {option === "free"
                    ? "Show the locked-feature experience."
                    : option === "premium"
                      ? "Unlock patient premium workflows."
                      : "Show partner-grade commercial access."}
                </p>
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Done
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveModal>
  );
}

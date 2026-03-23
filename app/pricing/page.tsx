"use client";

import Link from "next/link";
import { Building2, CheckCircle, Crown, Lock, Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getMockPlan, setMockPlan, subscribeToMockPlan, type Plan } from "@/lib/mock-plan";
import { cn } from "@/lib/utils";

const plans = [
  {
    key: "free" as const,
    icon: Lock,
    title: "Free",
    price: "Rs. 0",
    subtitle: "Great for early exploration",
    features: [
      "5 document uploads",
      "Basic hospital/lab finder",
      "Manual medicine tracking",
      "No AI clinical trial matching"
    ]
  },
  {
    key: "premium" as const,
    icon: Zap,
    title: "Premium",
    price: "Rs. 199/month",
    subtitle: "Best for engaged patients",
    features: [
      "Unlimited document uploads + AI parsing",
      "Full AI clinical trial matching",
      "Medication reminders & refill alerts",
      "Priority hospital & lab listings"
    ],
    popular: true
  },
  {
    key: "enterprise" as const,
    icon: Building2,
    title: "Enterprise",
    price: "Rs. 9,999/month",
    subtitle: "Hospitals, clinics, and partner networks",
    features: [
      "API access for patient portal integration",
      "White-label Hospital Finder",
      "Bulk patient record management",
      "Dedicated support"
    ]
  }
];

export default function PricingPage() {
  const [plan, setPlanState] = useState<Plan>("free");
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    hospitalName: "",
    email: ""
  });

  useEffect(() => {
    setPlanState(getMockPlan());
    return subscribeToMockPlan(setPlanState);
  }, []);

  const statusLine = useMemo(() => {
    if (plan === "free") {
      return "Currently showing the free user experience with usage limits and gated AI features.";
    }

    if (plan === "premium") {
      return "Premium demo mode is active with subscription-style access to AI matching and reminders.";
    }

    return "Enterprise demo mode is active for partner, clinic, and hospital conversations.";
  }, [plan]);

  function handleSetPlan(nextPlan: Plan) {
    // TODO: Replace setMockPlan with Razorpay payment initiation
    setMockPlan(nextPlan);
    setPlanState(nextPlan);
    if (nextPlan === "premium") {
      toast.success("You're now on Premium! (Demo mode)");
      return;
    }

    toast.success(`${nextPlan.charAt(0).toUpperCase() + nextPlan.slice(1)} demo plan active.`);
  }

  function handleEnterpriseSubmit(event: React.FormEvent) {
    event.preventDefault();
    // TODO: Wire to CRM / email on form submit
    toast.success("Thanks! We'll be in touch within 2 business days.");
    setContactOpen(false);
  }

  return (
    <>
      <main className="min-h-screen bg-[linear-gradient(180deg,#F8FAFC_0%,#EEF4FF_100%)] px-6 py-12">
        <div className="mx-auto max-w-7xl space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">
                Monetisation demo
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Pricing & Plans
              </h1>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
                A mock business model layer for stakeholder demos. No real billing is connected.
              </p>
            </div>
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "hidden sm:inline-flex")}
              href="/dashboard"
            >
              Back to Dashboard
            </Link>
          </div>

          <Card className="rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Billing status</p>
                <div className="mt-3 flex items-center gap-3">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                    {plan === "free" ? "Free" : plan === "premium" ? "Premium" : "Enterprise"}
                  </span>
                  <span className="text-sm text-slate-500">Demo subscription status</span>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{statusLine}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <button
                  className={`rounded-[22px] border px-4 py-4 text-left transition-all active:scale-95 ${
                    plan === "free" ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-slate-50"
                  }`}
                  onClick={() => handleSetPlan("free")}
                  type="button"
                >
                  <Lock className="h-4 w-4 text-slate-700" />
                  <p className="mt-3 font-semibold text-slate-950">Free</p>
                  <p className="mt-1 text-sm text-slate-500">Show limits and upgrade nudges.</p>
                </button>
                <button
                  className={`rounded-[22px] border px-4 py-4 text-left transition-all active:scale-95 ${
                    plan === "premium" ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-slate-50"
                  }`}
                  onClick={() => handleSetPlan("premium")}
                  type="button"
                >
                  <Crown className="h-4 w-4 text-violet-600" />
                  <p className="mt-3 font-semibold text-slate-950">Premium</p>
                  <p className="mt-1 text-sm text-slate-500">Unlock patient premium flows.</p>
                </button>
                <button
                  className={`rounded-[22px] border px-4 py-4 text-left transition-all active:scale-95 ${
                    plan === "enterprise" ? "border-teal-300 bg-teal-50" : "border-slate-200 bg-slate-50"
                  }`}
                  onClick={() => handleSetPlan("enterprise")}
                  type="button"
                >
                  <Building2 className="h-4 w-4 text-teal-600" />
                  <p className="mt-3 font-semibold text-slate-950">Enterprise</p>
                  <p className="mt-1 text-sm text-slate-500">Show partner revenue workflows.</p>
                </button>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((item) => (
              <Card
                className={cn(
                  "relative rounded-[32px] border border-slate-200 bg-white p-7 shadow-sm",
                  item.popular
                    ? "ring-2 ring-violet-400 shadow-[0_24px_80px_-40px_rgba(139,92,246,0.45)]"
                    : ""
                )}
                key={item.key}
              >
                {item.popular ? (
                  <div className="absolute right-6 top-6 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                    Most Popular
                  </div>
                ) : null}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <item.icon className="h-6 w-6" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-500">{item.subtitle}</p>
                <p className="mt-5 text-3xl font-semibold text-slate-950">{item.price}</p>
                <div className="mt-6 space-y-3">
                  {item.features.map((feature) => (
                    <div className="flex items-start gap-3 text-sm text-slate-600" key={feature}>
                      <CheckCircle className="mt-0.5 h-4 w-4 text-emerald-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-8 space-y-3">
                  {item.key === "enterprise" ? (
                    <>
                      <Button className="w-full" onClick={() => handleSetPlan("enterprise")}>
                        Activate Enterprise Demo
                      </Button>
                      <Button className="w-full" onClick={() => setContactOpen(true)} variant="outline">
                        Contact Sales
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full"
                      disabled={plan === item.key}
                      onClick={() => handleSetPlan(item.key)}
                      variant={item.key === "free" ? "outline" : "default"}
                    >
                      {plan === item.key
                        ? "Current plan"
                        : item.key === "free"
                          ? "Switch to Free"
                          : "Upgrade to Premium"}
                    </Button>
                  )}
                  {item.key === "premium" ? (
                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                      Perfect for demonstrating upgrade nudges and premium unlocks.
                    </p>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <ResponsiveModal
        description="A dummy enterprise sales handoff for demo purposes."
        onClose={() => setContactOpen(false)}
        open={contactOpen}
        title="Contact Sales"
      >
        <form className="space-y-4" onSubmit={handleEnterpriseSubmit}>
          <Input
            onChange={(event) => setContactForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Name"
            required
            value={contactForm.name}
          />
          <Input
            onChange={(event) =>
              setContactForm((current) => ({ ...current, hospitalName: event.target.value }))
            }
            placeholder="Hospital / Clinic name"
            required
            value={contactForm.hospitalName}
          />
          <Input
            onChange={(event) => setContactForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email"
            required
            type="email"
            value={contactForm.email}
          />
          <div className="flex justify-end">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </ResponsiveModal>
    </>
  );
}

import Link from "next/link";
import { ChevronLeft, FileText, ShieldAlert } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "Service Scope",
    body:
      "MediHelp is designed to help users organise records, understand documents, discover care providers, and explore health-related workflows. It does not replace licensed medical advice, diagnosis, or emergency services."
  },
  {
    title: "User Responsibilities",
    body:
      "Users are responsible for the accuracy of uploaded documents, profile details, and booking information. Healthcare decisions should always be confirmed with qualified professionals."
  },
  {
    title: "Demo Billing & Mock Payments",
    body:
      "Pricing plans, billing states, and checkout flows displayed in this version are demonstration-only. No real payment gateway, subscription billing, or charge collection is active unless explicitly added later."
  },
  {
    title: "Content & Availability",
    body:
      "Hospital, lab, medicine, and trial information may come from third-party or AI-assisted sources. Availability, pricing, and suitability can change and should be validated before any real-world action."
  },
  {
    title: "Limitation of Liability",
    body:
      "To the maximum extent permitted by law, MediHelp and its operators are not liable for clinical decisions, provider outcomes, or reliance on demo-only content. Production terms should be reviewed by legal counsel before launch."
  }
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#F8FAFC_0%,#EEF4FF_100%)] px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link className={cn(buttonVariants({ variant: "outline" }), "inline-flex")} href="/">
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-blue-600">Legal</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                Terms & Conditions
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                These demo terms describe how MediHelp is intended to be used in previews and prototype environments. They are not a substitute for final commercial terms.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-50 text-amber-700">
              <ShieldAlert className="h-7 w-7" />
            </div>
          </div>
        </Card>

        <div className="grid gap-5">
          {sections.map((section) => (
            <Card className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm" key={section.title}>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-950">{section.title}</h2>
                  <p className="mt-3 text-base leading-7 text-slate-600">{section.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

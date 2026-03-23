import Link from "next/link";
import { ChevronLeft, LockKeyhole, ShieldCheck } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const sections = [
  {
    title: "Information We Collect",
    body:
      "MediHelp may store profile details, uploaded medical records, appointment requests, search inputs, and product usage signals so the platform can organise health information and personalize care workflows."
  },
  {
    title: "How We Use Data",
    body:
      "We use data to provide document organisation, AI summaries, hospital and lab discovery, medicine assistance, and product analytics that help improve safety, readability, and care recommendations."
  },
  {
    title: "AI & Third-Party Services",
    body:
      "Some features may use external AI or healthcare data providers to generate summaries, trial matches, OCR results, or directory content. These integrations should be reviewed and production-hardened before launch."
  },
  {
    title: "Security & Retention",
    body:
      "We aim to protect health information with secure storage, authenticated access, and controlled workflows. Demo data and mock billing states may be stored locally in the browser for presentation purposes."
  },
  {
    title: "Your Choices",
    body:
      "Users can update profile information, sign out, manage uploads, and request account deletion. In a production release, export and consent management should be offered through dedicated settings."
  }
];

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                This page is a demo privacy policy for MediHelp stakeholder previews. It explains the intended data handling model for the platform at a high level and should be reviewed by legal counsel before production use.
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-700">
              <ShieldCheck className="h-7 w-7" />
            </div>
          </div>
        </Card>

        <div className="grid gap-5">
          {sections.map((section) => (
            <Card className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm" key={section.title}>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                  <LockKeyhole className="h-5 w-5" />
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

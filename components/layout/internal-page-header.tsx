import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function InternalPageHeader({
  eyebrow,
  title,
  description,
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
  actions
}: {
  eyebrow: string;
  title: string;
  description: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[32px] border border-slate-200 bg-[linear-gradient(135deg,#FFFFFF_0%,#F8FAFC_48%,#EEF4FF_100%)] px-6 py-8 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.28)] sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-3xl">
          <Link
            className={cn(buttonVariants({ variant: "outline" }), "mb-5 inline-flex w-fit")}
            href={backHref}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Link>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-600">{eyebrow}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
        </div>
        {actions ? <div className="lg:max-w-md">{actions}</div> : null}
      </div>
    </section>
  );
}

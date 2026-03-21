import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <Card className="flex flex-col items-center gap-4 rounded-2xl border-dashed border-slate-200 px-6 py-10 text-center">
      <img
        alt="Empty state illustration"
        className="h-28 w-28"
        src="/illustrations/empty-state.svg"
      />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="max-w-md text-sm text-slate-500">{description}</p>
      </div>
      {ctaHref && ctaLabel ? (
        <Link href={ctaHref}>
          <Button>{ctaLabel}</Button>
        </Link>
      ) : null}
    </Card>
  );
}

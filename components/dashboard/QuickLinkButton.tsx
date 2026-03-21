import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function QuickLinkButton({
  href,
  label
}: {
  href: string;
  label: string;
}) {
  return (
    <Link href={href}>
      <Button className="min-w-[180px] justify-between" variant="outline">
        {label}
        <ArrowRight className="h-4 w-4" />
      </Button>
    </Link>
  );
}

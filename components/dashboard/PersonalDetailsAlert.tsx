import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PersonalDetailsAlert({
  name,
  missingDob
}: {
  name?: string | null;
  missingDob: boolean;
}) {
  return (
    <Card className="h-full border-blue-100 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          Keep track of your personal details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-600">
          {missingDob
            ? "Your date of birth is still missing, which can matter for trial matching and appointments."
            : `${name || "Your"} profile is set up. Review it regularly so hospitals and labs can use the right details.`}
        </p>
        <Link href="/profile">
          <Button variant="secondary">Review Profile</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

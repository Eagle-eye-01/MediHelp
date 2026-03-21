import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { TrialResult } from "@/types";

export function TrialCard({
  trial
}: {
  trial: TrialResult;
}) {
  return (
    <Card className="flex cursor-pointer flex-col gap-3 p-4 hover:shadow-md active:scale-95">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{trial.trialName}</h3>
          <p className="text-sm text-slate-500">{trial.location}</p>
        </div>
        <Badge>{trial.matchScore}% match</Badge>
      </div>
      <p className="text-sm font-medium text-green-700">{trial.status}</p>
      <p className="text-sm text-slate-600">{trial.description}</p>
      <p className="text-sm text-slate-600">{trial.contact}</p>
      <Button variant="outline">View Full Trial</Button>
    </Card>
  );
}

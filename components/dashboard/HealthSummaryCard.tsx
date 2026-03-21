import { FileStack, Activity, CalendarClock } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";

export function HealthSummaryCard({
  totalDocuments,
  lastUploadDate
}: {
  totalDocuments: number;
  lastUploadDate?: string | null;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardDescription>Health activity at a glance</CardDescription>
        <CardTitle>MediHelp Health Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-700">Documents stored</p>
            <p className="text-2xl font-semibold text-slate-900">{totalDocuments}</p>
          </div>
          <FileStack className="h-5 w-5 text-blue-700" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-100 p-3">
            <Activity className="h-4 w-4 text-primary" />
            <p className="mt-2 text-xs text-slate-500">Tracked trend</p>
            <p className="text-sm font-semibold text-slate-900">Uploads over time</p>
          </div>
          <div className="rounded-xl border border-slate-100 p-3">
            <CalendarClock className="h-4 w-4 text-primary" />
            <p className="mt-2 text-xs text-slate-500">Latest update</p>
            <p className="text-sm font-semibold text-slate-900">{formatDate(lastUploadDate)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

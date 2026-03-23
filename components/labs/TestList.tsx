import { Star } from "lucide-react";
import { useState } from "react";

import { LabBookingSheet } from "@/components/LabBookingSheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { LabTest } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function TestList({
  tests,
  labName
}: {
  tests: LabTest[];
  labName: string;
}) {
  const [selectedTest, setSelectedTest] = useState<LabTest | null>(null);

  return (
    <>
      <div className="grid gap-3">
        {tests.map((test) => (
          <Card className="flex flex-col gap-3 p-4" key={test.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-900">{test.test_name}</h3>
                <p className="text-sm text-slate-500">{test.test_type}</p>
              </div>
              <p className="text-sm font-semibold text-primary">{formatCurrency(test.price)}</p>
            </div>
            <div className="space-y-2">
              {test.reviews.map((review, index) => (
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-600" key={`${test.id}-${index}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900">{review.author}</span>
                    <span className="flex items-center gap-1 text-amber-600">
                      <Star className="h-3 w-3 fill-current" />
                      {review.rating}
                    </span>
                  </div>
                  <p className="mt-1">{review.comment}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setSelectedTest(test)} variant="secondary">
                Book now
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <LabBookingSheet
        labName={labName}
        onClose={() => setSelectedTest(null)}
        open={Boolean(selectedTest)}
        price={selectedTest?.price || 499}
        testName={selectedTest?.test_name}
      />
    </>
  );
}

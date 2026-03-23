"use client";

import { MockPaymentSheet } from "@/components/MockPaymentSheet";

export function LabBookingSheet({
  open,
  onClose,
  labName,
  testName,
  price = 499
}: {
  open: boolean;
  onClose: () => void;
  labName?: string;
  testName?: string;
  price?: number;
}) {
  return (
    <MockPaymentSheet
      amount={price}
      confirmLabel="Confirm booking"
      description="A mock partner commission booking flow for diagnostics."
      itemName={testName || "Selected test"}
      merchantName={labName || "Selected lab"}
      onClose={onClose}
      open={open}
      successMessage="Booking confirmed! You'll receive a confirmation shortly."
      title="Confirm lab booking"
    />
  );
}

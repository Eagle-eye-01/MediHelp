"use client";

import { BadgeCheck, Building2, CreditCard, Landmark, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "@/components/ui/responsive-modal";

const PAYMENT_METHODS = [
  {
    id: "upi",
    label: "UPI",
    hint: "GPay, PhonePe, Paytm",
    icon: Smartphone
  },
  {
    id: "card",
    label: "Card",
    hint: "Visa, Mastercard, Amex",
    icon: CreditCard
  },
  {
    id: "netbanking",
    label: "Net Banking",
    hint: "All major banks",
    icon: Landmark
  }
] as const;

export function MockPaymentSheet({
  open,
  onClose,
  title,
  description,
  merchantName,
  itemName,
  amount,
  confirmLabel = "Confirm payment",
  successMessage = "Payment confirmed in demo mode.",
  onConfirm
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  merchantName: string;
  itemName: string;
  amount: number;
  confirmLabel?: string;
  successMessage?: string;
  onConfirm?: (paymentMethod: string) => Promise<void> | void;
}) {
  const [paymentMethod, setPaymentMethod] = useState<string>("upi");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!open) {
      setPaymentMethod("upi");
      setProcessing(false);
    }
  }, [open]);

  async function handleConfirm() {
    try {
      setProcessing(true);
      await onConfirm?.(paymentMethod);
      await new Promise((resolve) => window.setTimeout(resolve, 700));
      toast.success(successMessage);
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to complete the payment demo.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <ResponsiveModal description={description} onClose={onClose} open={open} title={title}>
      <div className="space-y-5">
        <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-semibold text-slate-950">{merchantName}</p>
            <Badge className="bg-emerald-100 text-emerald-700">Demo gateway</Badge>
          </div>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Paying for</p>
              <p className="mt-1 font-semibold text-slate-950">{itemName}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Amount</p>
              <p className="mt-1 text-2xl font-semibold text-slate-950">Rs. {amount}</p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-950">Select payment method</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {PAYMENT_METHODS.map((method) => (
              <button
                className={`rounded-[22px] border px-4 py-4 text-left transition-all active:scale-95 ${
                  paymentMethod === method.id
                    ? "border-blue-300 bg-blue-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                type="button"
              >
                <method.icon className="h-5 w-5 text-slate-700" />
                <p className="mt-3 font-semibold text-slate-950">{method.label}</p>
                <p className="mt-1 text-sm text-slate-500">{method.hint}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-dashed border-slate-200 bg-white p-4 text-sm text-slate-600">
          <div className="flex items-center gap-2 text-slate-900">
            <BadgeCheck className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold">Mock checkout mode</span>
          </div>
          <p className="mt-2">
            This simulates the payment gateway handoff for demos only. No real charge is created.
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button disabled={processing} onClick={handleConfirm}>
            {processing ? "Processing..." : confirmLabel}
          </Button>
        </div>
      </div>
    </ResponsiveModal>
  );
}

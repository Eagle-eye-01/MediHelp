"use client";

import { useState } from "react";
import { Phone, Star } from "lucide-react";

import { MockPaymentSheet } from "@/components/MockPaymentSheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MedicineStore } from "@/types";
import { formatCurrency } from "@/lib/utils";

export function PharmacyCard({
  store,
  medicineName
}: {
  store: MedicineStore;
  medicineName?: string;
}) {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const medicine = store.medicines.find((item) =>
    medicineName ? item.name.toLowerCase().includes(medicineName.toLowerCase()) : item.available
  );

  return (
    <>
      <Card className="flex cursor-pointer flex-col gap-3 p-4 hover:shadow-md active:scale-95">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-slate-900">{store.name}</h3>
            <p className="text-sm text-slate-500">{store.location}</p>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            <Star className="h-3 w-3 fill-current" />
            {store.rating}
          </span>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          {medicine ? (
            <>
              <p className="font-semibold text-slate-900">{medicine.name}</p>
              <p className="mt-1">
                Price: <span className="font-medium">{formatCurrency(medicine.price)}</span>
              </p>
              <p className="mt-1">{medicine.available ? "In stock" : "Out of stock"}</p>
            </>
          ) : (
            <p>Contact the pharmacy to compare availability and pricing.</p>
          )}
        </div>
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Phone className="h-4 w-4 text-primary" />
          {store.contact}
        </p>
        <Button
          disabled={!medicine?.available}
          onClick={() => setCheckoutOpen(true)}
          variant="secondary"
        >
          {medicine?.available ? "Buy with demo checkout" : "Currently unavailable"}
        </Button>
      </Card>

      <MockPaymentSheet
        amount={medicine?.price || 0}
        confirmLabel="Confirm purchase"
        description="A mock pharmacy purchase flow for demoing medicine marketplace revenue."
        itemName={medicine?.name || "Selected medicine"}
        merchantName={store.name}
        onClose={() => setCheckoutOpen(false)}
        open={checkoutOpen}
        successMessage="Purchase request confirmed! The pharmacy will contact you shortly."
        title="Medicine checkout"
      />
    </>
  );
}

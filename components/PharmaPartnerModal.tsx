"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PharmaPartnerModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: ""
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    toast.success("Thanks! We'll be in touch within 2 business days.");
    onClose();
  }

  return (
    <ResponsiveModal
      description="A mock partner workflow for CRO and pharma stakeholders."
      onClose={onClose}
      open={open}
      title="Partner with MediHelp"
    >
      <div className="space-y-6">
        <ul className="space-y-2 text-sm text-slate-600">
          <li>AI-matched patient pipeline</li>
          <li>Consent-first approach</li>
          <li>Volume pricing available</li>
        </ul>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <Input
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            placeholder="Your name"
            required
            value={form.name}
          />
          <Input
            onChange={(event) =>
              setForm((current) => ({ ...current, company: event.target.value }))
            }
            placeholder="Company"
            required
            value={form.company}
          />
          <Input
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email"
            required
            type="email"
            value={form.email}
          />
          <div className="flex justify-end">
            <Button type="submit">Request access</Button>
          </div>
        </form>
      </div>
    </ResponsiveModal>
  );
}

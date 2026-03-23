"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { MockPaymentSheet } from "@/components/MockPaymentSheet";
import { DoctorCard } from "@/components/hospital/DoctorCard";
import { FilterPanel } from "@/components/hospital/FilterPanel";
import { HospitalCard } from "@/components/hospital/HospitalCard";
import { LocationMap } from "@/components/hospital/LocationMap";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Textarea } from "@/components/ui/textarea";
import type { Doctor, HospitalWithDoctors } from "@/types";

const CONSULTATION_FEE = 799;

export function HospitalExplorer({
  hospitals,
  recentSummaries
}: {
  hospitals: HospitalWithDoctors[];
  recentSummaries: string[];
}) {
  const [condition, setCondition] = useState("");
  const [surgery, setSurgery] = useState("");
  const [selectedHospitalId, setSelectedHospitalId] = useState(hospitals[0]?.id || "");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const filteredHospitals = useMemo(() => {
    return hospitals.filter((hospital) => {
      const matchCondition = condition
        ? hospital.specializations.some((specialization) =>
            specialization.toLowerCase().includes(condition.toLowerCase())
          )
        : true;
      const matchSurgery = surgery
        ? hospital.doctors.some((doctor) =>
            doctor.specialization.toLowerCase().includes(surgery.toLowerCase())
          )
        : true;
      return matchCondition && matchSurgery;
    });
  }, [condition, hospitals, surgery]);

  const selectedHospital =
    filteredHospitals.find((hospital) => hospital.id === selectedHospitalId) || filteredHospitals[0];

  function resetBookingFlow() {
    setSelectedDoctor(null);
    setMessage("");
    setPaymentOpen(false);
  }

  async function handleBook() {
    if (!selectedDoctor) {
      return;
    }

    try {
      setBooking(true);
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          message,
          medicalHistory: recentSummaries.slice(0, 3)
        })
      });

      if (!response.ok) {
        throw new Error("Unable to book appointment");
      }

      resetBookingFlow();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Booking failed");
      throw error;
    } finally {
      setBooking(false);
    }
  }

  return (
    <>
      <div className="space-y-4">
        <LocationMap
          points={filteredHospitals.map((hospital) => ({
            id: hospital.id,
            label: hospital.name,
            lat: hospital.coordinates.lat,
            lng: hospital.coordinates.lng
          }))}
          title="Track location of user"
        />
        <div className="flex h-full flex-col gap-4 lg:flex-row">
          <div className="w-full flex-shrink-0 lg:w-64">
            <FilterPanel
              description="Narrow the list by condition or surgery focus."
              title="Hospital Filters"
            >
              <div className="space-y-2">
                <Label>Disease / condition</Label>
                <Input
                  onChange={(event) => setCondition(event.target.value)}
                  placeholder="Cardiology, thyroid, ortho"
                  value={condition}
                />
              </div>
              <div className="space-y-2">
                <Label>Medical surgery</Label>
                <Input
                  onChange={(event) => setSurgery(event.target.value)}
                  placeholder="General surgery, ENT, oncology"
                  value={surgery}
                />
              </div>
            </FilterPanel>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-4 sm:flex-row">
            <div className="w-full space-y-4 overflow-y-auto sm:w-2/5 lg:w-1/3">
              {filteredHospitals.length ? (
                filteredHospitals.map((hospital) => (
                  <HospitalCard
                    active={selectedHospital?.id === hospital.id}
                    hospital={hospital}
                    key={hospital.id}
                    onClick={() => setSelectedHospitalId(hospital.id)}
                  />
                ))
              ) : (
                <EmptyState
                  description="Try changing the condition or surgery filters to see more hospitals."
                  title="No hospitals found"
                />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-4 overflow-y-auto">
              {selectedHospital ? (
                <>
                  <div className="rounded-2xl border border-slate-100 bg-white p-5">
                    <h2 className="text-lg font-semibold text-slate-900">{selectedHospital.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">{selectedHospital.location}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedHospital.specializations.map((specialization) => (
                        <span
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                          key={specialization}
                        >
                          {specialization}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4">
                    {selectedHospital.doctors.map((doctor) => (
                      <DoctorCard doctor={doctor} key={doctor.id} onBook={setSelectedDoctor} />
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <ResponsiveModal
        description="Your last three document summaries will be shared as medical history."
        onClose={resetBookingFlow}
        open={Boolean(selectedDoctor) && !paymentOpen}
        title={selectedDoctor ? `Book with ${selectedDoctor.name}` : "Book Appointment"}
      >
        <div className="space-y-4">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Shared medical history</p>
            <ul className="mt-2 space-y-2 text-sm text-slate-600">
              {recentSummaries.slice(0, 3).map((summary, index) => (
                <li key={index}>{summary}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-900">
            Consultation fee: <span className="font-semibold">Rs. {CONSULTATION_FEE}</span>
          </div>
          <div className="space-y-2">
            <Label>Your message</Label>
            <Textarea
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Mention preferred time, symptoms, or anything the doctor should know."
              value={message}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setPaymentOpen(true)}>Continue to payment</Button>
          </div>
        </div>
      </ResponsiveModal>

      <MockPaymentSheet
        amount={CONSULTATION_FEE}
        confirmLabel={booking ? "Booking..." : "Pay & confirm appointment"}
        description="A mock hospital checkout flow to demonstrate care booking revenue."
        itemName={selectedDoctor ? `Appointment with ${selectedDoctor.name}` : "Appointment"}
        merchantName={selectedHospital?.name || "Selected hospital"}
        onClose={() => setPaymentOpen(false)}
        onConfirm={handleBook}
        open={paymentOpen && Boolean(selectedDoctor)}
        successMessage="Appointment confirmed! The hospital team will contact you shortly."
        title="Hospital payment"
      />
    </>
  );
}

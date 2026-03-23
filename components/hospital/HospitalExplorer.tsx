"use client";

import { useEffect, useMemo, useState } from "react";
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
import { useGeolocation } from "@/lib/hooks/useGeolocation";
import { calculateDistanceKm, formatCoordinates, formatDistanceKm } from "@/lib/utils";
import type { Doctor, HospitalWithDoctors } from "@/types";

const CONSULTATION_FEE = 799;
const NEARBY_HOSPITAL_RADIUS_KM = 35;
const MAX_NEARBY_HOSPITALS = 6;

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
  const { coords, loading: locationLoading, error: locationError } = useGeolocation({ immediate: true });

  const filteredHospitals = useMemo(() => {
    const rankedHospitals = hospitals
      .filter((hospital) => {
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
      })
      .map((hospital) => ({
        ...hospital,
        distanceKm: coords
          ? calculateDistanceKm(
              coords.latitude,
              coords.longitude,
              hospital.coordinates.lat,
              hospital.coordinates.lng
            )
          : null
      }))
      .sort((a, b) => {
        if (a.distanceKm != null && b.distanceKm != null && a.distanceKm !== b.distanceKm) {
          return a.distanceKm - b.distanceKm;
        }

        return b.rating - a.rating;
      });

    if (!coords) {
      return rankedHospitals.slice(0, MAX_NEARBY_HOSPITALS);
    }

    const nearbyHospitals = rankedHospitals.filter(
      (hospital) =>
        hospital.distanceKm != null && hospital.distanceKm <= NEARBY_HOSPITAL_RADIUS_KM
    );

    return nearbyHospitals.slice(0, MAX_NEARBY_HOSPITALS);
  }, [condition, coords, hospitals, surgery]);

  const selectedHospital =
    filteredHospitals.find((hospital) => hospital.id === selectedHospitalId) || filteredHospitals[0];

  useEffect(() => {
    if (!filteredHospitals.some((hospital) => hospital.id === selectedHospitalId)) {
      setSelectedHospitalId(filteredHospitals[0]?.id || "");
    }
  }, [filteredHospitals, selectedHospitalId]);

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
          title="Nearby hospitals and your location"
          userLocation={coords}
        />
        <div className="rounded-2xl border border-blue-100 bg-white px-5 py-4">
          <p className="text-sm font-semibold text-slate-950">Live recommendation status</p>
          <p className="mt-2 text-sm text-slate-600">
            {coords
              ? `Using your live location (${formatCoordinates(coords.latitude, coords.longitude)}) to show hospitals within ${NEARBY_HOSPITAL_RADIUS_KM} km of you.`
              : locationLoading
                ? "Detecting your live location to find nearby hospitals."
                : locationError || "Location permission not available. Showing the strongest default hospital matches only."}
          </p>
        </div>
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
                filteredHospitals.map((hospital, index) => (
                  <HospitalCard
                    active={selectedHospital?.id === hospital.id}
                    distanceKm={hospital.distanceKm}
                    hospital={hospital}
                    key={hospital.id}
                    onClick={() => setSelectedHospitalId(hospital.id)}
                    recommended={Boolean(coords) && index === 0}
                  />
                ))
              ) : (
                <EmptyState
                  description={
                    coords
                      ? "No hospitals matched both your filters and nearby radius. Try another condition or widen the search by moving location settings."
                      : "No hospitals matched the current filters. Try another condition or surgery focus."
                  }
                  title="No nearby hospitals found"
                />
              )}
            </div>
            <div className="min-w-0 flex-1 space-y-4 overflow-y-auto">
              {selectedHospital ? (
                <>
                  <div className="rounded-2xl border border-slate-100 bg-white p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-slate-900">{selectedHospital.name}</h2>
                        <p className="mt-2 text-sm text-slate-500">{selectedHospital.location}</p>
                      </div>
                      {selectedHospital.distanceKm != null ? (
                        <div className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                          {formatDistanceKm(selectedHospital.distanceKm)}
                        </div>
                      ) : null}
                    </div>
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

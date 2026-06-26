"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAvailableSlotsAction } from "@/actions/availability-public";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useBookingStore } from "@/store/booking-store";

function randomItem(list: any[]) {
  if (!list.length) return null;
  return list[Math.floor(Math.random() * list.length)];
}

export function Step4StaffDate({ service }: { service: any }) {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotError, setSlotError] = useState("");
  const [debugInfo, setDebugInfo] = useState<any>(null);

  const selectedStaffId = useBookingStore((state) => state.selectedStaffId);
  const selectedDate = useBookingStore((state) => state.selectedDate);
  const selectedTime = useBookingStore((state) => state.selectedTime);
  const setSelectedStaffId = useBookingStore((state) => state.setSelectedStaffId);
  const setSelectedDate = useBookingStore((state) => state.setSelectedDate);
  const setSelectedTime = useBookingStore((state) => state.setSelectedTime);
  const nextStep = useBookingStore((state) => state.nextStep);
  const prevStep = useBookingStore((state) => state.prevStep);

  useEffect(() => {
    async function loadStaff() {
      try {
        const ids = Array.isArray(service?.staffIds) ? service.staffIds : [];

        const results = await Promise.all(
          ids.map(async (id: string) => {
            const snap = await getDoc(doc(db, "staff", id));
            return {
              requestedId: id,
              exists: snap.exists(),
              data: snap.exists() ? { id: snap.id, ...snap.data() } : null,
            };
          })
        );

        const rows = results
          .filter((item) => item.exists && item.data)
          .map((item) => item.data);

        setStaffList(rows);
        setDebugInfo({
          serviceId: service?.id,
          serviceName: service?.name,
          serviceStaffIds: ids,
          fetchedStaff: results,
        });
      } catch (error) {
        console.error("Failed to load staff", error);
        setDebugInfo({
          error: String(error),
          serviceStaffIds: Array.isArray(service?.staffIds) ? service.staffIds : [],
        });
      } finally {
        setLoadingStaff(false);
      }
    }

    loadStaff();
  }, [service]);

  useEffect(() => {
    async function loadSlots() {
      if (!selectedStaffId || !selectedDate) {
        setSlots([]);
        return;
      }

      setLoadingSlots(true);
      setSlotError("");

      try {
        const formData = new FormData();
        formData.set("staffId", selectedStaffId);
        formData.set("date", selectedDate);
        formData.set("serviceId", service.id || service.slug);

        const result = await getAvailableSlotsAction(formData);

        if (result?.error) {
          setSlotError(result.error);
          setSlots([]);
          return;
        }

        setSlots(result?.slots || []);
      } catch (error) {
        console.error("Failed to load slots", error);
        setSlotError("Failed to load slots.");
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }

    loadSlots();
  }, [selectedStaffId, selectedDate, service]);

  const chooseAnyone = () => {
    const picked = randomItem(staffList);
    if (picked?.id) {
      setSelectedStaffId(picked.id);
      setSelectedTime("");
    }
  };

  const canNext = !!selectedStaffId && !!selectedDate && !!selectedTime;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Choose provider and date</h2>
        <p className="text-sm text-muted-foreground">
          Pick a provider, choose a date, then select from available time slots.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Service provider</p>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={chooseAnyone}>
            Anyone
          </Button>

          {loadingStaff ? (
            <p className="text-sm text-muted-foreground">Loading staff...</p>
          ) : staffList.length === 0 ? (
            <p className="text-sm text-red-500">No staff found for this service.</p>
          ) : (
            staffList.map((staff) => (
              <Button
                key={staff.id}
                type="button"
                variant={selectedStaffId === staff.id ? "default" : "outline"}
                onClick={() => {
                  setSelectedStaffId(staff.id);
                  setSelectedTime("");
                }}
              >
                {staff.name}
              </Button>
            ))
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Date</p>

        <Calendar
          mode="single"
          selected={selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined}
          onSelect={(date) => {
            if (!date) return;
            setSelectedDate(format(date, "yyyy-MM-dd"));
            setSelectedTime("");
          }}
          className="rounded-md border"
        />
      </div>

      {selectedDate && selectedStaffId ? (
        <div className="space-y-3">
          <p className="text-sm font-medium">Available slots</p>

          {loadingSlots ? (
            <p className="text-sm text-muted-foreground">Loading slots...</p>
          ) : slotError ? (
            <p className="text-sm text-red-500">{slotError}</p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No available slots for the selected date.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <Button
                  key={slot}
                  type="button"
                  variant={selectedTime === slot ? "default" : "outline"}
                  onClick={() => setSelectedTime(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {debugInfo ? (
        <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      ) : null}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep} disabled={!canNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
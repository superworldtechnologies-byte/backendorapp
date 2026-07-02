"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAvailableSlotsAction } from "@/actions/availability-public";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBookingStore } from "@/store/booking-store";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock,
  Loader2,
  Check,
  UserRound,
} from "lucide-react";

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
  const [, setDebugInfo] = useState<any>(null);

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

  const selectedStaff = staffList.find((staff) => staff.id === selectedStaffId);

  return (
    <div className="space-y-6 bg-background">
      <div className="px-1">
        <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
          Provider & Date
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a provider, choose a date, then select an available slot.
        </p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Service provider</p>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={chooseAnyone}
            className="rounded-xl"
          >
            Anyone
          </Button>

          {loadingStaff ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading staff...
            </div>
          ) : staffList.length === 0 ? (
            <p className="text-sm text-destructive">
              No staff found for this service.
            </p>
          ) : (
            staffList.map((staff) => (
              <Button
                key={staff.id}
                type="button"
                variant={selectedStaffId === staff.id ? "default" : "outline"}
                className="rounded-xl"
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

      <div className="overflow-hidden rounded-2xl border bg-background">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full border-b p-4 sm:p-6 lg:w-1/2 lg:border-b-0 lg:border-r">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-foreground">Select Date</h3>
              <p className="text-sm text-muted-foreground">
                Pick a day for your appointment.
              </p>
            </div>

            <div className="inline-block w-full rounded-xl border bg-background p-2 shadow-sm">
              <Calendar
                mode="single"
                selected={selectedDate ? new Date(`${selectedDate}T00:00:00`) : undefined}
                onSelect={(date) => {
                  if (!date) return;
                  setSelectedDate(format(date, "yyyy-MM-dd"));
                  setSelectedTime("");
                }}
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
                className="w-full rounded-md"
                classNames={{
                  selected:
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  today: "bg-muted text-foreground font-semibold",
                }}
              />
            </div>
          </div>

          <div className="flex min-h-[340px] flex-1 flex-col lg:w-1/2">
            <div className="flex items-center justify-between border-b bg-background px-4 py-4 sm:px-6">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground sm:text-base">
                  <Clock className="h-4 w-4 text-primary" />
                  Available Time Slots
                </h3>
                <p className="truncate text-xs text-muted-foreground sm:text-sm">
                  {selectedDate
                    ? format(new Date(`${selectedDate}T00:00:00`), "EEEE, MMMM d")
                    : "No date selected"}
                  {selectedStaff ? ` • ${selectedStaff.name}` : ""}
                </p>
              </div>

              {slots.length > 0 ? (
                <Badge variant="secondary" className="rounded-full">
                  {slots.length} slots
                </Badge>
              ) : null}
            </div>

            <ScrollArea className="h-[320px] sm:h-[360px]">
              <div className="p-4 sm:p-6">
                {!selectedDate ? (
                  <div className="flex min-h-[220px] flex-col items-center justify-center text-center text-muted-foreground">
                    <CalendarDays className="mb-3 h-10 w-10 opacity-30" />
                    <p className="text-sm">Please select a date from the calendar</p>
                  </div>
                ) : !selectedStaffId ? (
                  <div className="flex min-h-[220px] flex-col items-center justify-center text-center text-muted-foreground">
                    <UserRound className="mb-3 h-10 w-10 opacity-30" />
                    <p className="text-sm">Please choose a provider first</p>
                  </div>
                ) : loadingSlots ? (
                  <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                    <Loader2 className="mb-3 h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Finding available slots...
                    </p>
                  </div>
                ) : slotError ? (
                  <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
                    <p className="text-sm font-medium text-destructive">{slotError}</p>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="flex min-h-[220px] flex-col items-center justify-center text-center text-muted-foreground">
                    <Clock className="mb-3 h-10 w-10 opacity-30" />
                    <p className="text-sm font-medium text-foreground">
                      No slots available
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try selecting another date
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
                    {slots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                          selectedTime === slot
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background text-foreground hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        {selectedTime === slot ? (
                          <span className="flex items-center justify-center gap-1.5">
                            <Check className="h-3.5 w-3.5" />
                            {slot}
                          </span>
                        ) : (
                          slot
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-4 sm:pt-6">
        <Button  onClick={prevStep}           className=" bg-transparent text-primary border border-primary hover:bg-primary/5  shadow  "
>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          onClick={nextStep}
          disabled={!canNext}
          className="min-w-[140px] rounded-xl px-6"
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
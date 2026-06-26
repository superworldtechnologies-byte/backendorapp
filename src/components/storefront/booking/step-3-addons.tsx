"use client";

import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";

export function Step3Addons({ service }: { service: any }) {
  const selectedAddOns = useBookingStore((state) => state.selectedAddOns);
  const toggleAddOn = useBookingStore((state) => state.toggleAddOn);
  const nextStep = useBookingStore((state) => state.nextStep);
  const prevStep = useBookingStore((state) => state.prevStep);

  const addOns = Array.isArray(service?.addOns) ? service.addOns : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Add-ons</h2>
        <p className="text-sm text-muted-foreground">
          Select optional add-ons for this service.
        </p>
      </div>

      {addOns.length === 0 ? (
        <p className="text-sm text-muted-foreground">No add-ons available.</p>
      ) : (
        <div className="grid gap-4">
          {addOns.map((addon: any) => {
            const active = selectedAddOns.some((item) => item.id === addon.id);

            return (
              <button
                key={addon.id}
                type="button"
                onClick={() => toggleAddOn(addon)}
                className={`rounded-xl border p-4 text-left transition ${
                  active ? "border-primary bg-primary/5" : "hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium">{addon.name}</p>
                    <p className="text-sm text-muted-foreground">
                      +₹{addon.price} • {addon.durationMinutes || 0} mins
                    </p>
                  </div>
                  <div className="text-sm">{active ? "Selected" : "Select"}</div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
}
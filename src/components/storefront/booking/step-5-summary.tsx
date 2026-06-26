"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { createBookingAction } from "@/actions/bookings";
import { applyCouponAction } from "@/actions/coupons-public";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBookingStore } from "@/store/booking-store";

export function Step5Summary() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [couponPending, startCouponTransition] = useTransition();
  const [error, setError] = useState("");
  const [couponError, setCouponError] = useState("");

  const {
    service,
    customer,
    selectedPet,
    selectedAddOns,
    selectedStaffId,
    selectedDate,
    selectedTime,
    couponCode,
    couponDiscount,
    notes,
    totalPrice,
    setCouponCode,
    setCouponDiscount,
    prevStep,
    resetBooking,
  } = useBookingStore();

  const applyCoupon = () => {
    setCouponError("");

    const formData = new FormData();
    formData.set("code", couponCode);
    formData.set("customerId", customer.phone);
    formData.set("basePrice", String(totalPrice));

    startCouponTransition(async () => {
      const result = await applyCouponAction(formData);
      if (result?.error) {
        setCouponError(result.error);
        setCouponDiscount(0);
        return;
      }
      setCouponDiscount(Number(result.discount || 0));
    });
  };

  const createBooking = () => {
    setError("");

    if (!selectedPet?.id) {
      setError("Please select a pet.");
      return;
    }

    const formData = new FormData();
    formData.set("customerId", customer.phone);
    formData.set("petId", selectedPet.id);
    formData.set("serviceId", service.id || service.slug);
    formData.set("staffId", selectedStaffId);
    formData.set("date", selectedDate);
    formData.set("startTime", selectedTime);
    formData.set("endTime", selectedTime);
    formData.set("couponCode", couponCode);
    formData.set("totalPrice", String(totalPrice));
    formData.set("notes", notes || selectedPet.behaviorNotes || "");
    formData.set("addOnsJson", JSON.stringify(selectedAddOns));

    startTransition(async () => {
      const result = await createBookingAction(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }

      resetBooking();
      router.push("/booking/success");
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review and confirm</h2>
        <p className="text-sm text-muted-foreground">
          Check your booking summary and apply a coupon if available.
        </p>
      </div>

      <div className="space-y-3 rounded-xl border p-4 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Service</span>
          <span>{service?.name}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Pet</span>
          <span>{selectedPet?.name}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Date</span>
          <span>{selectedDate}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Time</span>
          <span>{selectedTime}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Add-ons</span>
          <span>{selectedAddOns.length}</span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Coupon discount</span>
          <span>-₹{couponDiscount}</span>
        </div>

        <div className="flex justify-between gap-4 text-base font-semibold">
          <span>Total</span>
          <span>₹{totalPrice}</span>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Coupon code</p>
        <div className="flex gap-2">
          <Input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="WELCOME10"
          />
          <Button
            type="button"
            variant="outline"
            onClick={applyCoupon}
            disabled={couponPending}
          >
            {couponPending ? "Applying..." : "Apply"}
          </Button>
        </div>
        {couponError ? <p className="text-sm text-red-500">{couponError}</p> : null}
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button onClick={createBooking} disabled={pending}>
          {pending ? "Booking..." : "Confirm Booking"}
        </Button>
      </div>
    </div>
  );
}
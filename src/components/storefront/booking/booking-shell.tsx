"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/store/booking-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Step1PetSelect } from "./step-1-pet-select";
import { Step2PetDetails } from "./step-2-pet-details";
import { Step3Addons } from "./step-3-addons";
import { Step4StaffDate } from "./step-4-staff-date";
import { Step5Summary } from "./step-5-summary";

export function BookingShell({
  customer,
  service,
  pets,
  serviceSlug,
}: {
  customer: any;
  service: any;
  pets: any[];
  serviceSlug: string;
}) {
  const step = useBookingStore((state) => state.step);
  const setService = useBookingStore((state) => state.setService);
  const setCustomer = useBookingStore((state) => state.setCustomer);
  const calculateTotal = useBookingStore((state) => state.calculateTotal);

  useEffect(() => {
    setService(service);
    setCustomer({
      phone: customer.phone,
      name: customer.name,
    });
    setTimeout(() => calculateTotal(), 0);
  }, [service, customer, setService, setCustomer, calculateTotal]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Book {service.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {step === 1 ? <Step1PetSelect pets={pets} serviceSlug={serviceSlug} /> : null}
            {step === 2 ? <Step2PetDetails /> : null}
            {step === 3 ? <Step3Addons service={service} /> : null}
            {step === 4 ? <Step4StaffDate service={service} /> : null}
            {step === 5 ? <Step5Summary /> : null}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className={step >= 1 ? "font-medium" : "text-muted-foreground"}>1. Select pet</div>
            <div className={step >= 2 ? "font-medium" : "text-muted-foreground"}>2. Pet details</div>
            <div className={step >= 3 ? "font-medium" : "text-muted-foreground"}>3. Add-ons</div>
            <div className={step >= 4 ? "font-medium" : "text-muted-foreground"}>4. Staff & date</div>
            <div className={step >= 5 ? "font-medium" : "text-muted-foreground"}>5. Summary</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
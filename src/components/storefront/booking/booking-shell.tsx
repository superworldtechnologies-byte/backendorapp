"use client";

import { useEffect } from "react";
import { useBookingStore } from "@/store/booking-store";
import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
} from "@/components/reui/stepper";
import { Badge } from "@/components/reui/badge";
import {
  PawPrintIcon,
  FileTextIcon,
  SparklesIcon,
  CalendarDaysIcon,
  ReceiptTextIcon,
  CheckIcon,
} from "lucide-react";

import { Step1PetSelect } from "./step-1-pet-select";
import { Step2PetDetails } from "./step-2-pet-details";
import { Step3Addons } from "./step-3-addons";
import { Step4StaffDate } from "./step-4-staff-date";
import { Step5Summary } from "./step-5-summary";

const bookingSteps = [
  {
    title: "Select Pet",
    icon: <PawPrintIcon className="size-4" />,
  },
  {
    title: "Pet Details",
    icon: <FileTextIcon className="size-4" />,
  },
  {
    title: "Add-ons",
    icon: <SparklesIcon className="size-4" />,
  },
  {
    title: "Staff & Date",
    icon: <CalendarDaysIcon className="size-4" />,
  },
  {
    title: "Summary",
    icon: <ReceiptTextIcon className="size-4" />,
  },
];

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

  const progress = (step / bookingSteps.length) * 100;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Book {service.name}
          </h1>
          <p className="text-sm text-muted-foreground">
            Complete each step to finish your booking.
          </p>
        </div>

        <div className="">
          <div className="space-y-5">
            

            {/* Mobile */}
            <div className="space-y-3 md:hidden">
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  {step < bookingSteps.length ? bookingSteps[step - 1]?.icon : <CheckIcon className="size-4" />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Current step
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {bookingSteps[step - 1]?.title}
                  </p>
                </div>
              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Desktop */}
            <Stepper
              value={step}
              className="hidden w-full md:block"
              indicators={{
                completed: <CheckIcon className="size-3.5" />,
              }}
            >
              <StepperNav className="gap-3">
                {bookingSteps.map((item, index) => (
                  <StepperItem
                    key={index}
                    step={index + 1}
                    className="relative flex-1 items-start"
                  >
                    <StepperTrigger
                      disabled
                      className="flex grow flex-col items-start justify-center gap-2.5"
                      asChild
                    >
                      <div>
                        <StepperIndicator className="data-[state=inactive]:border-border data-[state=inactive]:bg-background data-[state=inactive]:text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=completed]:border-primary data-[state=completed]:bg-primary size-9 border-2 data-[state=completed]:text-white">
                          {item.icon}
                        </StepperIndicator>

                        <div className="mt-3 flex flex-col items-start gap-1">
                          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                            Step {index + 1}
                          </div>

                          <StepperTitle className="text-start text-sm font-semibold text-foreground group-data-[state=inactive]/step:text-muted-foreground">
                            {item.title}
                          </StepperTitle>

                          <div>
                            <Badge
                              size="sm"
                              variant="primary-light"
                              className="hidden group-data-[state=active]/step:inline-flex"
                            >
                              In Progress
                            </Badge>
                            <Badge
                              variant="success-light"
                              size="sm"
                              className="hidden group-data-[state=completed]/step:inline-flex"
                            >
                              Completed
                            </Badge>
                            <Badge
                              variant="secondary"
                              size="sm"
                              className="hidden text-muted-foreground group-data-[state=inactive]/step:inline-flex"
                            >
                              Pending
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </StepperTrigger>

                    {bookingSteps.length > index + 1 && (
                      <StepperSeparator
                        className={`absolute top-4 left-10 h-px w-[calc(100%-2.5rem)] ${
                          step > index + 1 ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}
                  </StepperItem>
                ))}
              </StepperNav>

              <StepperPanel className="hidden">
                {bookingSteps.map((item, index) => (
                  <StepperContent key={index} value={index + 1}>
                    {item.title}
                  </StepperContent>
                ))}
              </StepperPanel>
            </Stepper>
          </div>
        </div>

        <div className="min-h-[320px]">
          {step === 1 ? <Step1PetSelect pets={pets} serviceSlug={serviceSlug} /> : null}
          {step === 2 ? <Step2PetDetails /> : null}
          {step === 3 ? <Step3Addons service={service} /> : null}
          {step === 4 ? <Step4StaffDate service={service} /> : null}
          {step === 5 ? <Step5Summary /> : null}
        </div>
      </div>
    </div>
  );
}
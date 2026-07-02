"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, PawPrint, Plus, ArrowRight } from "lucide-react";

export function Step1PetSelect({
  pets,
  serviceSlug,
}: {
  pets: any[];
  serviceSlug: string;
}) {
  const selectedPet = useBookingStore((state) => state.selectedPet);
  const setSelectedPet = useBookingStore((state) => state.setSelectedPet);
  const nextStep = useBookingStore((state) => state.nextStep);

  const addPetHref = serviceSlug
    ? `/booking/add-pet?service=${encodeURIComponent(serviceSlug)}`
    : "/booking/add-pet";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">Who is this booking for?</h2>
          <p className="text-sm text-muted-foreground">
            Select one pet profile to continue with this service.
          </p>
        </div>
{/* 
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={addPetHref} className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            Add New Pet
          </Link>
        </Button> */}
      </div>

      {pets.length === 0 ? (
        <div className="rounded-3xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
            <PawPrint className="size-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-base font-semibold">No pets found</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            You do not have any pets added to this account yet. Add your first pet to continue.
          </p>
          <Button asChild className="mt-6">
            <Link href={addPetHref}>Add your first pet</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => {
            const active = selectedPet?.id === pet.id;

            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => setSelectedPet(pet)}
                className={[
                  "group relative flex min-h-[220px] flex-col rounded-3xl border bg-card p-5 text-left shadow-sm transition-all",
                  active
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                    : "border-border/60 hover:border-primary/40 hover:bg-muted/30",
                ].join(" ")}
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                    <PawPrint className="size-5" />
                  </div>

                  <div className="flex items-center gap-2">
                    {pet.type ? (
                      <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px]">
                        {pet.type}
                      </Badge>
                    ) : null}

                    {active ? (
                      <span className="inline-flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <CheckCircle2 className="size-4" />
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {pet.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {pet.breed || "Unknown breed"}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      Age
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {pet.age || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted/50 p-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      Weight
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      {pet.weight ? `${pet.weight} kg` : "-"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-border/60 bg-background/80 px-3 py-2">
                  <p className="text-xs text-muted-foreground">
                    Size: <span className="font-medium text-foreground">{pet.size || "-"}</span>
                  </p>
                </div>

                <div className="mt-auto pt-5">
                  <div
                    className={[
                      "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                      active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {active ? "Selected" : "Tap to select"}
                  </div>
                </div>
              </button>
            );
          })}

          <Link
            href={addPetHref}
            className="group flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-background p-6 text-center transition hover:border-primary/50 hover:bg-muted/20"
          >
            <div className="flex size-14 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10">
              <Plus className="size-6 text-muted-foreground group-hover:text-primary" />
            </div>
            <p className="mt-4 text-sm font-semibold text-foreground">Add New Pet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create another pet profile for booking.
            </p>
          </Link>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Choose a pet to continue to the next step.
        </p>

        <Button onClick={nextStep} disabled={!selectedPet} className="min-w-[140px]">
          Continue
          <ArrowRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}
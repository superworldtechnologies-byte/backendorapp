"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useBookingStore } from "@/store/booking-store";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Choose your pet</h2>
          <p className="text-sm text-muted-foreground">
            Select one pet for this booking.
          </p>
        </div>

        <Button asChild variant="outline">
          <Link href={addPetHref}>Add New Pet</Link>
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">No pets found for your account.</p>
          <Button asChild className="mt-4">
            <Link href={addPetHref}>Add your first pet</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pets.map((pet) => {
            const active = selectedPet?.id === pet.id;

            return (
              <button
                key={pet.id}
                type="button"
                onClick={() => setSelectedPet(pet)}
                className={`rounded-xl border p-4 text-left transition ${
                  active ? "border-primary bg-primary/5" : "hover:bg-muted/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{pet.name}</p>
                    <p className="text-sm text-muted-foreground">{pet.breed}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">{pet.size}</div>
                </div>

                <div className="mt-3 text-sm text-muted-foreground">
                  Age: {pet.age || "-"} • Weight: {pet.weight || "-"} kg
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={nextStep} disabled={!selectedPet}>
          Next
        </Button>
      </div>
    </div>
  );
}
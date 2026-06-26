"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBookingStore } from "@/store/booking-store";

function getInitials(name: string) {
  return (
    name
      ?.trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase())
      .join("") || "PT"
  );
}

export function Step2PetDetails() {
  const selectedPet = useBookingStore((state) => state.selectedPet);
  const updateSelectedPet = useBookingStore((state) => state.updateSelectedPet);
  const nextStep = useBookingStore((state) => state.nextStep);
  const prevStep = useBookingStore((state) => state.prevStep);

  if (!selectedPet) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Please select a pet first.</p>
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
      </div>
    );
  }

  const canNext = typeof selectedPet.vaccinated === "boolean";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 rounded-xl border p-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={selectedPet.photoThumbBase64 || undefined}
            alt={selectedPet.name || "Pet"}
          />
          <AvatarFallback>{getInitials(selectedPet.name || "Pet")}</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-lg font-semibold">{selectedPet.name}</h2>
          <p className="text-sm text-muted-foreground">
            {selectedPet.breed} • {selectedPet.size || "Unknown size"}
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Pet details</h3>
        <p className="text-sm text-muted-foreground">
          Vaccination is required. Notes are optional.
        </p>
      </div>

      <div className="space-y-3">
        <Label>Vaccinated?</Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={selectedPet.vaccinated === true ? "default" : "outline"}
            onClick={() => updateSelectedPet({ vaccinated: true })}
          >
            Yes
          </Button>
          <Button
            type="button"
            variant={selectedPet.vaccinated === false ? "default" : "outline"}
            onClick={() => updateSelectedPet({ vaccinated: false })}
          >
            No
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Behavior notes</Label>
        <Textarea
          value={selectedPet.behaviorNotes || ""}
          onChange={(e) => updateSelectedPet({ behaviorNotes: e.target.value })}
          placeholder="Anxious around hair dryers, calm otherwise"
        />
      </div>

      <div className="space-y-2">
        <Label>Style preference</Label>
        <Textarea
          value={selectedPet.stylePreference || ""}
          onChange={(e) => updateSelectedPet({ stylePreference: e.target.value })}
          placeholder="Short summer trim"
        />
      </div>

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
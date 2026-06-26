"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import { addPetAction } from "@/actions/customers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AddPetState = {
  success?: boolean;
  error?: string;
  petId?: string;
};

const initialState: AddPetState = {
  success: false,
  error: "",
  petId: "",
};

export function AddPetForm({
  phone,
  serviceSlug,
}: {
  phone: string;
  serviceSlug: string;
}) {
  const router = useRouter();

  const actionWrapper = async (
    _prevState: AddPetState,
    formData: FormData
  ): Promise<AddPetState> => {
    const result = await addPetAction(formData);

    return {
      success: !!result?.success,
      error: result?.error || "",
      petId: result?.petId || "",
    };
  };

  const [state, formAction, pending] = useActionState(actionWrapper, initialState);

  useEffect(() => {
    if (!state?.success) return;

    const target = serviceSlug
      ? `/booking?service=${encodeURIComponent(serviceSlug)}`
      : "/booking";

    router.push(target);
    router.refresh();
  }, [state, router, serviceSlug]);

  return (
    <form action={formAction} className="space-y-5 rounded-2xl border bg-background p-6 shadow-sm">
      <input type="hidden" name="phone" value={phone} />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Pet name</Label>
          <Input id="name" name="name" placeholder="Buddy" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="breed">Breed</Label>
          <Input id="breed" name="breed" placeholder="Golden Retriever" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input id="age" name="age" type="number" min="0" placeholder="3" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input id="weight" name="weight" type="number" min="0" step="0.1" placeholder="28" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="size">Size</Label>
          <select
            id="size"
            name="size"
            required
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">Select size</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="xlarge">XLarge</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="behaviorNotes">Behavior notes</Label>
          <Textarea
            id="behaviorNotes"
            name="behaviorNotes"
            placeholder="Anxious around dryer, calm otherwise"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="stylePreference">Style preference</Label>
          <Textarea
            id="stylePreference"
            name="stylePreference"
            placeholder="Short summer trim"
          />
        </div>
      </div>

      {state?.error ? (
        <p className="text-sm text-red-500">{state.error}</p>
      ) : null}

      <div className="flex justify-end">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving..." : "Save pet and continue"}
        </Button>
      </div>
    </form>
  );
}
"use client";

import { useTransition } from "react";
import { updateAvailabilityAction } from "@/actions/availability";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function AvailabilityForm({
  staffId,
  initialAvailability,
}: {
  staffId: string;
  initialAvailability: any;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
          await updateAvailabilityAction(formData);
        });
      }}
      className="space-y-4"
    >
      <input type="hidden" name="staffId" value={staffId} />

      {days.map((day) => {
        const value = initialAvailability?.[day] || {};
        return (
          <Card key={day}>
            <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
              <div className="w-32 font-medium capitalize">{day}</div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={`${day}_enabled`} defaultChecked={value.enabled} />
                Enabled
              </label>

              <input
                type="time"
                name={`${day}_start`}
                defaultValue={value.start || ""}
                className="h-10 rounded-md border px-3"
              />

              <input
                type="time"
                name={`${day}_end`}
                defaultValue={value.end || ""}
                className="h-10 rounded-md border px-3"
              />
            </CardContent>
          </Card>
        );
      })}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save availability"}
      </Button>
    </form>
  );
}
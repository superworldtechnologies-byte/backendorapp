"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateAvailabilityAction } from "@/actions/availability";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type DayKey = (typeof DAYS)[number];

type DayAvailability = {
  enabled: boolean;
  start: string;
  end: string;
};

type AvailabilityMap = Record<DayKey, DayAvailability>;

const defaultAvailability: AvailabilityMap = {
  monday: { enabled: true, start: "09:00", end: "17:00" },
  tuesday: { enabled: true, start: "09:00", end: "17:00" },
  wednesday: { enabled: true, start: "09:00", end: "17:00" },
  thursday: { enabled: true, start: "09:00", end: "17:00" },
  friday: { enabled: true, start: "09:00", end: "17:00" },
  saturday: { enabled: true, start: "10:00", end: "14:00" },
  sunday: { enabled: false, start: "", end: "" },
};

export function AvailabilityClient({
  currentUserId,
  currentUserRole,
}: {
  currentUserId: string;
  currentUserRole: string;
}) {
  const [pending, startTransition] = useTransition();
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState(currentUserId);
  const [staffDoc, setStaffDoc] = useState<any | null>(null);
  const [availability, setAvailability] = useState<AvailabilityMap>(defaultAvailability);
  const [savedMessage, setSavedMessage] = useState("");

  const canManageOthers = currentUserRole === "root_admin";

  useEffect(() => {
    if (!canManageOthers) return;

    const q = query(collection(db, "staff"), orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rows = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setStaffList(rows);
    });

    return () => unsubscribe();
  }, [canManageOthers]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "staff", selectedStaffId), (snapshot) => {
      const data = snapshot.data() || null;
      setStaffDoc(data);

      const nextAvailability = data?.availability || defaultAvailability;

      setAvailability({
        monday: nextAvailability.monday || defaultAvailability.monday,
        tuesday: nextAvailability.tuesday || defaultAvailability.tuesday,
        wednesday: nextAvailability.wednesday || defaultAvailability.wednesday,
        thursday: nextAvailability.thursday || defaultAvailability.thursday,
        friday: nextAvailability.friday || defaultAvailability.friday,
        saturday: nextAvailability.saturday || defaultAvailability.saturday,
        sunday: nextAvailability.sunday || defaultAvailability.sunday,
      });
    });

    return () => unsubscribe();
  }, [selectedStaffId]);

  const updateDay = (day: DayKey, patch: Partial<DayAvailability>) => {
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        ...patch,
      },
    }));
  };

  const save = () => {
    setSavedMessage("");

    const formData = new FormData();
    formData.set("staffId", selectedStaffId);

    for (const day of DAYS) {
      formData.set(`${day}_enabled`, availability[day].enabled ? "true" : "false");
      formData.set(`${day}_start`, availability[day].start || "");
      formData.set(`${day}_end`, availability[day].end || "");
    }

    startTransition(async () => {
      const result = await updateAvailabilityAction(formData);
      if (result?.success) {
        setSavedMessage("Availability saved.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {canManageOthers ? (
        <Card>
          <CardHeader>
            <CardTitle>Select staff member</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger className="w-full md:w-[360px]">
                <SelectValue placeholder="Select staff" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name || member.email || member.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>
            {staffDoc?.name || "Staff"} Availability
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Real-time working days and hours from Firestore.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {DAYS.map((day) => {
            const item = availability[day];

            return (
              <div
                key={day}
                className="rounded-xl border p-4 space-y-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium capitalize">{day}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.enabled ? "Working day" : "Day off"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Label htmlFor={`${day}_enabled`}>
                      {item.enabled ? "Active" : "Day off"}
                    </Label>
                    <Switch
                      id={`${day}_enabled`}
                      checked={item.enabled}
                      onCheckedChange={(checked) =>
                        updateDay(day, {
                          enabled: checked,
                          start: checked ? item.start || "09:00" : "",
                          end: checked ? item.end || "17:00" : "",
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start time</Label>
                    <input
                      type="time"
                      value={item.start}
                      disabled={!item.enabled}
                      onChange={(e) => updateDay(day, { start: e.target.value })}
                      className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm disabled:opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>End time</Label>
                    <input
                      type="time"
                      value={item.end}
                      disabled={!item.enabled}
                      onChange={(e) => updateDay(day, { end: e.target.value })}
                      className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={save} disabled={pending}>
              {pending ? "Saving..." : "Save availability"}
            </Button>

            {savedMessage ? (
              <p className="text-sm text-emerald-600">{savedMessage}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
"use client";

import { useEffect, useState, useTransition } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { updateAvailabilityAction } from "@/actions/availability";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, User, CheckCircle2, Clock } from "lucide-react";

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

// Generate 30-minute intervals for Shadcn Select (00:00 to 23:30)
const TIME_OPTIONS = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, "0");
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour}:${minute}`;
});

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
        setSavedMessage("Availability successfully updated.");
        setTimeout(() => setSavedMessage(""), 3000);
      }
    });
  };

  return (
    <div className="space-y-6 w-full">
      {canManageOthers && (
        <Card className="w-full border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" />
              Manage Staff Schedule
            </CardTitle>
            <CardDescription>Select a team member to view or edit their working hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
              <SelectTrigger className="w-full md:max-w-md">
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
      )}

      <Card className="w-full border-slate-200 shadow-sm dark:border-slate-800">
        <CardHeader className="pb-6 border-b border-slate-100 dark:border-slate-800/60">
          <CardTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-6 w-6 text-primary" />
            {staffDoc?.name ? `${staffDoc.name}'s Weekly Hours` : "Weekly Schedule"}
          </CardTitle>
          <CardDescription>
            Toggle days on or off and select working hours using the dropdowns.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6 space-y-3">
          {DAYS.map((day) => {
            const item = availability[day];

            return (
              <div
                key={day}
                className={`flex w-full flex-col md:flex-row md:items-center justify-between rounded-xl border p-4 transition-colors duration-200 ${
                  item.enabled
                    ? "border-blue-100 bg-blue-50/40 dark:border-blue-900/30 dark:bg-blue-900/10"
                    : "border-slate-100 bg-slate-50/50 opacity-75 dark:border-slate-800 dark:bg-slate-900/20"
                }`}
              >
                {/* Left Side: Toggle & Day Name */}
                <div className="flex items-center gap-4 md:w-[250px]">
                  <Switch
                    checked={item.enabled}
                    onCheckedChange={(checked) =>
                      updateDay(day, {
                        enabled: checked,
                        start: checked ? item.start || "09:00" : "",
                        end: checked ? item.end || "17:00" : "",
                      })
                    }
                  />
                  <div className="flex flex-col">
                    <Label className={`text-base font-semibold capitalize cursor-pointer ${item.enabled ? "text-blue-950 dark:text-blue-100" : "text-slate-500"}`}>
                      {day}
                    </Label>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {item.enabled ? "Working Day" : "Day Off"}
                    </span>
                  </div>
                </div>

                {/* Right Side: Time Pickers */}
                {item.enabled ? (
                  <div className="flex flex-1 items-center gap-3 mt-4 md:mt-0 md:justify-end">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Clock className="h-4 w-4 text-slate-400 hidden md:block" />
                      <Select 
                        value={item.start} 
                        onValueChange={(val) => updateDay(day, { start: val })}
                      >
                        <SelectTrigger className="w-full md:w-[130px] bg-white dark:bg-slate-950">
                          <SelectValue placeholder="Start" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px]">
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={`start-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <span className="text-sm font-medium text-slate-400">to</span>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <Select 
                        value={item.end} 
                        onValueChange={(val) => updateDay(day, { end: val })}
                      >
                        <SelectTrigger className="w-full md:w-[130px] bg-white dark:bg-slate-950">
                          <SelectValue placeholder="End" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[250px]">
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={`end-${time}`} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 items-center md:justify-end mt-4 md:mt-0">
                    <span className="text-sm font-medium text-slate-400 italic px-4 py-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-md w-full md:w-[305px] text-center">
                      Not Available
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 mt-4">
            <Button 
              onClick={save} 
              disabled={pending}
              className="w-full sm:w-auto min-w-[160px] bg-blue-600 hover:bg-blue-700 text-white"
            >
              {pending ? "Saving Changes..." : "Save Availability"}
            </Button>

            {savedMessage && (
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/40 px-4 py-2 rounded-md w-full sm:w-auto animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 className="h-4 w-4" />
                {savedMessage}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
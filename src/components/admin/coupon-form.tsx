"use client";

import { useState, useTransition } from "react";
import { saveCouponAction } from "@/actions/coupons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, Percent, IndianRupee, User, Users, Infinity } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function CouponForm({
  coupon,
  onDone,
}: {
  coupon?: any;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const [date, setDate] = useState<Date | undefined>(
    coupon?.expiresAt ? new Date(coupon.expiresAt) : undefined
  );
  const [isActive, setIsActive] = useState<boolean>(coupon?.active ?? true);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await saveCouponAction(formData);
      if (result?.error) {
        setError(result.error);
        return;
      }
      onDone();
    });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Coupon Code</Label>
        <Input
          name="code"
          defaultValue={coupon?.code || ""}
          placeholder="e.g. SUMMER25"
          required
          className="h-9 text-sm font-medium"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Discount Type</Label>
          <Select name="type" defaultValue={coupon?.type || "percent"}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percent" className="text-emerald-700 dark:text-emerald-400 font-medium">
                <div className="flex items-center gap-2">
                  <Percent className="h-3.5 w-3.5" /> Percentage
                </div>
              </SelectItem>
              <SelectItem value="flat" className="text-primary dark:text-blue-400 font-medium">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-3.5 w-3.5" /> Flat Amount
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</Label>
          <Input
            name="value"
            type="number"
            defaultValue={coupon?.value || 0}
            placeholder="0"
            required
            className="h-9 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Usage Limit</Label>
        <Select name="usageLimit" defaultValue={coupon?.usageLimit || "per_user"}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Select limit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="per_user" className="text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-indigo-500" /> Per User
              </div>
            </SelectItem>
            <SelectItem value="once" className="text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5 text-amber-500" /> Single Use (Once)
              </div>
            </SelectItem>
            <SelectItem value="unlimited" className="text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Infinity className="h-3.5 w-3.5 text-emerald-500" /> Unlimited
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5 flex flex-col">
        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expiration Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal bg-white text-black hover:bg-white ",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
          </PopoverContent>
        </Popover>
        <input
          type="hidden"
          name="expiresAt"
          value={date ? date.toISOString() : ""}
        />
      </div>

      <div className="flex flex-row items-center justify-between rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 p-3 mt-2">
        <div className="space-y-0.5">
          <Label className="text-sm font-semibold">Active Status</Label>
          <p className="text-xs text-muted-foreground">
            Allow customers to use this code.
          </p>
        </div>
        <Switch
          checked={isActive}
          onCheckedChange={setIsActive}
          className="data-[state=checked]:bg-emerald-500"
        />
        {isActive && <input type="hidden" name="active" value="on" />}
      </div>

      {error ? (
        <div className="rounded-md bg-rose-50 p-2 text-sm text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 mt-2">
          {error}
        </div>
      ) : null}

      <Button type="submit" disabled={pending} className="w-full ">
        {pending ? (
          "Saving..."
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {coupon ? "Save Changes" : "Create Coupon"}
          </>
        )}
      </Button>
    </form>
  );
}
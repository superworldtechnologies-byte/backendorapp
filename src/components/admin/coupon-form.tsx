"use client";

import { useState, useTransition } from "react";
import { saveCouponAction } from "@/actions/coupons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CouponForm({
  coupon,
  onDone,
}: {
  coupon?: any;
  onDone: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

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
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2">
        <Label>Coupon code</Label>
        <Input name="code" defaultValue={coupon?.code || ""} required />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <select
          name="type"
          defaultValue={coupon?.type || "percent"}
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="percent">Percent</option>
          <option value="flat">Flat</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Value</Label>
        <Input name="value" type="number" defaultValue={coupon?.value || 0} required />
      </div>

      <div className="space-y-2">
        <Label>Usage limit</Label>
        <select
          name="usageLimit"
          defaultValue={coupon?.usageLimit || "per_user"}
          className="flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="per_user">Per user</option>
          <option value="once">Once</option>
          <option value="unlimited">Unlimited</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label>Expires at</Label>
        <Input
          name="expiresAt"
          type="datetime-local"
          defaultValue={coupon?.expiresAt ? coupon.expiresAt.slice(0, 16) : ""}
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="active" defaultChecked={coupon?.active ?? true} />
        Active coupon
      </label>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : coupon ? "Save Coupon" : "Create Coupon"}
      </Button>
    </form>
  );
}
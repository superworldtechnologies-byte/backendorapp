"use client";

import { useState } from "react";
import { Plus, TicketPercent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { CouponForm } from "./coupon-form";
import { deleteCouponAction } from "@/actions/coupons";

export function CouponsClient({ initialCoupons }: { initialCoupons: any[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create Coupon
        </Button>
      </div>

      {initialCoupons.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              <TicketPercent className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-lg font-semibold">No coupons yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first coupon for the storefront checkout.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {initialCoupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{coupon.code}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {coupon.type === "percent" ? `${coupon.value}% off` : `₹${coupon.value} off`}
                  </p>
                </div>

                <Badge variant={coupon.active ? "default" : "secondary"}>
                  {coupon.active ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>

              <CardContent className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditing(coupon);
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>

                <form action={deleteCouponAction as unknown as (formData: FormData) => Promise<void>}>
                  <input type="hidden" name="couponId" value={coupon.id} />
                  <Button type="submit" variant="outline">
                    Delete
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{editing ? "Edit Coupon" : "Create Coupon"}</SheetTitle>
          </SheetHeader>

          <div className="mt-6">
            <CouponForm coupon={editing} onDone={() => setOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
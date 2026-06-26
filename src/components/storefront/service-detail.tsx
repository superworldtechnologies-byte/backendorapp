import Link from "next/link";
import { Clock3, Star, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewList } from "./review-list";

export function ServiceDetail({
  service,
  reviews,
}: {
  service: any;
  reviews: any[];
}) {
  const included = Array.isArray(service?.included) ? service.included : [];
  const addOns = Array.isArray(service?.addOns) ? service.addOns : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold">{service.name}</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            {service.description || "No description"}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock3 className="h-4 w-4" />
              <span>{service.durationMinutes || 0} mins</span>
            </div>

            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>
                {service.reviewsSummary?.avg || 0} ({service.reviewsSummary?.count || 0} reviews)
              </span>
            </div>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">What’s included</h2>
          {included.length ? (
            <div className="grid gap-2">
              {included.map((item: string) => (
                <div key={item} className="rounded-lg border p-3 text-sm">
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No included items listed.</p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Add-ons</h2>
          {addOns.length ? (
            <div className="grid gap-3">
              {addOns.map((addon: any) => (
                <div key={addon.id} className="rounded-xl border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium">{addon.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {addon.durationMinutes || 0} mins
                      </p>
                    </div>
                    <div className="font-medium">₹{addon.price || 0}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No add-ons available.</p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Recent reviews</h2>
          <ReviewList reviews={reviews} />
        </section>
      </div>

      <div>
        <div className="sticky top-6 rounded-2xl border bg-background p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Starting from</p>
          <div className="mt-1 text-3xl font-semibold">₹{service.basePrice || 0}</div>

          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <div>{service.durationMinutes || 0} minute appointment</div>
            <div>{service.staffIds?.length || 0} provider options</div>
          </div>

          <Button asChild className="mt-6 w-full">
            <Link href={`/booking?service=${service.slug || service.id}`}>Book now</Link>
          </Button>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Ticket className="h-4 w-4" />
            <span>Coupon can be applied at checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import { Clock3, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServiceList({ services }: { services: any[] }) {
  if (!services.length) {
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">No services available right now.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <div key={service.id} className="rounded-2xl border bg-background p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{service.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {service.description || "No description"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock3 className="h-4 w-4" />
              <span>{service.durationMinutes || 0} mins</span>
            </div>

            <div className="flex items-center gap-1">
              <Star className="h-4 w-4" />
              <span>
                {service.reviewsSummary?.avg || 0} ({service.reviewsSummary?.count || 0})
              </span>
            </div>
          </div>

          <div className="mt-4 text-sm">
            Starting at <span className="font-semibold">₹{service.basePrice || 0}</span>
          </div>

          <div className="mt-5 flex gap-2">
            <Button asChild className="w-full">
              <Link href={`/services/${service.slug || service.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
import { ServicesCard } from "./services-card";

export function ServiceList({ services }: { services: any[] }) {
  if (!services.length) {
    return (
      <div className="rounded-3xl border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No services available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {services.map((service) => (
        <ServicesCard
          key={service.id}
          service={service}
        />
      ))}
    </div>
  );
}
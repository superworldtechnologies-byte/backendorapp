// app/admin/(protected)/availability/page.tsx
import { requireAdminSession } from "@/lib/auth";
import { AvailabilityClient } from "@/components/admin/availability-client";

export default async function AvailabilityPage() {
  const session = await requireAdminSession();

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Update your working days and hours.
        </p>
      </div>

      <AvailabilityClient
        currentUserId={session.id}
        currentUserRole={session.role}
      />
    </div>
  );
}
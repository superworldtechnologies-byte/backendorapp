import { getAnalyticsOverview } from "@/actions/analytics";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

export default async function AnalyticsPage() {
  const data = await getAnalyticsOverview();

  return (
    <div className="space-y-6">
      <div className="border-b border-border pb-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Analytics
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Storefront analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visitors, sources, countries, devices, and booking conversion for public storefront traffic.
        </p>
      </div>

      <AnalyticsDashboard
        visitors={data.visitors}
        customers={data.customers}
        bookings={data.bookings}
      />
    </div>
  );
}
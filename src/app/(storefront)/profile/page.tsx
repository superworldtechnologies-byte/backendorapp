import { getCustomerProfileAction } from "@/actions/customer-portal";

function formatDate(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ProfilePage() {
  const { customer, reviews } = await getCustomerProfileAction();

  return (
    <section className="space-y-6 px-3 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-20">
      <div>
        <h2 className="text-2xl font-semibold text-zinc-900">My profile</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Review your account details, booking history summary, and customer reviews.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900">Profile details</h3>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-zinc-50 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Name</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{customer?.name || "—"}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Phone</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{customer?.phone || "—"}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Created</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{formatDate(customer?.createdAt || null)}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Last visit</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{formatDate(customer?.lastVisit || null)}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Total bookings</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{customer?.totalBookings ?? 0}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Push devices</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{customer?.devices?.length ?? 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-zinc-900">My reviews</h3>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              {reviews.length} reviews
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-8 text-center">
              <p className="text-sm text-zinc-600">No reviews found yet for this account.</p>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {reviews.map((review) => (
                <article key={review.id} className="rounded-2xl border border-zinc-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-medium text-zinc-900">{review.title}</h4>
                      <p className="mt-1 text-xs text-zinc-500">{formatDate(review.createdAt)}</p>
                    </div>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900">
                      {review.rating || 0}/5
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600">{review.body || "No review text added."}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
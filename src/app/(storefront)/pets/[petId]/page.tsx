import Link from "next/link";
import { getPetDetailsAction } from "@/actions/customer-portal";

function formatDate(value: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function PetDetailsPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;
  const { pet, bookings } = await getPetDetailsAction(petId);

  if (!pet) {
    return (
      <section className="px-3 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-20 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center">
        <h2 className="text-xl font-semibold text-zinc-900">Pet not found</h2>
        <p className="mt-2 text-sm text-zinc-600">
          We could not find this pet in your account.
        </p>
        <Link href="/pets" className="mt-4 inline-flex rounded-full bg-[#FFC357] px-5 py-2.5 text-sm font-medium text-zinc-900">
          Back to pets
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Pet profile</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-900">{pet.name}</h2>
          <p className="mt-1 text-sm text-zinc-600">{pet.breed} · {pet.size}</p>
        </div>
        <Link href="/pets" className="inline-flex w-fit rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700">
          Back to pets
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-zinc-900">Pet details</h3>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
              ID: {pet.id}
            </span>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Age</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{pet.age ?? "—"}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Weight</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{pet.weight ?? "—"} kg</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Vaccinated</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{pet.vaccinated ? "Yes" : "No"}</p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Updated</p>
              <p className="mt-2 text-sm font-medium text-zinc-900">{formatDate(pet.updatedAt || "")}</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            <div className="rounded-2xl border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-900">Behavior notes</p>
              <p className="mt-2 text-sm text-zinc-600">{pet.behaviorNotes || "No behavior notes added yet."}</p>
            </div>
            <div className="rounded-2xl border border-zinc-200 p-4">
              <p className="text-sm font-medium text-zinc-900">Style preference</p>
              <p className="mt-2 text-sm text-zinc-600">{pet.stylePreference || "No style preference saved yet."}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-zinc-900">Bookings for this pet</h3>

          {bookings.length === 0 ? (
            <p className="mt-4 text-sm text-zinc-600">No bookings found for this pet yet.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {bookings.map((booking) => (
                <div key={booking.id} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{booking.serviceName}</p>
                      <p className="mt-1 text-xs text-zinc-600">{formatDate(booking.date)} · {booking.startTime} to {booking.endTime}</p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-wide text-zinc-600">
                      {booking.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-zinc-600">Handled by {booking.staffName}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
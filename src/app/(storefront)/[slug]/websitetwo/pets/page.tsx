import Link from "next/link";
import { getCustomerPetsAction } from "@/actions/customer-portal";

function formatBoolean(value: boolean) {
  return value ? "Yes" : "No";
}

export default async function PetsPage() {
  const pets = await getCustomerPetsAction();

  return (
    <section className="space-y-6 px-3 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">My pets</h2>
          <p className="mt-1 text-sm text-zinc-600">
            View your pet profiles, health notes, and grooming preferences.
          </p>
        </div>
        <Link
          href="/services"
          className="inline-flex w-fit items-center rounded-full border border-zinc-200 px-5 py-2.5 text-sm font-medium text-zinc-700"
        >
          Add another booking
        </Link>
      </div>

      {pets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 px-6 py-10 text-center">
          <h3 className="text-lg font-medium text-zinc-900">No pets found</h3>
          <p className="mt-2 text-sm text-zinc-600">
            Your saved pet profiles will appear here after your first booking.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {pets.map((pet) => (
            <Link
              key={pet.id}
              href={`/pets/${pet.id}`}
              className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">{pet.name}</h3>
                  <p className="mt-1 text-sm text-zinc-600">{pet.breed}</p>
                </div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-900">
                  {pet.size}
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Age</p>
                  <p className="mt-2 text-sm font-medium text-zinc-900">{pet.age ?? "—"}</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Weight</p>
                  <p className="mt-2 text-sm font-medium text-zinc-900">{pet.weight ?? "—"} kg</p>
                </div>
                <div className="rounded-2xl bg-zinc-50 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Vaccinated</p>
                  <p className="mt-2 text-sm font-medium text-zinc-900">{formatBoolean(pet.vaccinated)}</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm text-zinc-600">Open full pet details</p>
                <span className="text-sm font-medium text-zinc-900 transition group-hover:translate-x-0.5">View</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
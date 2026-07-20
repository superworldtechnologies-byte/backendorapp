import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AddPetForm } from "@/components/storefront/booking/add-pet-form";

export default async function AddPetPage({
  searchParams,
}: {
  searchParams: { serviceSlug?: string };
}) {
  const cookieStore = await cookies();
  const customerPhone = cookieStore.get("customerPhone")?.value;
  const serviceSlug = searchParams.serviceSlug ?? "";

  if (!customerPhone) {
    redirect("/auth?next=/booking/add-pet");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Add new pet</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your pet profile and return to booking.
        </p>

        <div className="mt-6">
          <AddPetForm phone={customerPhone} serviceSlug={serviceSlug} />
        </div>
      </div>
    </div>
  );
}
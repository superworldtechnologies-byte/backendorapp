import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BookingShell } from "@/components/storefront/booking/booking-shell";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const cookieStore = await cookies();
  const customerPhone = cookieStore.get("customerPhone")?.value;

  const params = await searchParams;
  const serviceSlug = params.service || "";

  if (!customerPhone) {
    const nextUrl = `/booking${serviceSlug ? `?service=${encodeURIComponent(serviceSlug)}` : ""}`;
    redirect(`/auth?next=${encodeURIComponent(nextUrl)}`);
  }

  if (!serviceSlug) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Missing service.</p>
      </div>
    );
  }

  const customerSnap = await getDoc(doc(db, "customers", customerPhone));
  const serviceSnap = await getDoc(doc(db, "services", serviceSlug));

  if (!customerSnap.exists() || !serviceSnap.exists()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Customer or service not found.</p>
      </div>
    );
  }

  const petsSnap = await getDocs(collection(db, "customers", customerPhone, "pets"));

  const customer = customerSnap.data();
  const service = { id: serviceSnap.id, ...serviceSnap.data() };
  const pets = petsSnap.docs.map((item) => ({ id: item.id, ...item.data() }));

  return (
      <BookingShell
        customer={customer}
        service={service}
        pets={pets}
        serviceSlug={serviceSlug}
      />
  );
}
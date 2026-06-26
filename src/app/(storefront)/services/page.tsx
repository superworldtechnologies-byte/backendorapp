import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ServiceList } from "@/components/storefront/service-list";

export default async function ServicesPage() {
  const servicesQuery = query(collection(db, "services"), where("active", "==", true));
  const servicesSnap = await getDocs(servicesQuery);

  const services = servicesSnap.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Services</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose the grooming service that fits your pet best.
        </p>
      </div>

      <ServiceList services={services} />
    </div>
  );
}
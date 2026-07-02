export const dynamic = "force-dynamic";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ServiceList } from "@/components/storefront/service-list";
import PawIcon from "@/icons/icon1";

export default async function ServicesPage() {
  const servicesSnap = await getDocs(collection(db, "services"));

  const allServices = servicesSnap.docs.map((item) => ({
    id: item.id,
    slug: item.id,
    ...item.data(),
  }));

  const services = allServices.filter((service: any) => service.active === true);



  return (
    <div className="mx-auto mt-16 max-w-6xl px-4 py-10">
      {/* Heading */}
      <div className="mb-16 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <PawIcon className="h-6 w-6 text-[#FFC357]" />

          <span className="text-[17px] text-zinc-800">
            Services
          </span>
        </div>

        <h2 className="text-3xl md:text-5xl max-w-2xl  mx-auto text-zinc-800">
          Choose the grooming service that Fits Your Pet Best.
        </h2>
      </div>

      <ServiceList services={services} />
    </div>
  );
}
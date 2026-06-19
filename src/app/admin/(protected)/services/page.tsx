// app/admin/(protected)/services/page.tsx
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ServicesClient } from "@/components/admin/services-client";

export default async function ServicesPage() {
  const [servicesSnap, staffSnap] = await Promise.all([
    getDocs(collection(db, "services")),
    getDocs(collection(db, "staff")),
  ]);

  const services = servicesSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const staff = staffSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Services</h1>
        <p className="text-sm text-muted-foreground">
          Create, update, assign, and unassign services.
        </p>
      </div>

      <ServicesClient initialServices={services} staff={staff} />
    </div>
  );
}
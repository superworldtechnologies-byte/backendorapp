import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAdminSession } from "@/lib/auth";
import { ServicesClient } from "@/components/admin/services-client";
import { Briefcase } from "lucide-react";

export const dynamic = "force-dynamic";

type StaffMember = {
  id: string;
  name?: string;
  email?: string;
};

type ServiceItem = {
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  included?: string[];
  durationMinutes?: number;
  pricingModel?: "FIXED" | "WEIGHT_BASED";
  basePrice?: number | null;
  weightTiers?: any[];
  addOns?: any[];
  staffIds?: string[];
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

async function getServices(): Promise<ServiceItem[]> {
  const servicesRef = collection(db, "services");
  const snapshot = await getDocs(
    query(servicesRef, orderBy("updatedAt", "desc"))
  );

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      staffIds: Array.isArray(data.staffIds) ? data.staffIds : [],
      included: Array.isArray(data.included) ? data.included : [],
      addOns: Array.isArray(data.addOns) ? data.addOns : [],
      weightTiers: Array.isArray(data.weightTiers) ? data.weightTiers : [],
    } as ServiceItem;
  });
}

async function getStaff(): Promise<StaffMember[]> {
  const staffRef = collection(db, "staff");
  const snapshot = await getDocs(query(staffRef, orderBy("name", "asc")));

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name || "",
      email: data.email || "",
    };
  });
}

export default async function ServicesPage() {
  const session = await getAdminSession();
  const [services, staff] = await Promise.all([
    getServices(),
    getStaff(),
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-2">
        {/* Main Client Workspace */}
      <ServicesClient
        initialServices={services}
        staff={staff}
        currentUserId={session?.id}
      />
    </div>
  );
}
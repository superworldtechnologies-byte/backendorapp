import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CouponsClient } from "@/components/admin/coupons-client";

export default async function CouponsPage() {
  const snap = await getDocs(collection(db, "coupons"));

  const coupons = snap.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <p className="text-sm text-muted-foreground">
          Create and manage public and customer-specific coupons.
        </p>
      </div>

      <CouponsClient initialCoupons={coupons} />
    </div>
  );
}
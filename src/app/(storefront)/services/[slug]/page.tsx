import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ServiceDetail } from "@/components/storefront/service-detail";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const reviewsSnap = await getDocs(collection(db, "services", slug, "reviews"));
  const reviews = reviewsSnap.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));

  const serviceRef = await import("firebase/firestore").then(({ doc, getDoc }) =>
    getDoc(doc(db, "services", slug))
  );

  if (!serviceRef.exists()) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Service not found.</p>
      </div>
    );
  }

  const service = {
    id: serviceRef.id,
    ...serviceRef.data(),
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 mt-16">
      <ServiceDetail service={service} reviews={reviews} />
    </div>
  );
}
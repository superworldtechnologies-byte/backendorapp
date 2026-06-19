import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";

export default async function AnalyticsPage() {
  const visitorsSnap = await getDocs(collection(db, "visitors"));

  const visitors = visitorsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const sessionsNested = await Promise.all(
    visitorsSnap.docs.map((visitorDoc) =>
      getDocs(collection(db, "visitors", visitorDoc.id, "sessions"))
    )
  );

  const sessions = sessionsNested.flatMap((snap) =>
    snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Public storefront visitors, sessions, and source insights.
        </p>
      </div>

      <AnalyticsDashboard visitors={visitors} sessions={sessions} />
    </div>
  );
}
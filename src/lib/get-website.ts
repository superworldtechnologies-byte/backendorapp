// lib/get-website.ts
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getWebsiteData(slug: string) {
  try {
    const q = query(collection(db, "websites"), where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;
    return snapshot.docs[0].data();
  } catch (error) {
    console.error("Error fetching website:", error);
    return null;
  }
}
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function createDefaultCalendar({
  id,
  ownerEmail,
  name,
}: {
  id: string;
  ownerEmail: string;
  name: string;
}) {
  await setDoc(doc(db, "calendars", id), {
    ownerId: id,
    ownerEmail,
    name,
    color: "#0f766e",
    isDefault: true,
    createdAt: new Date().toISOString(),
  });

  return id;
}
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function createStaffProfile({
  id,
  name,
  email,
  password,
  role,
}: {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "root_admin" | "staff";
}) {
  await setDoc(doc(db, "staff", id), {
    name,
    email,
    password,
    role,
    availability: {
      monday: { enabled: true, start: "09:00", end: "17:00" },
      tuesday: { enabled: true, start: "09:00", end: "17:00" },
      wednesday: { enabled: true, start: "09:00", end: "17:00" },
      thursday: { enabled: true, start: "09:00", end: "17:00" },
      friday: { enabled: true, start: "09:00", end: "17:00" },
      saturday: { enabled: true, start: "10:00", end: "14:00" },
      sunday: { enabled: false, start: "", end: "" },
    },
    serviceIds: [],
    leaves: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
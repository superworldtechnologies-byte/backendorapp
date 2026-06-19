"use server";

import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { createDefaultCalendar } from "@/lib/calendars";
import { createStaffProfile } from "@/lib/staff";

type InviteStaffState = {
  error?: string;
  success?: string;
};

async function findAdminByEmail(email: string) {
  const q = query(collection(db, "admins"), where("email", "==", email));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const first = snap.docs[0];
  return {
    id: first.id,
    ...first.data(),
  } as any;
}

export async function inviteStaff(
  prevState: InviteStaffState,
  formData: FormData
): Promise<InviteStaffState> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();

  if (!name || !email || !password) {
    return { error: "Name, email and password are required." };
  }

  const existing = await findAdminByEmail(email);
  if (existing) {
    return { error: "Staff with this email already exists." };
  }

  const adminRef = doc(collection(db, "admins"));
  const userId = adminRef.id;

  await setDoc(adminRef, {
    name,
    email,
    password,
    role: "staff",
    active: true,
    defaultCalendarId: userId,
    createdAt: new Date().toISOString(),
  });

  await createDefaultCalendar({
    id: userId,
    ownerEmail: email,
    name: `${name} Calendar`,
  });

  await createStaffProfile({
    id: userId,
    name,
    email,
    password,
    role: "staff",
  });

  return { success: "Staff invited successfully." };
}
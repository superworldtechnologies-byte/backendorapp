"use server";

import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase";
import { createDefaultCalendar } from "@/lib/calendars";
import { createStaffProfile } from "@/lib/staff";
import { clearAdminSession, setAdminSession } from "@/lib/auth";

type LoginState = {
  error?: string;
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

export async function loginAdmin(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  let admin = await findAdminByEmail(email);

  if (!admin) {
    const envEmail = (process.env.ROOT_ADMIN_EMAIL || "").trim().toLowerCase();
    const envPassword = (process.env.ROOT_ADMIN_PASSWORD || "").trim();
    const envName = (process.env.ROOT_ADMIN_NAME || "Root Admin").trim();

    if (email === envEmail && password === envPassword) {
      const adminRef = doc(collection(db, "admins"));
      const userId = adminRef.id;

      await setDoc(adminRef, {
        name: envName,
        email,
        password,
        role: "root_admin",
        active: true,
        defaultCalendarId: userId,
        createdAt: new Date().toISOString(),
      });

      await createDefaultCalendar({
        id: userId,
        ownerEmail: email,
        name: `${envName} Calendar`,
      });

      await createStaffProfile({
        id: userId,
        name: envName,
        email,
        password,
        role: "root_admin",
      });

      admin = {
        id: userId,
        name: envName,
        email,
        password,
        role: "root_admin",
        active: true,
        defaultCalendarId: userId,
      };
    }
  }

  if (!admin) return { error: "Account not found." };
  if (!admin.active) return { error: "Account is inactive." };
  if (admin.password !== password) return { error: "Invalid password." };

  await setAdminSession({
    id: admin.id,
    email: admin.email,
    role: admin.role,
    name: admin.name,
  });

  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}
"use server";

import { redirect } from "next/navigation";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  setAdminCookie,
  signAdminToken,
  clearAdminCookie,
} from "@/lib/admin-auth";

export type AdminLoginState = {
  error: string | null;
};

export async function adminLoginAction(
  prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") || "").trim();

  if (!email || !password) {
    return {
      error: "Email and password are required",
    };
  }

  const rootEmail = process.env.ROOT_ADMIN_EMAIL?.trim().toLowerCase();

  const rootPassword = process.env.ROOT_ADMIN_PASSWORD?.trim();

  if (email === rootEmail && password === rootPassword) {
    const token = signAdminToken({
      email,
      role: "root-admin",
      loginType: "root",
    });

    await setAdminCookie(token);

    redirect("/admin");
  }

  const q = query(
    collection(db, "admins"),
    where("email", "==", email),
    where("isActive", "==", true),
    limit(1)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    return {
      error: "Admin not found",
    };
  }

  const admin = snap.docs[0].data();

  if (admin.password !== password) {
    return {
      error: "Invalid password",
    };
  }

  const token = signAdminToken({
    email,
    role: admin.role || "admin",
    loginType: "firebase",
  });

  await setAdminCookie(token);

  redirect("/admin");
}

export async function adminLogoutAction() {
  await clearAdminCookie();
  redirect("/admin/login");
}
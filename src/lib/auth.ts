import "server-only";

import { cookies } from "next/headers";
import { doc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { db } from "@/lib/firebase";

const COOKIE_NAME = "npc_admin_session";

type SessionPayload = {
  id: string;
  email: string;
  role: string;
  name: string;
};

export async function setAdminSession(session: SessionPayload) {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as SessionPayload;
    if (!parsed?.id || !parsed?.email) return null;

    const adminSnap = await getDoc(doc(db, "admins", parsed.id));
    if (!adminSnap.exists()) return null;

    const adminData = adminSnap.data();
    if (!adminData?.active) return null;

    return {
      id: parsed.id,
      email: parsed.email,
      role: adminData.role || parsed.role,
      name: adminData.name || parsed.name,
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

export async function requireRootAdmin() {
  const session = await requireAdminSession();
  if (session.role !== "root_admin") {
    redirect("/admin/login");
  }
  return session;
}
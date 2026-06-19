import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE_NAME = "petromus_admin_session";

export async function setAdminSession(session: {
  id: string;
  email: string;
  role: string;
  name: string;
}) {
  const cookieStore = await cookies();

  cookieStore.set(
    COOKIE_NAME,
    JSON.stringify(session),
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    }
  );
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const value = cookieStore.get(COOKIE_NAME)?.value;
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
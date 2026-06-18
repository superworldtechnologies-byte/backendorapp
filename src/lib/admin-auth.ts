import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "petromus_admin_token";

export type AdminJwtPayload = {
  email: string;
  role: string;
  loginType: "root" | "firebase";
};

export function signAdminToken(payload: AdminJwtPayload) {
  return jwt.sign(payload, process.env.ADMIN_JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, process.env.ADMIN_JWT_SECRET!) as AdminJwtPayload;
  } catch {
    return null;
  }
}

export async function setAdminCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export const ADMIN_COOKIE_NAME = ADMIN_COOKIE;
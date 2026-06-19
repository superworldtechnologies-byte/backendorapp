import { NextRequest, NextResponse } from "next/server";

function randomId(length = 20) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const hasVisitorId = request.cookies.get("visitorId")?.value;
  if (!hasVisitorId) {
    response.cookies.set("visitorId", randomId(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
"use server";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  addDoc,
} from "firebase/firestore";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/firebase";
import { getOrCreateVisitorId } from "@/lib/cookies";


function monthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function createId(length = 20) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export async function startSessionAction(formData: FormData) {
  const cookieStore = await cookies();
  const headersStore = await headers();

  const visitorId = cookieStore.get("visitorId")?.value;
  if (!visitorId) return { error: "Missing visitor id." };

  const sessionId = createId();
  const now = new Date().toISOString();
  const path = String(formData.get("path") || "/");
  const source = String(formData.get("source") || "direct");
  const referrerUrl = String(formData.get("referrerUrl") || "");
  const deviceJson = String(formData.get("deviceJson") || "{}");
  const isPWAInstalled = String(formData.get("isPWAInstalled") || "") === "true";
  const ip = headersStore.get("x-forwarded-for") || "unknown";

  let device = {};
  try {
    device = JSON.parse(deviceJson);
  } catch {}

  const visitorRef = doc(db, "visitors", visitorId);
  const sessionRef = doc(collection(db, "visitors", visitorId, "sessions"), sessionId);

  const visitorSnap = await getDoc(visitorRef);

  if (!visitorSnap.exists()) {
    await setDoc(visitorRef, {
      id: visitorId,
      ip,
      phone: null,
      device,
      isPWAInstalled,
      firstSource: source,
      firstSeenAt: now,
      lastSeenAt: now,
      totalVisits: 1,
      visitsByMonth: {
        [monthKey()]: 1,
      },
    });
  } else {
    await updateDoc(visitorRef, {
      lastSeenAt: now,
      totalVisits: increment(1),
      [`visitsByMonth.${monthKey()}`]: increment(1),
      device,
      isPWAInstalled,
    });
  }

  await setDoc(sessionRef, {
    id: sessionId,
    ip,
    device,
    isPWAInstalled,
    source,
    referrerUrl,
    pages: [
      {
        path,
        enteredAt: now,
        secondsSpent: 0,
      },
    ],
    startedAt: now,
    endedAt: now,
    totalDurationSeconds: 0,
  });

  return { sessionId };
}

export async function logPageViewAction(formData: FormData) {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("visitorId")?.value;
  if (!visitorId) return { error: "Missing visitor id." };

  const sessionId = String(formData.get("sessionId") || "");
  const path = String(formData.get("path") || "/");
  const secondsSpent = Number(formData.get("secondsSpent") || 0);
  const enteredAt = String(formData.get("enteredAt") || new Date().toISOString());

  if (!sessionId) return { error: "Missing session id." };

  const sessionRef = doc(db, "visitors", visitorId, "sessions", sessionId);
  const snap = await getDoc(sessionRef);
  if (!snap.exists()) return { error: "Session not found." };

  const data = snap.data();
  const pages = Array.isArray(data.pages) ? data.pages : [];

  pages.push({
    path,
    enteredAt,
    secondsSpent,
  });

  await updateDoc(sessionRef, {
    pages,
    endedAt: new Date().toISOString(),
    totalDurationSeconds: (data.totalDurationSeconds || 0) + secondsSpent,
  });

  return { success: true };
}

export async function linkVisitorToCustomerAction(formData: FormData) {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("visitorId")?.value;
  if (!visitorId) return { error: "Missing visitor id." };

  const phone = String(formData.get("phone") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const deviceJson = String(formData.get("deviceJson") || "{}");
  const isPWAInstalled = String(formData.get("isPWAInstalled") || "") === "true";

  if (!phone) return { error: "Phone required." };

  let device = {};
  try {
    device = JSON.parse(deviceJson);
  } catch {}

  const customerRef = doc(db, "customers", phone);
  const visitorRef = doc(db, "visitors", visitorId);

  const customerSnap = await getDoc(customerRef);

  if (!customerSnap.exists()) {
    await setDoc(customerRef, {
      id: phone,
      name,
      phone,
      linkedVisitorIds: [visitorId],
      devices: [{ ...device, isPWAInstalled }],
      totalVisits: 0,
      visitsByMonth: {},
      firstVisitSource: null,
      lastVisit: new Date().toISOString(),
      totalBookings: 0,
      createdAt: new Date().toISOString(),
    });
  } else {
    const customer = customerSnap.data();
    const linkedVisitorIds = Array.isArray(customer.linkedVisitorIds)
      ? customer.linkedVisitorIds
      : [];
    const devices = Array.isArray(customer.devices) ? customer.devices : [];

    const alreadyLinked = linkedVisitorIds.includes(visitorId);
    const nextVisitorIds = alreadyLinked
      ? linkedVisitorIds
      : [...linkedVisitorIds, visitorId];

    const nextDevice = { ...device, isPWAInstalled };
    const deviceExists = devices.some(
      (item: any) => JSON.stringify(item) === JSON.stringify(nextDevice)
    );

    await setDoc(
      customerRef,
      {
        name: customer.name || name || "",
        linkedVisitorIds: nextVisitorIds,
        devices: deviceExists ? devices : [...devices, nextDevice],
        lastVisit: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  await setDoc(
    visitorRef,
    {
      phone,
      lastSeenAt: new Date().toISOString(),
    },
    { merge: true }
  );

  return { success: true };
}


type LogPageViewInput = {
  path: string;
  fullPath?: string;
  referrerUrl?: string | null;
  userAgent?: string;
  isPWAInstalled?: boolean;
};

function detectDevice(userAgent = "") {
  const ua = userAgent.toLowerCase();

  const type =
    /mobile|android|iphone|ipod/.test(ua)
      ? "mobile"
      : /ipad|tablet/.test(ua)
      ? "tablet"
      : "desktop";

  const os = ua.includes("windows")
    ? "Windows"
    : ua.includes("mac os")
    ? "macOS"
    : ua.includes("android")
    ? "Android"
    : ua.includes("iphone") || ua.includes("ipad")
    ? "iOS"
    : ua.includes("linux")
    ? "Linux"
    : "Unknown";

  const browser = ua.includes("edg")
    ? "Edge"
    : ua.includes("chrome")
    ? "Chrome"
    : ua.includes("safari") && !ua.includes("chrome")
    ? "Safari"
    : ua.includes("firefox")
    ? "Firefox"
    : "Unknown";

  return { type, os, browser };
}

function parseSource(referrerUrl?: string | null) {
  if (!referrerUrl) return "direct";

  try {
    const hostname = new URL(referrerUrl).hostname.toLowerCase();

    if (hostname.includes("instagram")) return "instagram";
    if (hostname.includes("facebook")) return "facebook";
    if (hostname.includes("linkedin")) return "linkedin";
    if (hostname.includes("google")) return "google";
    if (hostname.includes("twitter") || hostname.includes("x.com")) return "twitter";
    if (hostname.includes("youtube")) return "youtube";
    return hostname;
  } catch {
    return "direct";
  }
}

function getMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function countryNameFromCode(code?: string | null) {
  if (!code) return "Unknown";
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) || code;
  } catch {
    return code;
  }
}

function toSafePageKey(path: string) {
  if (!path || path === "/") return "home";

  return path
    .replace(/^\/+/, "")
    .replace(/\/+/g, "_")
    .replace(/\[|\]|~|\*/g, "")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
}

export async function logPageView({
  path,
  fullPath,
  referrerUrl,
  userAgent,
  isPWAInstalled,
}: {
  path: string;
  fullPath?: string;
  referrerUrl?: string | null;
  userAgent?: string;
  isPWAInstalled?: boolean;
}) {
  const visitorId = await getOrCreateVisitorId();
  if (!visitorId) return { error: "Missing visitor id." };

  const now = new Date().toISOString();
  const safePageKey = toSafePageKey(path);
  const month = getMonthKey();
  const device = detectDevice(userAgent || "");
  const source = parseSource(referrerUrl);

  const visitorRef = doc(db, "visitors", visitorId);
  const visitorSnap = await getDoc(visitorRef);

  if (!visitorSnap.exists()) {
    await setDoc(visitorRef, {
      id: visitorId,
      phone: null,
      device,
      isPWAInstalled: !!isPWAInstalled,
      firstSource: source,
      firstSeenAt: now,
      lastSeenAt: now,
      totalVisits: 1,
      visitsByMonth: {
        [month]: 1,
      },
      pagesViewed: {
        [safePageKey]: 1,
      },
    });

    return { success: true, visitorId };
  }

  await updateDoc(visitorRef, {
    lastSeenAt: now,
    device,
    isPWAInstalled: !!isPWAInstalled,
    totalVisits: increment(1),
    [`visitsByMonth.${month}`]: increment(1),
    [`pagesViewed.${safePageKey}`]: increment(1),
  });

  return { success: true, visitorId };
}

export async function getAnalyticsOverview() {
  const [visitorsSnap, customersSnap, bookingsSnap] = await Promise.all([
    getDocs(collection(db, "visitors")),
    getDocs(collection(db, "customers")),
    getDocs(collection(db, "bookings")),
  ]);

  const visitors = visitorsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const customers = customersSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const bookings = bookingsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return { visitors, customers, bookings };
}

export async function getVisitorSessions(visitorId: string) {
  const sessionsSnap = await getDocs(collection(db, "visitors", visitorId, "sessions"));
  return sessionsSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}
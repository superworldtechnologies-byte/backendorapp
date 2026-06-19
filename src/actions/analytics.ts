"use server";

import {
  collection,
  doc,
  getDoc,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { cookies, headers } from "next/headers";
import { db } from "@/lib/firebase";

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
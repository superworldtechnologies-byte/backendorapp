"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { linkVisitorToCustomerAction } from "@/actions/analytics";


export async function getCustomerPhoneFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get("customerPhone")?.value || null;
}

async function setCustomerCookie(phone: string) {
  const cookieStore = await cookies();

  cookieStore.set("customerPhone", phone, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

function getSafeNextUrl(formData: FormData) {
  const raw = String(formData.get("next") || "/booking").trim();

  if (!raw.startsWith("/")) return "/booking";

  return raw;
}

export async function signupCustomerAction(formData: FormData) {
  const phone = String(formData.get("phone") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const nextUrl = getSafeNextUrl(formData);

  if (!phone) return { error: "Phone is required." };
  if (!name) return { error: "Name is required." };

  const customerRef = doc(db, "customers", phone);
  const snap = await getDoc(customerRef);

  if (!snap.exists()) {
    await setDoc(customerRef, {
      id: phone,
      name,
      phone,
      linkedVisitorIds: [],
      devices: [],
      totalVisits: 0,
      visitsByMonth: {},
      firstVisitSource: null,
      lastVisit: new Date().toISOString(),
      totalBookings: 0,
      createdAt: new Date().toISOString(),
    });
  }

  await linkVisitorToCustomerAction(formData);
  await setCustomerCookie(phone);

  redirect(nextUrl);
}

export async function signinCustomerAction(formData: FormData) {
  const phone = String(formData.get("phone") || "").trim();
  const nextUrl = getSafeNextUrl(formData);

  if (!phone) return { error: "Phone is required." };

  const customerRef = doc(db, "customers", phone);
  const snap = await getDoc(customerRef);

  if (!snap.exists()) {
    return { error: "Customer not found. Please sign up first." };
  }

  await linkVisitorToCustomerAction(formData);
  await setCustomerCookie(phone);

  redirect(nextUrl);
}

export async function addPetAction(formData: FormData) {
  const phone = String(formData.get("phone") || "").trim();
  if (!phone) return { error: "Missing customer phone." };

  const name = String(formData.get("name") || "").trim();
  const breed = String(formData.get("breed") || "").trim();
  const age = Number(formData.get("age") || 0);
  const weight = Number(formData.get("weight") || 0);
  const size = String(formData.get("size") || "").trim();
  const vaccinated = String(formData.get("vaccinated") || "") === "true";
  const behaviorNotes = String(formData.get("behaviorNotes") || "").trim();
  const stylePreference = String(formData.get("stylePreference") || "").trim();
  const photoThumbBase64 = String(formData.get("photoThumbBase64") || "").trim();

  if (!name) return { error: "Pet name is required." };
  if (!breed) return { error: "Breed is required." };
  if (!size) return { error: "Size is required." };

  const petRef = await addDoc(collection(db, "customers", phone, "pets"), {
    name,
    breed,
    age,
    weight,
    size,
    vaccinated,
    behaviorNotes,
    stylePreference,
    photoThumbBase64: photoThumbBase64 || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await updateDoc(petRef, { id: petRef.id });

  return { success: true, petId: petRef.id };
}

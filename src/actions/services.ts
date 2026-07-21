"use server";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";
import { getAdminSession } from "@/lib/auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}


export async function saveServiceAction(formData: FormData) {
  const serviceId = String(formData.get("serviceId") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const includedRaw = String(formData.get("included") || "").trim();
  const durationMinutes = Number(formData.get("durationMinutes") || 60);
  const pricingModel = String(formData.get("pricingModel") || "FIXED");
  const basePrice = Number(formData.get("basePrice") || 0);
  const active = formData.get("active") === "on";
  const addonsJson = String(formData.get("addonsJson") || "[]");
  const weightTiersJson = String(formData.get("weightTiersJson") || "[]");

  if (!name) return { error: "Service name is required." };

  let addOns: any[] = [];
  let weightTiers: any[] = [];

  try {
    addOns = JSON.parse(addonsJson);
    weightTiers = JSON.parse(weightTiersJson);
  } catch {
    return { error: "Invalid add-ons or weight tiers data." };
  }

  const id = serviceId || slugify(slugInput || name);

  const payload = {
    id,
    slug: id,
    name,
    description,
    included: includedRaw
      ? includedRaw.split(",").map((x) => x.trim()).filter(Boolean)
      : [],
    durationMinutes,
    pricingModel,
    basePrice: pricingModel === "FIXED" ? basePrice : null,
    weightTiers: pricingModel === "WEIGHT_BASED" ? weightTiers : [],
    addOns,
    active,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };
  console.log("Foreground push received:", payload);
  await setDoc(doc(db, "services", id), payload, { merge: true });

  revalidatePath("/admin/services");
  return { success: true };
}


export async function deleteServiceAction(formData: FormData) {
  const serviceId = String(formData.get("serviceId") || "").trim();
  if (!serviceId) return { error: "Missing service id." };

  await deleteDoc(doc(db, "services", serviceId));
  revalidatePath("/admin/services");
  return { success: true };
}

export async function toggleMyAssignmentAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) return { error: "Unauthorized" };

  const serviceId = String(formData.get("serviceId") || "").trim();
  const mode = String(formData.get("mode") || "").trim();

  if (!serviceId) return { error: "Missing service id." };
  if (mode !== "assign" && mode !== "unassign") {
    return { error: "Invalid mode." };
  }

  const serviceRef = doc(db, "services", serviceId);
  const staffRef = doc(db, "staff", session.id);

  const staffSnap = await getDoc(staffRef);

  if (!staffSnap.exists()) {
    await setDoc(
      staffRef,
      {
        id: session.id,
        name: session.name,
        email: session.email,
        role: session.role,
        availability: {},
        serviceIds: [],
        leaves: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  if (mode === "assign") {
    await updateDoc(serviceRef, {
      staffIds: arrayUnion(session.id),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(
      staffRef,
      {
        serviceIds: arrayUnion(serviceId),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  if (mode === "unassign") {
    await updateDoc(serviceRef, {
      staffIds: arrayRemove(session.id),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(
      staffRef,
      {
        serviceIds: arrayRemove(serviceId),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }

  revalidatePath("/admin/services");
  return { success: true };
}
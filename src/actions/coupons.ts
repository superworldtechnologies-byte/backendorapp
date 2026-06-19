"use server";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/firebase";

function normalizeCode(code: string) {
  return code.trim().toLowerCase();
}

export async function saveCouponAction(formData: FormData) {
  const rawCode = String(formData.get("code") || "").trim();
  const type = String(formData.get("type") || "percent").trim();
  const usageLimit = String(formData.get("usageLimit") || "per_user").trim();
  const value = Number(formData.get("value") || 0);
  const expiresAt = String(formData.get("expiresAt") || "").trim();
  const active = String(formData.get("active") || "") === "on";

  if (!rawCode) return { error: "Coupon code is required." };
  if (!value || value < 0) return { error: "Coupon value is required." };

  const id = normalizeCode(rawCode);

  await setDoc(
    doc(db, "coupons", id),
    {
      id,
      code: rawCode.toUpperCase(),
      type,
      value,
      usageLimit,
      expiresAt: expiresAt || null,
      assignedCustomerIds: [],
      usedBy: [],
      active,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    { merge: true }
  );

  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function deleteCouponAction(formData: FormData) {
  const couponId = String(formData.get("couponId") || "").trim();
  if (!couponId) return { error: "Coupon id missing." };

  await deleteDoc(doc(db, "coupons", couponId));
  revalidatePath("/admin/coupons");
  return { success: true };
}
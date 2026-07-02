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



function toMillis(value: unknown) {
  if (!value) return null;
  const date = new Date(String(value));
  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
}

export async function getAvailableCouponsAction(customerId?: string) {
  try {
    const customerKey = String(customerId || "").trim();
    const snap = await getDocs(collection(db, "coupons"));
    const now = Date.now();

    const coupons = snap.docs
      .map((doc) => {
        const data = doc.data() as any;
        return {
          id: doc.id,
          ...data,
        };
      })
      .filter((coupon) => {
        if (!coupon.active) return false;

        const expiresAtMs = toMillis(coupon.expiresAt);
        if (expiresAtMs && expiresAtMs < now) return false;

        const assignedCustomerIds = Array.isArray(coupon.assignedCustomerIds)
          ? coupon.assignedCustomerIds
          : [];

        const isPublicCoupon = assignedCustomerIds.length === 0;
        const isAssignedToCustomer =
          !!customerKey && assignedCustomerIds.includes(customerKey);

        if (!isPublicCoupon && !isAssignedToCustomer) return false;

        const usedBy = Array.isArray(coupon.usedBy) ? coupon.usedBy : [];
        const usageLimit = String(coupon.usageLimit || "").toLowerCase();

        if (
          usageLimit !== "unlimited" &&
          !!customerKey &&
          usedBy.includes(customerKey)
        ) {
          return false;
        }

        return true;
      })
      .map((coupon) => ({
        id: coupon.id,
        code: String(coupon.code || "").toUpperCase(),
        type: String(coupon.type || "flat"),
        value: Number(coupon.value || 0),
        description: String(coupon.description || ""),
        expiresAt: coupon.expiresAt || null,
      }));

    return { coupons };
  } catch (error) {
    console.error("Failed to load available coupons", error);
    return { coupons: [], error: "Failed to load coupons" };
  }
}
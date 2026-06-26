"use server";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function applyCouponAction(formData: FormData) {
  const code = String(formData.get("code") || "").trim();
  const customerId = String(formData.get("customerId") || "").trim();
  const basePrice = Number(formData.get("basePrice") || 0);

  if (!code) return { error: "Enter coupon code." };

  const id = code.toLowerCase();
  const snap = await getDoc(doc(db, "coupons", id));

  if (!snap.exists()) return { error: "Coupon not found." };

  const coupon = snap.data();

  if (!coupon.active) return { error: "Coupon is inactive." };

  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
    return { error: "Coupon expired." };
  }

  if (coupon.usageLimit === "per_user") {
    const usedBy = Array.isArray(coupon.usedBy) ? coupon.usedBy : [];
    const alreadyUsed = usedBy.some((item: any) => item.customerId === customerId);
    if (alreadyUsed) return { error: "You already used this coupon." };
  }

  let discount = 0;

  if (coupon.type === "percent") {
    discount = Math.round((basePrice * Number(coupon.value || 0)) / 100);
  } else {
    discount = Number(coupon.value || 0);
  }

  return {
    success: true,
    discount,
  };
}